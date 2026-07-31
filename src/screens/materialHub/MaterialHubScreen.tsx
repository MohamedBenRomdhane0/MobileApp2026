import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId } from "@redux/slices/authSlice";
import { useSwitchToChildMutation } from "@redux/apis/child/childApi";

import { useGetBooksQuery } from "@redux/apis/books/bookApi";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";

import { useGetCoursesQuery } from "@redux/apis/courses/coursesApi";
import type { CourseListItemUI } from "@redux/apis/courses/coursesApi.type";

import type { MaterialHubTabKey } from "./MaterialHubScreen.types";
import { HUB_MOCK, HUB_UI } from "./MaterialHubScreen.constants";
import { createMaterialHubStyles } from "./MaterialHubScreen.styles";

import {
  courseCoverSource,
  getLastRowStartIndex,
  normalizeMaterialKey,
  progressToPct,
  toValidId,
  chevronIconName,
} from "@utils/helpers/MaterialHub.helpers";

type MaterialHubRouteProp = RouteProp<RootStackParamList, typeof PATHS.APP.MATERIAL_HUB>;

const COLUMNS = 2;
const TAB_KEYS: MaterialHubTabKey[] = ["book", "lessons", "live", "exercises"];

export default function MaterialHubScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<MaterialHubRouteProp>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const styles = useMemo(() => createMaterialHubStyles(colors, isDark), [colors, isDark]);

  const levelId = toValidId(route.params?.levelId);
  const materialId = toValidId(route.params?.materialId);

  const rawName = String(route.params?.materialName ?? "").trim();
  const normalized = useMemo(() => normalizeMaterialKey(rawName), [rawName]);

  const materialTitle = useMemo(
    () =>
      t(`material.${normalized}`, {
        defaultValue: rawName || t(HUB_UI.materialId),
      }),
    [t, normalized, rawName]
  );

  const [activeTab, setActiveTab] = useState<MaterialHubTabKey>("book");

  const activeChildId = useAppSelector(selectActiveChildId);
  const childAccessToken = useAppSelector((s) => s.auth.childAccessToken);
  const [switchToChild, switchState] = useSwitchToChildMutation();

  const canSwitch = typeof activeChildId === "number" && activeChildId > 0;
  const needsChildToken = !childAccessToken;
  const lastSwitchChildIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!needsChildToken) {
      lastSwitchChildIdRef.current = null;
      return;
    }
    if (!canSwitch) return;
    if (lastSwitchChildIdRef.current === activeChildId) return;
    if (switchState.isSuccess) return;
    if (switchState.isLoading) return;

    lastSwitchChildIdRef.current = activeChildId;

    switchToChild({ childId: activeChildId })
      .unwrap()
      .catch(() => {
        lastSwitchChildIdRef.current = null;
      });
  }, [needsChildToken, canSwitch, activeChildId, switchToChild, switchState.isLoading, switchState.isSuccess]);

  const isChildReady = canSwitch && !!childAccessToken;

  const canFetchBooks = isChildReady && materialId > 0;
  const {
    data: booksData,
    isLoading: booksLoading,
    isFetching: booksFetching,
    isError: booksError,
    refetch: refetchBooks,
  } = useGetBooksQuery({ page: 1, perPage: 50, materialId }, { skip: !canFetchBooks });

  const books: BookListItemUI[] = useMemo(
    () => (Array.isArray((booksData as any)?.data) ? ((booksData as any).data as BookListItemUI[]) : []),
    [booksData]
  );

  const canFetchCourses = isChildReady && materialId > 0 && activeTab === "lessons";
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isFetching: coursesFetching,
    isError: coursesError,
    refetch: refetchCourses,
  } = useGetCoursesQuery({ page: 1, perPage: 50, levelId, materialId }, { skip: !canFetchCourses });

  const courses: CourseListItemUI[] = useMemo(() => {
    const items = (coursesData as any)?.items;
    return Array.isArray(items) ? (items as CourseListItemUI[]) : [];
  }, [coursesData]);

  const lastBooksRowStartIndex = useMemo(() => getLastRowStartIndex(books.length, COLUMNS), [books.length]);
  const lastCoursesRowStartIndex = useMemo(() => getLastRowStartIndex(courses.length, COLUMNS), [courses.length]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const openBookFile = useCallback(
    (bookId: number) => {
      const id = toValidId(bookId);
      if (!id) return;
      navigation.navigate(PATHS.APP.BOOKS_FILE, { bookId: id });
    },
    [navigation]
  );

  const openCourse = useCallback(
    (courseId: number) => {
      const id = toValidId(courseId);
      if (!id) return;
      navigation.navigate(PATHS.APP.COURSE_CHAPTERS, { courseId: id });
    },
    [navigation]
  );

  const headerGradientColors: [string, string, string] = useMemo(
    () => (isDark ? ["#0B1220", colors.header, "#060B14"] : ["#153A6B", colors.header, "#091D36"]),
    [isDark, colors.header]
  );

  const metaLine = useMemo(() => {
    const levelLabel = levelId ? String(levelId) : "-";
    const matLabel = materialId ? String(materialId) : "-";
    return `${t(HUB_UI.level)} • ${levelLabel} • ${t(HUB_UI.materialId)} • ${matLabel}`;
  }, [t, levelId, materialId, HUB_UI.level, HUB_UI.materialId]);

  const tabCount = TAB_KEYS.length;
  const tabsShouldScroll = tabCount > 4;

  const tabsContentContainerStyle = useMemo(
    () => [styles.tabsRow, !tabsShouldScroll ? { flexGrow: 1, justifyContent: "center" as const } : null],
    [styles.tabsRow, tabsShouldScroll]
  );

  const tabsInnerStyle = useMemo(
    () => [styles.tabsRowInner, !tabsShouldScroll ? { flexGrow: 1, justifyContent: "center" as const } : null],
    [styles.tabsRowInner, tabsShouldScroll]
  );

  const renderBook = useCallback(
    ({ item, index }: { item: BookListItemUI; index: number }) => {
      const title = String(item?.title ?? "").trim() || t("common.unnamed");
      const count = Number((item as any)?.pagesTotal ?? 0);
      const pct = progressToPct(item);

      const isInLastIncompleteRow = lastBooksRowStartIndex >= 0 && index >= lastBooksRowStartIndex;

      return (
        <View style={[styles.gridCardWrap, isInLastIncompleteRow ? { marginLeft: "auto" } : null]}>
          <TouchableOpacity activeOpacity={0.92} style={styles.gridCard} onPress={() => openBookFile(item.id)}>
            {item?.coverUrl ? (
              <ImageBackground source={{ uri: item.coverUrl }} style={styles.gridCoverBg} resizeMode="cover">
                <View style={styles.gridCoverOverlay} />
                <View style={styles.gridThumbWrap}>
                  <Image source={{ uri: item.coverUrl }} style={styles.gridThumb} resizeMode="cover" />
                </View>
              </ImageBackground>
            ) : (
              <View style={styles.gridCoverEmpty}>
                <Ionicons name="book-outline" size={28} color={colors.primary} />
                <Text style={styles.gridCoverEmptyText}>{t("book.no_cover")}</Text>
              </View>
            )}

            <View style={styles.gridBody}>
              <Text numberOfLines={2} style={styles.gridTitle}>
                {title}
              </Text>

              <TouchableOpacity activeOpacity={0.9} style={styles.gridPill} onPress={() => openBookFile(item.id)}>
                <Ionicons name="play-circle" size={16} color={colors.header} />
                <Text style={styles.gridPillText}>{t("book.pages_counts", { count })}</Text>
              </TouchableOpacity>

              <View style={styles.gridProgressRow}>
                <Text style={styles.gridPct}>{`${pct}%`}</Text>
                <View style={styles.gridTrack}>
                  <View style={[styles.gridFill, { width: `${pct}%`, backgroundColor: colors.primary }]} />
                </View>
              </View>

              <View style={styles.gridCtaRow}>
                <Ionicons name={chevronIconName()} size={18} color={colors.muted} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [colors.header, colors.muted, colors.primary, lastBooksRowStartIndex, openBookFile, styles, t]
  );

  const renderCourse = useCallback(
    ({ item, index }: { item: CourseListItemUI; index: number }) => {
      const title = String(item?.title ?? "").trim() || t("common.unnamed");
      const teacherName = (item as any)?.teacher?.fullName ? String((item as any).teacher.fullName) : "";
      const teacherAvatarUrl = String((item as any)?.teacher?.avatarUrl ?? "").trim() || null;

      const coverSrc = courseCoverSource(item);
      const isInLastIncompleteRow = lastCoursesRowStartIndex >= 0 && index >= lastCoursesRowStartIndex;

      return (
        <View style={[styles.gridCardWrap, isInLastIncompleteRow ? { marginLeft: "auto" } : null]}>
          <TouchableOpacity activeOpacity={0.92} style={styles.gridCard} onPress={() => openCourse(item.id)}>
            <ImageBackground source={coverSrc} style={styles.gridCoverBg} resizeMode="cover">
              <View style={styles.gridCoverOverlay} />
              <View style={styles.gridThumbWrap}>
                <Image source={coverSrc} style={styles.gridThumb} resizeMode="cover" />
              </View>
            </ImageBackground>

            <View style={styles.gridBody}>
              <Text numberOfLines={2} style={styles.gridTitle}>
                {title}
              </Text>

              {teacherName ? (
                <View style={styles.teacherRow}>
                  {teacherAvatarUrl ? (
                    <Image source={{ uri: teacherAvatarUrl }} style={styles.teacherAvatar} />
                  ) : (
                    <Ionicons name="person-circle-outline" size={22} color={colors.muted} />
                  )}
                  <Text numberOfLines={1} style={styles.teacherName}>
                    {teacherName}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity activeOpacity={0.95} onPress={() => openCourse(item.id)} style={styles.courseCtaWrap}>
                <LinearGradient
                  colors={[colors.primary, colors.header]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.courseCta}
                >
                  <Ionicons name="play-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.courseCtaText}>{t("course.start_now")}</Text>
                  <Ionicons
                    name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                    size={16}
                    color="rgba(255,255,255,0.92)"
                  />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.gridCtaRow} />
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [colors.header, colors.muted, colors.primary, lastCoursesRowStartIndex, openCourse, styles, t]
  );

  const showSwitchLoading = needsChildToken && canSwitch && switchState.isLoading;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.headerShell}>
        <LinearGradient
          colors={headerGradientColors}
          start={{ x: 0.08, y: 0.05 }}
          end={{ x: 0.95, y: 1 }}
          style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 14) }]}
        >
          <View style={styles.headerGlowA} />
          <View style={styles.headerGlowB} />

          <View style={styles.headerTopRow}>
            <TouchableOpacity activeOpacity={0.9} onPress={goBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitles}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {materialTitle}
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                {metaLine}
              </Text>
            </View>

            <View style={styles.headerRightSlot} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.tabsShell}>
        <ScrollView
          horizontal
          scrollEnabled={tabsShouldScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tabsContentContainerStyle}
        >
          <View style={tabsInnerStyle}>
            {TAB_KEYS.map((key) => {
              const isActive = key === activeTab;
              const bg = isActive ? colors.primary : colors.card;
              const fg = isActive ? "#FFFFFF" : colors.text;

              const iconMap: Record<MaterialHubTabKey, any> = {
                book: "albums",
                lessons: "film",
                live: "radio",
                exercises: "pencil",
              };

              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.9}
                  onPress={() => setActiveTab(key)}
                  style={[styles.tabPill, { backgroundColor: bg }]}
                >
                  <View style={styles.tabPillInner}>
                    <Ionicons name={iconMap[key]} size={16} color={fg} />
                    <Text style={[styles.tabText, { color: fg }]} numberOfLines={1}>
                      {t((HUB_UI as any).tabs[key])}
                    </Text>
                    {key === "live" ? <View style={styles.tabDot} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === "book" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(HUB_MOCK.book.titleKey)}</Text>
            <Text style={styles.sectionSub}>{t(HUB_MOCK.book.subtitleKey)}</Text>

            {showSwitchLoading ? (
              <View style={styles.centerState}>
                <ActivityIndicator />
                <Text style={styles.centerStateText}>{t("common.loading")}</Text>
              </View>
            ) : !canSwitch ? (
              <View style={styles.centerState}>
                <Ionicons name="alert-circle-outline" size={26} color={colors.primary} />
                <Text style={styles.centerStateText}>{t("book.no_active_child")}</Text>
              </View>
            ) : !canFetchBooks ? (
              <View style={styles.centerState}>
                <Ionicons name="alert-circle-outline" size={26} color={colors.primary} />
                <Text style={styles.centerStateText}>{t("common.missing_params")}</Text>
              </View>
            ) : booksLoading && books.length === 0 ? (
              <View style={styles.centerState}>
                <ActivityIndicator />
                <Text style={styles.centerStateText}>{t("common.loading")}</Text>
              </View>
            ) : booksError ? (
              <TouchableOpacity activeOpacity={0.9} onPress={refetchBooks} style={styles.retryBox}>
                <Ionicons name="refresh" size={18} color={colors.primary} />
                <Text style={styles.retryText}>{t("common.tap_to_retry")}</Text>
              </TouchableOpacity>
            ) : (
              <FlatList
                data={books}
                keyExtractor={(it) => String(it.id)}
                renderItem={renderBook}
                numColumns={2}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.gridColWrapper}
                contentContainerStyle={styles.gridListContent}
                refreshControl={<RefreshControl refreshing={booksFetching} onRefresh={refetchBooks} />}
                ListEmptyComponent={
                  <View style={styles.centerState}>
                    <Ionicons name="library-outline" size={26} color={colors.primary} />
                    <Text style={styles.centerStateText}>{t("book.empty_title")}</Text>
                    <Text style={styles.centerStateSub}>{t("book.empty_subtitle")}</Text>
                  </View>
                }
              />
            )}
          </View>
        ) : activeTab === "lessons" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("course.title")}</Text>
            <Text style={styles.sectionSub}>{t("course.by_material_sub")}</Text>

            {showSwitchLoading ? (
              <View style={styles.centerState}>
                <ActivityIndicator />
                <Text style={styles.centerStateText}>{t("common.loading")}</Text>
              </View>
            ) : !canSwitch ? (
              <View style={styles.centerState}>
                <Ionicons name="alert-circle-outline" size={26} color={colors.primary} />
                <Text style={styles.centerStateText}>{t("book.no_active_child")}</Text>
              </View>
            ) : !canFetchCourses ? (
              <View style={styles.centerState}>
                <Ionicons name="alert-circle-outline" size={26} color={colors.primary} />
                <Text style={styles.centerStateText}>{t("common.missing_params")}</Text>
              </View>
            ) : coursesLoading && courses.length === 0 ? (
              <View style={styles.centerState}>
                <ActivityIndicator />
                <Text style={styles.centerStateText}>{t("common.loading")}</Text>
              </View>
            ) : coursesError ? (
              <TouchableOpacity activeOpacity={0.9} onPress={refetchCourses} style={styles.retryBox}>
                <Ionicons name="refresh" size={18} color={colors.primary} />
                <Text style={styles.retryText}>{t("common.tap_to_retry")}</Text>
              </TouchableOpacity>
            ) : (
              <FlatList
                data={courses}
                keyExtractor={(it) => String(it.id)}
                renderItem={renderCourse}
                numColumns={2}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.gridColWrapper}
                contentContainerStyle={styles.gridListContent}
                refreshControl={<RefreshControl refreshing={coursesFetching} onRefresh={refetchCourses} />}
                ListEmptyComponent={
                  <View style={styles.centerState}>
                    <Ionicons name="film-outline" size={26} color={colors.primary} />
                    <Text style={styles.centerStateText}>{t("course.empty_by_material")}</Text>
                    <Text style={styles.centerStateSub}>{t("course.empty")}</Text>
                  </View>
                }
              />
            )}
          </View>
        ) : activeTab === "live" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(HUB_MOCK.live.liveTitleKey)}</Text>
            <Text style={styles.sectionSub}>{t(HUB_MOCK.live.liveMetaKey)}</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t(HUB_MOCK.live.upcomingTitleKey)}</Text>
              {HUB_MOCK.live.upcoming.map((x: any, idx: number) => (
                <View key={String(x.id)} style={[styles.listRow, idx === 0 ? styles.listRowFirst : null]}>
                  <Text style={styles.listTitle} numberOfLines={1}>
                    {t(x.titleKey)}
                  </Text>
                  <Text style={styles.listMeta} numberOfLines={1}>
                    {t(x.metaKey)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="pencil" size={28} color={colors.primary} />
            <Text style={styles.emptyTitle}>{t(HUB_UI.exercisesSoonTitle)}</Text>
            <Text style={styles.emptySub}>{t(HUB_UI.exercisesSoonSub)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}