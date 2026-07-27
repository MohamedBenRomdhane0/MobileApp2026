import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { PATHS } from "@config/constants/paths";
import { LEVEL_LABEL_BY_ID } from "@config/enums/Level.enum";
import { useEnsureChildSession } from "@hooks/useEnsureChildSession";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useGetBooksQuery } from "@redux/apis/books/bookApi";
import type {
  BookListItemUI,
  BookTeacherUI,
} from "@redux/apis/books/bookApi.type";
import { useAppTheme } from "@theme/ThemeProvider";
import {
  getBooksLearningResumeMap,
  type BookLearningResume,
} from "@utils/helpers/bookLearningResume.helpers";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";

import {
  BOOKS_PAGINATION,
  BOOKS_UI,
  HEADER_GRADIENT,
} from "./BooksScreen.constants";
import { booksStyles as styles, getBooksPalette } from "./BooksScreen.styles";
import type {
  BooksNav,
  BooksQueryMeta,
  RichBookTeacher,
} from "./BooksScreen.type";
import {
  areResumeMapsEqual,
  buildBooksFileParams,
  formatRating,
  getAccent,
  getAvatarBg,
  getGradient,
  getLabel,
  getTeacherInitials,
  isValidPositiveId,
  resolveBookCardProgress,
  resolveMaterialKey,
  resolveTeacherAvatar,
  shouldShowBookCardProgress,
} from "@utils/helpers/bookScreen.helpers";

const EMPTY_BOOKS: BookListItemUI[] = [];
const EMPTY_TEACHERS: BookTeacherUI[] = [];

const MATERIAL_TRANSLATION_KEY_BY_CODE: Record<string, string> = {
  mat_arabic: "arabic",
  mat_math: "math",
  mat_science: "science",
  mat_french: "french",
  mat_social: "social",
  mat_english: "english",
};

function InfoGlowLayer() {
  return (
    <LinearGradient
      colors={[
        "rgba(34,190,200,0.18)",
        "rgba(34,190,200,0.07)",
        "transparent",
      ]}
      locations={[0, 0.35, 0.65]}
      start={{ x: 0, y: 0.4 }}
      end={{ x: 1, y: 1 }}
      style={styles.infoGlowOverlay}
      pointerEvents="none"
    />
  );
}

function InfoScanlinesLayer() {
  const BANDS = 10;
  const colors: string[] = [];
  const locations: number[] = [];

  for (let i = 0; i < BANDS; i++) {
    const base = i / BANDS;
    const lineStart = base + 0.11 / BANDS;
    const lineEnd = base + 0.13 / BANDS;

    colors.push(
      "transparent",
      "rgba(255,255,255,0.018)",
      "rgba(255,255,255,0.018)",
      "transparent"
    );
    locations.push(base, lineStart, lineEnd, (i + 1) / BANDS);
  }

  return (
    <LinearGradient
      colors={colors as any}
      locations={locations}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.infoScanlinesOverlay}
      pointerEvents="none"
    />
  );
}

