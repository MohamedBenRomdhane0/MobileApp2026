import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
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
import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId } from "@redux/slices/authSlice";
import { LIQUID } from "@styles/liquidTheme";
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
  MATERIAL_ORDER,
} from "./BooksScreen.constants";
import {
  booksStyles as styles,
  getBooksPalette,
} from "./BooksScreen.styles";
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

function InfoGlowLayer({ accent }: { accent: string }) {
  return (
    <LinearGradient
      colors={[`${accent}2E`, `${accent}12`, "transparent"]}
      locations={[0, 0.35, 0.65]}
      start={{ x: 0, y: 0.4 }}
      end={{ x: 1, y: 1 }}
      style={styles.infoGlowOverlay}
      pointerEvents="none"
    />
  );
}

const COVER_SWAY_MS = 2600;

/**
 * The book cover rendered as a 3D object: it gently sways (rotateY / rotateX +
 * bob) like a floating book and leans forward when pressed. All layers inside
 * (image, gloss, spine) stay flat on the stage.
 */
function BookCover3D({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const sway = useSharedValue(0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    sway.value = withRepeat(
      withTiming(1, {
        duration: COVER_SWAY_MS,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, [sway]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 700 },
      { translateY: sway.value * -7 },
      { rotateY: `${sway.value * 10 - 5}deg` },
      { rotateX: `${-sway.value * 8 + 4}deg` },
      { scale: 1 + pressed.value * 0.05 },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withSpring(1, LIQUID.spring);
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, LIQUID.spring);
      }}
      style={styles.coverStage}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.coverStage, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
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
      locations={locations as unknown as readonly [number, number, ...number[]]}
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

  const { canSwitch, isEnsuringChildSession } =
    useEnsureChildSession();

  const activeChildId = useAppSelector(selectActiveChildId);

  const [selectedBook, setSelectedBook] = useState<BookListItemUI | null>(null);
  const [selectedMaterialKey, setSelectedMaterialKey] = useState<string>("all");
  const [cardLayout, setCardLayout] = useState<"vertical" | "horizontal">(
    "vertical"
  );
  const [resumeMap, setResumeMap] = useState<Record<number, BookLearningResume>>(
    {}
  );

  const { data, isLoading, isFetching, isError, refetch } = useGetBooksQuery(
    {
      page: BOOKS_PAGINATION.firstPage,
      keyword: "",
      childId: activeChildId ?? undefined,
    },
    { skip: !activeChildId }
  );

  const books = Array.isArray(data?.data) ? data.data : EMPTY_BOOKS;

  const filterOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const book of books) {
      const key = resolveMaterialKey(book.materialName);
      if (key !== "default") seen.add(key);
    }
    return MATERIAL_ORDER.filter((key) => seen.has(key));
  }, [books]);

  const materialCounts = useMemo(() => {
    const counts = new Map<string, number>();
    counts.set("all", books.length);
    for (const book of books) {
      const key = resolveMaterialKey(book.materialName);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [books]);

  const visibleBooks = useMemo(() => {
    if (selectedMaterialKey === "all") return books;
    return books.filter(
      (book) => resolveMaterialKey(book.materialName) === selectedMaterialKey
    );
  }, [books, selectedMaterialKey]);

  const materialChipLabel = useCallback(
    (key: string): string => {
      if (key === "all") return t(BOOKS_UI.filterAll);
      const translationKey = MATERIAL_TRANSLATION_KEY_BY_CODE[key];
      if (translationKey) {
        const translated = t(`material.${translationKey}`);
        if (translated && translated !== `material.${translationKey}`) {
          return translated;
        }
      }
      return getLabel(key).ar || t(BOOKS_UI.filterAll);
    },
    [t]
  );

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
    return effectiveLevelLabel || t(BOOKS_UI.subtitle);
  }, [effectiveLevelLabel, meta?.subtitle, t]);

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
    navigation.navigate(PATHS.APP.BOOKS_FILE, params);
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

  function renderBookItem({
    item,
    index,
  }: ListRenderItemInfo<BookListItemUI>) {
    const materialKey = resolveMaterialKey(item.materialName);
    const gradient = getGradient(materialKey, item.materialColor);
    const accent = getAccent(materialKey, item.materialColor);
    const label = getLabel(materialKey);

    const isLastGridOrphan =
      cardLayout === "horizontal" && index === visibleBooks.length - 1;
    const isFullWidth = cardLayout === "vertical" || isLastGridOrphan;

    const hasResume = shouldShowBookCardProgress(item, resumeMap);
    const resolvedProgress = resolveBookCardProgress(
      item,
      resumeMap,
      t(BOOKS_UI.notStartedYet)
    );

    const resumeTitle = resolvedProgress.title;
    const resumeMeta = resolvedProgress.metaLine;

    const translatedMaterial = translateMaterialName(item.materialName);
    const rawName = String(item.materialName ?? "").trim();
    const realTitle = String(item.title ?? "").trim();
    const hasRealTitle = realTitle.length > 0;
    const arName = translatedMaterial || label.ar || rawName;
    const displayTitle = realTitle || arName || t(BOOKS_UI.unnamed);
    const frName = label.fr || "";
    const showMatiereRow =
      hasRealTitle &&
      Boolean(translatedMaterial) &&
      translatedMaterial !== realTitle;
    const showFrSubtitle =
      hasRealTitle &&
      frName &&
      frName.toLowerCase() !== realTitle.toLowerCase();

    const lastPageNumber = resolvedProgress.pageNumber;
    const bookPagesTotal = Number(item.pagesTotal ?? 0);
    const pageBasedPercent =
      typeof lastPageNumber === "number" &&
      lastPageNumber > 0 &&
      bookPagesTotal > 0
        ? Math.round((lastPageNumber / bookPagesTotal) * 100)
        : 0;
    const bookProgressPercent = Math.max(
      0,
      Math.min(100, pageBasedPercent || Number(item.progress ?? 0))
    );

    const MAX_BOOK_NAME_LETTERS = 14;
    const displayName =
      displayTitle.length > MAX_BOOK_NAME_LETTERS
        ? `${displayTitle.slice(0, MAX_BOOK_NAME_LETTERS)}…`
        : displayTitle;

    const resumeIsBookName =
      resumeTitle === realTitle ||
      resumeTitle === arName ||
      resumeTitle === rawName ||
      resumeTitle === displayTitle;
    const showResumeTitle = resumeTitle.length > 0 && !resumeIsBookName;
    const buttonLabel = hasResume
      ? t(BOOKS_UI.continueLearning)
      : t(BOOKS_UI.openBook);

    const spineSideStyle = isRTL
      ? styles.coverSpineStart
      : styles.coverSpineEnd;

    return (
      <View
        style={[styles.cardShadow, isLastGridOrphan && styles.cardGridFull]}
      >
        <LinearGradient
          colors={gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            isFullWidth
              ? styles.cardOneCol
              : styles.cardTwoColVertical,
          ]}
        >
          <View
            style={[
              styles.cardRow,
              isFullWidth
                ? styles.cardRowHorizontal
                : styles.cardRowVerticalContent,
            ]}
          >
            <View
                style={[
                  styles.coverWrap,
                  isFullWidth
                    ? styles.coverWrapHorizontal
                    : styles.coverWrapVerticalContent,
                ]}
            >
              <View style={styles.coverPad}>
                <View style={styles.coverGroundShadow} pointerEvents="none" />

                <BookCover3D onPress={() => openBook(item)}>
                  <LinearGradient
                    colors={gradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.coverCard}
                  >
                    {item.coverUrl ? (
                      <Image
                        source={{ uri: item.coverUrl }}
                        style={styles.cover}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.coverFallback}>
                        <Ionicons
                          name="book-outline"
                          size={30}
                          color="rgba(255,255,255,0.95)"
                        />
                        <Text style={styles.coverFallbackText}>
                          {t(BOOKS_UI.noCover)}
                        </Text>
                      </View>
                    )}

                    <View style={spineSideStyle} pointerEvents="none" />

                    <LinearGradient
                      colors={[
                        "rgba(255,255,255,0.30)",
                        "rgba(255,255,255,0)",
                      ]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={styles.coverGloss}
                      pointerEvents="none"
                    />
                  </LinearGradient>
                </BookCover3D>
              </View>

              <View style={styles.coverBadge}>
                <Text style={styles.coverBadgeText}>{item.videosCount ?? 0}</Text>
                <Ionicons name="play" size={10} color={palette.white} />
              </View>
            </View>

            <View style={styles.infoWrap}>
              <InfoGlowLayer accent={accent} />
              <LinearGradient
                colors={[
                  "rgba(6,14,24,0.42)",
                  "rgba(6,14,24,0.10)",
                  "transparent",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.infoScrim}
                pointerEvents="none"
              />
              <InfoScanlinesLayer />

              <View style={styles.infoContent}>
                <View style={styles.titleBlock}>
                  {showMatiereRow && (
                    <View style={styles.matiereRow}>
                      <View
                        style={[
                          styles.matiereDot,
                          { backgroundColor: accent },
                        ]}
                      />
                      <Text numberOfLines={1} style={styles.matiereText}>
                        {translatedMaterial}
                      </Text>
                    </View>
                  )}

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.bookTitle,
                      isFullWidth && styles.bookTitleVertical,
                    ]}
                  >
                    {displayName}
                  </Text>

                  {/* {!!showFrSubtitle && (
                    <Text numberOfLines={1} style={styles.bookSubtitle}>
                      {frName}
                    </Text>
                  )} */}
                </View>

                <View style={styles.middleSection}>
                  {hasResume ? (
                    <>
                      <View style={styles.resumeHeaderRow}>
                        <Text
                            style={[
                              styles.resumeHeaderText,
                              isFullWidth &&
                                styles.resumeHeaderTextVertical,
                            ]}
                        >
                          {t(BOOKS_UI.lastPosition)}
                        </Text>
                        <Ionicons
                          name="location-sharp"
                          size={11}
                          color={accent}
                        />
                      </View>

                      {showResumeTitle && (
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.resumeTitle,
                            isFullWidth &&
                              styles.resumeTitleVertical,
                          ]}
                        >
                          {resumeTitle}
                        </Text>
                      )}

                      {!!resumeMeta && (
                        <View style={styles.resumeTimeRow}>
                          <Ionicons
                            name="time-outline"
                            size={11}
                            color="rgba(255,255,255,0.58)"
                          />
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.resumeTimeText,
                              isFullWidth &&
                                styles.resumeTimeTextVertical,
                            ]}
                          >
                            {resumeMeta}
                          </Text>
                        </View>
                      )}

                      {bookProgressPercent > 0 && (
                        <View style={styles.resumeProgressRow}>
                          <View style={styles.resumeProgressTrack}>
                            <View
                              style={[
                                styles.resumeProgressFill,
                                {
                                  width: `${bookProgressPercent}%`,
                                  backgroundColor: accent,
                                },
                              ]}
                            />
                          </View>
                          <Text
                            style={[
                              styles.resumeProgressPct,
                              isFullWidth &&
                                styles.resumeProgressPctVertical,
                            ]}
                          >
                            {Math.round(bookProgressPercent)}%
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
                      <Ionicons
                        name="people-outline"
                        size={12}
                        color="rgba(255,255,255,0.9)"
                      />
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
        <View
          style={[
            styles.stateCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <View
            style={[
              styles.stateIconBadge,
              { backgroundColor: `${palette.primary}18` },
            ]}
          >
            <Ionicons name="alert-circle-outline" size={22} color={palette.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: palette.text }]}>
            {t(BOOKS_UI.noActiveChild)}
          </Text>
        </View>
      </View>
    );
  }

  if (showLoadingState) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <View
          style={[
            styles.stateCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <View
            style={[
              styles.stateIconBadge,
              { backgroundColor: `${palette.primary}18` },
            ]}
          >
            <ActivityIndicator color={palette.primary} size="small" />
          </View>
          <Text style={[styles.emptyTitle, { color: palette.text }]}>
            {t(BOOKS_UI.loading)}
          </Text>
          <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
            {t(BOOKS_UI.subtitle)}
          </Text>
        </View>
      </View>
    );
  }

  if (showErrorState) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <View
          style={[
            styles.stateCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <View
            style={[
              styles.stateIconBadge,
              { backgroundColor: `${palette.danger}16` },
            ]}
          >
            <Ionicons name="cloud-offline-outline" size={22} color={palette.danger} />
          </View>
          <Text style={[styles.emptyTitle, { color: palette.text }]}>
            {t(BOOKS_UI.genericError)}
          </Text>
          <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
            {t(BOOKS_UI.retry)}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={refetch}
            style={[
              styles.retryButton,
              {
                backgroundColor: palette.primary,
                shadowColor: palette.primary,
              },
            ]}
          >
            <Text style={[styles.retryButtonText, { color: palette.white }]}>
              {t(BOOKS_UI.retry)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  const selectedBookSubjectTranslated = translateMaterialName(selectedBookSubject);
  const headerTextAlign = isRTL ? "right" : "left";

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <LinearGradient
        colors={HEADER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerWrap, { paddingTop: insets.top + 4 }]}
      >
        <View style={styles.headerGlowA} pointerEvents="none" />
        <View style={styles.headerGlowB} pointerEvents="none" />
        <View style={styles.headerGlowC} pointerEvents="none" />

        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleBlock}>
            <Text style={[styles.title, { textAlign: headerTextAlign }]}>
              {t(BOOKS_UI.title)}
            </Text>

            <Text
              numberOfLines={1}
              style={[styles.headerSubtitle, { textAlign: headerTextAlign }]}
            >
              {headerSubtitle}
            </Text>
          </View>

          <View style={styles.layoutToggle}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setCardLayout("vertical")}
              style={[
                styles.layoutToggleBtn,
                cardLayout === "vertical" && styles.layoutToggleBtnActive,
              ]}
            >
              <Ionicons
                name="albums-outline"
                size={16}
                color={
                  cardLayout === "vertical" ? "#12324A" : "rgba(255,255,255,0.75)"
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setCardLayout("horizontal")}
              style={[
                styles.layoutToggleBtn,
                cardLayout === "horizontal" && styles.layoutToggleBtnActive,
              ]}
            >
              <Ionicons
                name="reorder-three-outline"
                size={16}
                color={
                  cardLayout === "horizontal"
                    ? "#12324A"
                    : "rgba(255,255,255,0.75)"
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerAvatarWrap}>
            <ActiveChildHeaderAvatar />
          </View>
        </View>

        <View style={styles.headerStatsRow}>
          <View style={styles.headerStatPill}>
            <Ionicons name="albums-outline" size={11} color="#FFFFFF" />
            <Text style={styles.headerStatText} numberOfLines={1}>
              {t(BOOKS_UI.booksLabel, { count: books.length })}
            </Text>
          </View>
          <View style={styles.headerStatPill}>
            <Ionicons name="play-circle-outline" size={11} color="#FFFFFF" />
            <Text style={styles.headerStatText} numberOfLines={1}>
              {t(BOOKS_UI.lessonsLabel, { count: lessonsCount })}
            </Text>
          </View>
          <View style={styles.headerStatPill}>
            <Ionicons name="school-outline" size={11} color="#FFFFFF" />
            <Text style={styles.headerStatText} numberOfLines={1}>
              {effectiveLevelLabel || t(BOOKS_UI.title)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.content, { backgroundColor: palette.bg }]}>
        {filterOptions.length > 0 && (
          <View style={styles.filterWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.filterContent}
            >
              {["all", ...filterOptions].map((key) => {
                      const isActive = selectedMaterialKey === key;
                      const accent =
                        key === "all" ? palette.primary : getAccent(key);
                      const count = materialCounts.get(key) ?? 0;
                      const chipGradient =
                        key === "all"
                          ? getGradient("default")
                          : getGradient(key);

                      if (isActive) {
                        return (
                          <TouchableOpacity
                            key={key}
                            activeOpacity={0.85}
                            onPress={() => setSelectedMaterialKey(key)}
                            style={[
                              styles.filterChip,
                              { borderColor: "rgba(255,255,255,0.55)" },
                            ]}
                          >
                            <LinearGradient
                              colors={chipGradient as [string, string]}
                              start={{ x: 0.15, y: 0 }}
                              end={{ x: 0.85, y: 1 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <LinearGradient
                              colors={[
                                "rgba(255,255,255,0.55)",
                                "rgba(255,255,255,0)",
                              ]}
                              start={{ x: 0.5, y: 0 }}
                              end={{ x: 0.5, y: 1 }}
                              style={styles.filterChipGloss}
                              pointerEvents="none"
                            />
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.filterChipText,
                                { color: palette.white },
                              ]}
                            >
                              {materialChipLabel(key)}
                            </Text>
                            <View style={styles.filterChipCountActive}>
                              <Text
                                style={[
                                  styles.filterChipCountText,
                                  { color: palette.white },
                                ]}
                              >
                                {count}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }

                      return (
                        <TouchableOpacity
                          key={key}
                          activeOpacity={0.85}
                          onPress={() => setSelectedMaterialKey(key)}
                          style={[
                            styles.filterChip,
                            {
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.10)"
                                : "rgba(255,255,255,0.55)",
                              borderColor: isDark
                                ? "rgba(255,255,255,0.18)"
                                : "rgba(34,190,200,0.30)",
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.filterChipDot,
                              { backgroundColor: accent },
                            ]}
                          />
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.filterChipText,
                              { color: accent },
                            ]}
                          >
                            {materialChipLabel(key)}
                          </Text>
                          <View
                            style={[
                              styles.filterChipCount,
                              { backgroundColor: `${accent}1A` },
                            ]}
                          >
                            <Text
                              style={[
                                styles.filterChipCountText,
                                { color: accent },
                              ]}
                            >
                              {count}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
          </View>
        )}

        <FlatList
          key={cardLayout}
          style={styles.list}
          data={visibleBooks}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderBookItem}
          numColumns={cardLayout === "vertical" ? 1 : 2}
          columnWrapperStyle={
            cardLayout === "horizontal" ? styles.gridRow : undefined
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            cardLayout === "vertical" ? styles.listContentVertical : null,
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
            selectedMaterialKey !== "all" ? (
              <View style={styles.emptyWrap}>
                <View
                  style={[
                    styles.stateCard,
                    {
                      backgroundColor: palette.card,
                      borderColor: palette.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.stateIconBadge,
                      { backgroundColor: `${palette.primary}18` },
                    ]}
                  >
                    <Ionicons
                      name="filter-outline"
                      size={22}
                      color={palette.primary}
                    />
                  </View>
                  <Text style={[styles.emptyTitle, { color: palette.text }]}>
                    {t(BOOKS_UI.filterNoResultsTitle)}
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
                    {t(BOOKS_UI.filterNoResultsSub)}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <View
                  style={[
                    styles.stateCard,
                    {
                      backgroundColor: palette.card,
                      borderColor: palette.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.stateIconBadge,
                      { backgroundColor: `${palette.primary}18` },
                    ]}
                  >
                    <Ionicons
                      name="library-outline"
                      size={22}
                      color={palette.primary}
                    />
                  </View>
                  <Text style={[styles.emptyTitle, { color: palette.text }]}>
                    {t(BOOKS_UI.emptyTitle)}
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
                    {t(BOOKS_UI.emptySubtitle)}
                  </Text>
                </View>
              </View>
            )
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