export default function BooksScreen() {
  const navigation = useNavigation<BooksNav>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = I18nManager.isRTL;
  const palette = getBooksPalette(colors, isDark);

  const headerData = useActiveChildHeaderData();
  const childLevelId = useMemo(
    () => pickLevelIdFromChild(headerData?.child),
    [headerData?.child]
  );

  const childLevelLabel = useMemo(
    () => (childLevelId ? LEVEL_LABEL_BY_ID[childLevelId] : ""),
    [childLevelId]
  );

  const { canSwitch, isChildReady, isEnsuringChildSession } =
    useEnsureChildSession();

  const [selectedBook, setSelectedBook] = useState<BookListItemUI | null>(null);
  const [resumeMap, setResumeMap] = useState<Record<number, BookLearningResume>>(
    {}
  );

  const { data, isLoading, isFetching, isError, refetch } = useGetBooksQuery(
    { page: BOOKS_PAGINATION.firstPage, keyword: "" },
    { skip: !isChildReady }
  );

  const books = Array.isArray(data?.data) ? data.data : EMPTY_BOOKS;
  const selectedTeachers = (selectedBook?.teachers ?? EMPTY_TEACHERS) as RichBookTeacher[];
  const teachersModalVisible = selectedBook !== null;
  const selectedBookTitle = selectedBook?.title ?? "";
  const selectedBookSubject = selectedBook?.materialName ?? "";

  const meta = (data as { meta?: BooksQueryMeta } | undefined)?.meta;
  const levelLabel = meta?.levelLabel ?? meta?.level_label ?? "";
  const effectiveLevelLabel = childLevelLabel || levelLabel;

  const translateMaterialName = useCallback(
    (raw?: string | null) => {
      const value = String(raw ?? "").trim();
      if (!value) return "";

      const materialCode = resolveMaterialKey(value);
      const translationKey = MATERIAL_TRANSLATION_KEY_BY_CODE[materialCode];

      if (!translationKey) return value;

      const translated = t(`material.${translationKey}`);
      return translated && translated !== `material.${translationKey}`
        ? translated
        : value;
    },
    [t, i18n.language]
  );

  const lessonsCount = useMemo(() => {
    const fromMeta = Number(meta?.lessonsTotal ?? meta?.lessons_total);
    if (Number.isFinite(fromMeta) && fromMeta > 0) return fromMeta;
    return books.reduce((total, book) => total + Number(book.videosCount ?? 0), 0);
  }, [books, meta?.lessonsTotal, meta?.lessons_total]);

  const headerSubtitle = useMemo(() => {
    if (meta?.subtitle && !meta.subtitle.includes("{{")) return meta.subtitle;

    return [
      effectiveLevelLabel,
      `${books.length} ${t(BOOKS_UI.booksLabel, { count: books.length })}`,
      `${lessonsCount} ${t(BOOKS_UI.lessonsLabel, { count: lessonsCount })}`,
    ]
      .filter(Boolean)
      .join(" · ");
  }, [meta?.subtitle, effectiveLevelLabel, books.length, lessonsCount, t]);

  const showLoadingState = isEnsuringChildSession || (isLoading && books.length === 0);
  const showErrorState = isError && books.length === 0;

  const validBookIds = useMemo(
    () => books.map((b) => b.id).filter(isValidPositiveId),
    [books]
  );

  const bookIdsKey = useMemo(() => validBookIds.join(","), [validBookIds]);

  const loadResumeMap = useCallback(async () => {
    if (!bookIdsKey) {
      setResumeMap((prev) => (Object.keys(prev).length === 0 ? prev : {}));
      return;
    }

    const nextMap = await getBooksLearningResumeMap(validBookIds);
    setResumeMap((prev) => (areResumeMapsEqual(prev, nextMap) ? prev : nextMap));
  }, [bookIdsKey, validBookIds]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const run = async () => {
        if (!isActive) return;

        if (!bookIdsKey) {
          setResumeMap((prev) => (Object.keys(prev).length === 0 ? prev : {}));
          return;
        }

        const nextMap = await getBooksLearningResumeMap(validBookIds);
        if (!isActive) return;

        setResumeMap((prev) => (areResumeMapsEqual(prev, nextMap) ? prev : nextMap));
      };

      void run();

      return () => {
        isActive = false;
      };
    }, [bookIdsKey, validBookIds])
  );

  function openBook(book: BookListItemUI) {
    const params = buildBooksFileParams(book, resumeMap);
    if (!params) return;
    navigation.navigate(PATHS.APP.BOOKS_FILE as never, params as never);
  }

  function openTeacherProfile(teacherId: number) {
    if (!isValidPositiveId(teacherId)) return;
    setSelectedBook(null);
    navigation.navigate(PATHS.APP.TEACHER_PROFILE, { teacherId });
  }

  function closeTeachersModal() {
    setSelectedBook(null);
  }

  function openTeachersModal(book: BookListItemUI) {
    setSelectedBook(book);
  }

  function renderTeacherItem({ item, index }: ListRenderItemInfo<RichBookTeacher>) {
    const displayName = item.fullName || t(BOOKS_UI.unknownTeacher);
    const teacherId = item.id;
    const isDisabled = !isValidPositiveId(teacherId);
    const avatarUrl = resolveTeacherAvatar(item);
    const ratingStr = formatRating(item.rating);
    const lessonCount = Number(item.lessonsCount ?? item.videosCount ?? 0);
    const rawSubjectName =
      item.subject ?? item.subjectName ?? selectedBookSubject ?? "";
    const subjectName = translateMaterialName(rawSubjectName);
    const avatarBg = getAvatarBg(index);

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        style={[
          styles.teacherRow,
          {
            backgroundColor: palette.modalCard,
            borderColor: palette.modalBorder,
          },
        ]}
        onPress={() => openTeacherProfile(teacherId)}
        disabled={isDisabled}
      >
        <View style={styles.teacherRowLeft}>
          {!!ratingStr && (
            <View
              style={[
                styles.teacherRatingPill,
                {
                  backgroundColor: isDark
                    ? "rgba(247,201,76,0.14)"
                    : "rgba(247,201,76,0.12)",
                  borderColor: "rgba(247,201,76,0.18)",
                },
              ]}
            >
              <Ionicons name="star" size={11} color="#F7C94C" />
              <Text style={styles.teacherRatingText}>{ratingStr}</Text>
            </View>
          )}

          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={18}
            color={palette.modalMuted}
            style={styles.teacherRowChevron}
          />
        </View>

        <View style={styles.teacherRowInfo}>
          <Text
            numberOfLines={1}
            style={[styles.teacherRowName, { color: palette.modalText }]}
          >
            {displayName}
          </Text>

          <View style={styles.teacherRowMetaRow}>
            {!!subjectName && (
              <View style={styles.teacherRowMetaItem}>
               
                <Text
                  numberOfLines={1}
                  style={[
                    styles.teacherRowMetaText,
                    { color: palette.modalMuted },
                  ]}
                >
                  {subjectName}
                </Text>
                
              </View>
            )}

            {lessonCount > 0 && (
              <View style={styles.teacherRowMetaItem}>
                <Ionicons
                  name="play"
                  size={10}
                  color={palette.modalMuted}
                />
                <Text
                  style={[
                    styles.teacherRowMetaText,
                    { color: palette.modalMuted },
                  ]}
                >
                  {lessonCount} {t(BOOKS_UI.lessonsLabel, { count: lessonCount })}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          style={[
            styles.teacherRowAvatarWrap,
            { borderColor: palette.teacherAvatarBorder },
          ]}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.teacherRowAvatar}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[avatarBg, `${avatarBg}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.teacherRowAvatarFallback}
            >
              <Text style={styles.teacherRowAvatarInitials}>
                {getTeacherInitials(displayName)}
              </Text>
            </LinearGradient>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  function renderBookItem({ item }: ListRenderItemInfo<BookListItemUI>) {
    const materialKey = resolveMaterialKey(item.materialName);
    const gradient = getGradient(materialKey);
    const accent = getAccent(materialKey);
    const label = getLabel(materialKey);

    const hasResume = shouldShowBookCardProgress(item, resumeMap);
    const resolvedProgress = resolveBookCardProgress(
      item,
      resumeMap,
      t(BOOKS_UI.notStartedYet)
    );

    const resumeTitle = resolvedProgress.title;
    const resumeMeta = resolvedProgress.metaLine;

    const translatedMaterial = translateMaterialName(item.materialName);
    const arName = translatedMaterial || label.ar || String(item.materialName ?? "").trim();
    const frName = label.fr || "";
    const buttonLabel = hasResume
      ? t(BOOKS_UI.continueLearning)
      : t(BOOKS_UI.openBook);

    return (
      <View style={styles.cardShadow}>
        <LinearGradient
          colors={gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardRow}>
            <View style={styles.coverWrap}>
              {item.coverUrl ? (
                <Image
                  source={{ uri: item.coverUrl }}
                  style={styles.cover}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.coverFallback,
                    { backgroundColor: palette.coverFallback },
                  ]}
                >
                  <Ionicons
                    name="book-outline"
                    size={28}
                    color={palette.primary}
                  />
                  <Text
                    style={[styles.coverFallbackText, { color: palette.text }]}
                  >
                    {t(BOOKS_UI.noCover)}
                  </Text>
                </View>
              )}

              <View style={styles.coverBadge}>
                <Text style={styles.coverBadgeText}>{item.videosCount ?? 0}</Text>
                <Ionicons name="play" size={10} color={palette.white} />
              </View>
            </View>

            <View style={styles.infoWrap}>
              <InfoGlowLayer />
              <InfoScanlinesLayer />

              <View style={styles.infoContent}>
                <View style={styles.titleBlock}>
                  <Text numberOfLines={2} style={styles.bookTitle}>
                    {arName || t(BOOKS_UI.unnamed)}
                  </Text>

                  {!!frName && (
                    <Text numberOfLines={1} style={styles.bookSubtitle}>
                      {frName}
                    </Text>
                  )}
                </View>

                <View style={styles.middleSection}>
                  {hasResume ? (
                    <>
                      <View style={styles.resumeHeaderRow}>
                       
                        <Text style={styles.resumeHeaderText}>
                          {t(BOOKS_UI.lastPosition)}
                        </Text>
                         <Ionicons
                          name="location-sharp"
                          size={11}
                          color={accent}
                        />
                      </View>

                      <Text numberOfLines={2} style={styles.resumeTitle}>
                        {resumeTitle}
                      </Text>

                      {!!resumeMeta && (
                        <View style={styles.resumeTimeRow}>
                          <Ionicons
                            name="time-outline"
                            size={11}
                            color="rgba(255,255,255,0.58)"
                          />
                          <Text numberOfLines={1} style={styles.resumeTimeText}>
                            {resumeMeta}
                          </Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.pageChip}>
                      <Ionicons
                        name="document-text-outline"
                        size={13}
                        color="rgba(255,255,255,0.84)"
                      />
                      <Text style={styles.pageChipText}>
                        {t(BOOKS_UI.pageCounts, { count: item.pagesTotal ?? 0 })}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.bottomSection}>
                  <View style={styles.chipsRow}>
                    <View style={styles.countChipDark}>
                      <Text style={styles.countChipText}>
                        {item.videosCount ?? 0}
                      </Text>
                      <Ionicons
                        name="play"
                        size={10}
                        color="rgba(255,255,255,0.82)"
                        style={styles.countChipIcon}
                      />
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.countChip,
                        Number(item.teachersCount ?? 0) <= 0 &&
                          styles.countChipDisabled,
                      ]}
                      onPress={() => openTeachersModal(item)}
                      disabled={Number(item.teachersCount ?? 0) <= 0}
                    >
                      <Text style={styles.countChipText}>
                        {item.teachersCount ?? 0}
                      </Text>
                      <Text style={styles.countChipEmoji}>🧑‍🏫</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.88}
                    style={[styles.openButton, { backgroundColor: accent }]}
                    onPress={() => openBook(item)}
                  >
                    <Text style={styles.openButtonText}>{buttonLabel}</Text>
                    <Ionicons
                      name="play"
                      size={13}
                      color={palette.white}
                      style={styles.openButtonIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!canSwitch) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <Ionicons
          name="alert-circle-outline"
          size={28}
          color={palette.primary}
        />
        <Text style={[styles.emptyTitle, { color: palette.text }]}>
          {t(BOOKS_UI.noActiveChild)}
        </Text>
      </View>
    );
  }

  if (showLoadingState) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <ActivityIndicator color={palette.primary} size="large" />
        <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
          {t(BOOKS_UI.loading)}
        </Text>
      </View>
    );
  }

  if (showErrorState) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <Ionicons
          name="cloud-offline-outline"
          size={30}
          color={palette.danger}
        />
        <Text style={[styles.emptyTitle, { color: palette.text }]}>
          {t(BOOKS_UI.genericError)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={refetch}
          style={[
            styles.retryButton,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <Text style={[styles.retryButtonText, { color: palette.text }]}>
            {t(BOOKS_UI.retry)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedBookSubjectTranslated = translateMaterialName(selectedBookSubject);

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <LinearGradient
        colors={HEADER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerWrap, { paddingTop: insets.top + 6 }]}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.title}>{t(BOOKS_UI.title)}</Text>

            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {headerSubtitle}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.content, { backgroundColor: palette.bg }]}>
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderBookItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 108 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={async () => {
                await refetch();
                await loadResumeMap();
              }}
              tintColor={palette.primary}
              colors={[palette.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons
                name="library-outline"
                size={30}
                color={palette.primary}
              />
              <Text style={[styles.emptyTitle, { color: palette.text }]}>
                {t(BOOKS_UI.emptyTitle)}
              </Text>
              <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
                {t(BOOKS_UI.emptySubtitle)}
              </Text>
            </View>
          }
        />
      </View>

      <Modal
        visible={teachersModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={closeTeachersModal}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={[
              styles.modalBackdrop,
              { backgroundColor: palette.modalOverlay },
            ]}
            onPress={closeTeachersModal}
          />

          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: palette.modalSurface,
                borderColor: palette.modalBorder,
                paddingBottom: insets.bottom + 18,
              },
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                { backgroundColor: palette.modalHandle },
              ]}
            />

            <View style={styles.modalHeader}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.modalCloseBtn,
                  {
                    backgroundColor: palette.modalCloseBg,
                    borderColor: palette.modalBorder,
                  },
                ]}
                onPress={closeTeachersModal}
              >
                <Ionicons name="close" size={20} color={palette.modalMuted} />
              </TouchableOpacity>

              <View style={styles.modalTitleWrap}>
                <Text style={[styles.modalTitle, { color: palette.modalText }]}>
                  {t(BOOKS_UI.teachersTitle)}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.modalSubtitle,
                    { color: palette.modalMuted },
                  ]}
                >
                  {selectedBookSubjectTranslated || selectedBookTitle}
                  {selectedTeachers.length > 0
                    ? ` · ${selectedTeachers.length} ${t(BOOKS_UI.teacherLabel, {
                        count: selectedTeachers.length,
                      })}`
                    : ""}
                </Text>
              </View>

              <View style={styles.modalHeaderSpacer} />
            </View>

            <FlatList
              data={selectedTeachers}
              keyExtractor={(item, index) =>
                item.id > 0
                  ? String(item.id)
                  : `${item.fullName || "teacher"}-${index}`
              }
              renderItem={renderTeacherItem}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalListContent}
              ListEmptyComponent={
                <View style={styles.modalEmptyWrap}>
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={palette.primary}
                  />
                  <Text
                    style={[
                      styles.modalEmptyText,
                      { color: palette.modalMuted },
                    ]}
                  >
                    {t(BOOKS_UI.teachersEmpty)}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}