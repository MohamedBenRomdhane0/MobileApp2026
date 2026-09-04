import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  Pressable,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
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

import { useGetMeetingsQuery } from "@redux/apis/meetings/meetingApi";
import type { MeetingListItemUI } from "@redux/apis/meetings/meetingApi.type";

import type { MaterialHubTabKey } from "./MaterialHubScreen.types";
import { HUB_UI } from "./MaterialHubScreen.constants";
import { createMaterialHubStyles } from "./MaterialHubScreen.styles";

import {
  normalizeMaterialKey,
  progressToPct,
  toValidId,
} from "@utils/helpers/MaterialHub.helpers";

import {
  buildBooksFileParams,
  getAccent,
  getGradient,
  resolveMaterialKey,
} from "@utils/helpers/bookScreen.helpers";
import type { BookLearningResume } from "@utils/helpers/bookLearningResume.helpers";
import { loadBookResume } from "@utils/helpers/bookLearningResume.helpers";

type MaterialHubRouteProp = RouteProp<RootStackParamList, typeof PATHS.APP.MATERIAL_HUB>;

const TAB_KEYS: MaterialHubTabKey[] = ["book", "live"];

export default function MaterialHubScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<MaterialHubRouteProp>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const styles = useMemo(() => createMaterialHubStyles(colors, isDark), [colors, isDark]);

  const COVER_SWAY_MS = 2600;
  const BookCover3D = useCallback(
    ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => {
      const sway = useSharedValue(0);
      const pressed = useSharedValue(0);

      useEffect(() => {
        sway.value = withRepeat(
          withTiming(1, { duration: COVER_SWAY_MS, easing: Easing.inOut(Easing.quad) }),
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
          onPressIn={() => { pressed.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
          onPressOut={() => { pressed.value = withSpring(0, { damping: 15, stiffness: 200 }); }}
          style={styles.coverStage}
        >
          <Animated.View style={[styles.coverStage, animatedStyle]}>
            {children}
          </Animated.View>
        </Pressable>
      );
    },
    [styles]
  );

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

  const [resumeMap, setResumeMap] = useState<Record<number, BookLearningResume>>({});

  const canFetchBooks = isChildReady && materialId > 0;
  const {
    data: booksData,
    isLoading: booksLoading,
    isFetching: booksFetching,
    isError: booksError,
    refetch: refetchBooks,
  } = useGetBooksQuery({ page: 1, perPage: 50, materialId, childId: activeChildId ?? undefined }, { skip: !canFetchBooks });

  const books: BookListItemUI[] = useMemo(
    () => (Array.isArray((booksData as any)?.data) ? ((booksData as any).data as BookListItemUI[]) : []),
    [booksData]
  );

  const loadResumeMap = useCallback(async () => {
    if (!books.length) return;
    const entries: Array<[number, BookLearningResume]> = [];
    for (const b of books) {
      const id = Number(b?.id ?? 0);
      if (id <= 0) continue;
      try {
        const r = await loadBookResume(id);
        if (r) entries.push([id, r]);
      } catch {}
    }
    if (entries.length) setResumeMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
  }, [books]);

  useEffect(() => {
    void loadResumeMap();
  }, [loadResumeMap]);

  const canFetchMeetings = isChildReady && materialId > 0 && activeTab === "live";
  const {
    data: meetingsData,
    isLoading: meetingsLoading,
    isFetching: meetingsFetching,
    isError: meetingsError,
    refetch: refetchMeetings,
  } = useGetMeetingsQuery(
    { childId: activeChildId ?? undefined, page: 1, perPage: 50, materialId },
    { skip: !canFetchMeetings }
  );

  const meetings: MeetingListItemUI[] = useMemo(() => {
    const items = (meetingsData as any)?.data?.items ?? (meetingsData as any)?.items;
    return Array.isArray(items) ? (items as MeetingListItemUI[]) : [];
  }, [meetingsData]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const openBookFile = useCallback(
    (book: BookListItemUI) => {
      const params = buildBooksFileParams(book, resumeMap);
      if (!params) return;
      navigation.navigate(PATHS.APP.BOOKS_FILE, params);
    },
    [navigation, resumeMap]
  );

  const openMeeting = useCallback(
    (meetingId: number) => {
      navigation.navigate(PATHS.APP.MEETING_DETAILS, { meetingId });
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
    ({ item }: { item: BookListItemUI }) => {
      const title = String(item?.title ?? "").trim() || t("common.unnamed");
      const pagesCount = Math.max(0, Number((item as any)?.pagesTotal ?? 0));
      const videosCount = Math.max(0, Number((item as any)?.videosCount ?? 0));
      const pct = progressToPct(item);
      const materialKey = resolveMaterialKey(item?.materialName);
      const accent = getAccent(materialKey, (item as any)?.materialColor);
      const green = "#22C55E";

      const bookId = Number(item?.id ?? 0);
      const resume = bookId > 0 ? resumeMap[bookId] : null;
      const hasResume = Boolean(
        resume && (
          (typeof resume.pageNumber === "number" && resume.pageNumber > 0) ||
          (typeof resume.iconId === "number" && resume.iconId > 0) ||
          (typeof resume.videoId === "number" && resume.videoId > 0)
        )
      );

      const lessonTitle = String(resume?.lessonTitle ?? "").trim();
      const resumeIsBookName =
        lessonTitle.length > 0 &&
        (lessonTitle === title ||
          lessonTitle === String(item?.title ?? "").trim() ||
          lessonTitle === String(item?.materialName ?? "").trim());
      const showResumeTitle = lessonTitle.length > 0 && !resumeIsBookName;

      const gradient = getGradient(materialKey, (item as any)?.materialColor);

      return (
        <View style={styles.hBookCardShadow}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hBookCard}
          >
            <View style={styles.hBookCoverWrap}>
              <View style={styles.hBookCoverPad}>
                <BookCover3D onPress={() => openBookFile(item)}>
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hBookCoverCard}
                  >
                    {item?.coverUrl ? (
                      <Image source={{ uri: item.coverUrl }} style={styles.hBookCoverImg} resizeMode="cover" />
                    ) : (
                      <View style={styles.hBookCoverFallback}>
                        <Ionicons name="book-outline" size={30} color="rgba(255,255,255,0.95)" />
                      </View>
                    )}

                    <LinearGradient
                      colors={["rgba(255,255,255,0.30)", "rgba(255,255,255,0)"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={styles.hBookCoverGloss}
                      pointerEvents="none"
                    />
                  </LinearGradient>
                </BookCover3D>

                {videosCount > 0 ? (
                  <View style={styles.hBookBadge}>
                    <Text style={styles.hBookBadgeText}>{videosCount}</Text>
                    <Ionicons name="play" size={10} color="#FFFFFF" />
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.hBookInfo}>
              <View style={styles.hBookTitleBlock}>
                {hasResume ? (
                  <View style={styles.hResumeHeaderRow}>
                    <Text style={styles.hResumeHeaderText}>{t("common.progress")}</Text>
                    <Ionicons name="location-sharp" size={12} color={green} />
                  </View>
                ) : null}
                <Text numberOfLines={2} style={styles.hBookTitleText}>{title}</Text>
              </View>

              <View style={styles.hBookMiddle}>
                {hasResume ? (
                  <>
                    {showResumeTitle ? (
                      <Text numberOfLines={1} style={styles.hResumeTitle}>{lessonTitle}</Text>
                    ) : null}
                    {resume?.lastWatchedTime ? (
                      <View style={styles.hResumeTimeRow}>
                        <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.58)" />
                        <Text numberOfLines={1} style={styles.hResumeTimeText}>{resume.lastWatchedTime}</Text>
                      </View>
                    ) : null}
                    {pct > 0 ? (
                      <View style={styles.hProgressRow}>
                        <View style={styles.hProgressTrack}>
                          <View style={[styles.hProgressFill, { width: `${pct}%`, backgroundColor: green }]} />
                        </View>
                        <Text style={styles.hProgressPct}>{Math.round(pct)}%</Text>
                      </View>
                    ) : null}
                  </>
                ) : pct > 0 ? (
                  <>
                    <View style={styles.hResumeRow}>
                      <Text style={styles.hResumeLabel}>{t("common.progress")}</Text>
                      <Ionicons name="location-sharp" size={12} color={green} />
                    </View>
                    <View style={styles.hProgressRow}>
                      <View style={styles.hProgressTrack}>
                        <View style={[styles.hProgressFill, { width: `${pct}%`, backgroundColor: green }]} />
                      </View>
                      <Text style={styles.hProgressPct}>{Math.round(pct)}%</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.hPageChip}>
                    <Ionicons name="document-text-outline" size={13} color="rgba(255,255,255,0.84)" />
                    <Text style={styles.hPageChipText}>{t("book.pages_counts", { count: pagesCount })}</Text>
                  </View>
                )}
              </View>

              <View style={styles.hBookFooter}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  style={[styles.hOpenButton, { backgroundColor: hasResume ? green : accent }]}
                  onPress={() => openBookFile(item)}
                >
                  <Text style={styles.hOpenButtonText}>{t("common.open")}</Text>
                  <Ionicons name="play" size={13} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      );
    },
    [isDark, openBookFile, resumeMap, styles, t]
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
                book: "book",
                live: "radio",
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
            <Text style={styles.sectionTitle}>{t(HUB_UI.bookTitle)}</Text>
            <Text style={styles.sectionSub}>{t(HUB_UI.bookSubtitle)}</Text>

            {showSwitchLoading ? (
              <View style={styles.skeletonGrid}>
                {[1, 2, 3, 4].map((i) => (
                  <View key={String(i)} style={styles.skeletonCard}>
                    <View style={styles.skeletonCover} />
                    <View style={styles.skeletonBody}>
                      <View style={styles.skeletonLineLong} />
                      <View style={styles.skeletonLineShort} />
                      <View style={styles.skeletonLineMedium} />
                    </View>
                  </View>
                ))}
              </View>
            ) : !canSwitch ? (
              <View style={styles.emptyStateBox}>
                <View style={styles.emptyStateIconWrap}>
                  <Ionicons name="person-outline" size={32} color={colors.primary} />
                </View>
                <Text style={styles.emptyStateTitle}>{t("book.no_active_child")}</Text>
                <Text style={styles.emptyStateSub}>{t("book.no_active_child_sub")}</Text>
              </View>
            ) : !canFetchBooks ? (
              <View style={styles.emptyStateBox}>
                <View style={styles.emptyStateIconWrap}>
                  <Ionicons name="alert-circle-outline" size={32} color={colors.primary} />
                </View>
                <Text style={styles.emptyStateTitle}>{t("common.missing_params")}</Text>
              </View>
            ) : booksLoading && books.length === 0 ? (
              <View style={styles.skeletonGrid}>
                {[1, 2, 3, 4].map((i) => (
                  <View key={String(i)} style={styles.skeletonCard}>
                    <View style={styles.skeletonCover} />
                    <View style={styles.skeletonBody}>
                      <View style={styles.skeletonLineLong} />
                      <View style={styles.skeletonLineShort} />
                      <View style={styles.skeletonLineMedium} />
                    </View>
                  </View>
                ))}
              </View>
            ) : booksError ? (
              <TouchableOpacity activeOpacity={0.9} onPress={refetchBooks} style={styles.retryBox}>
                <View style={styles.retryIconWrap}>
                  <Ionicons name="refresh" size={22} color={colors.primary} />
                </View>
                <Text style={styles.retryTitle}>{t("common.error")}</Text>
                <Text style={styles.retryText}>{t("common.tap_to_retry")}</Text>
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bookHList}
              >
                {books.map((book) => (
                  <View key={String(book.id)} style={styles.bookHItem}>
                    {renderBook({ item: book })}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        ) : activeTab === "live" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(HUB_UI.liveNowTitle)}</Text>
            <Text style={styles.sectionSub}>{t(HUB_UI.liveNowMeta)}</Text>

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
            ) : !canFetchMeetings ? (
              <View style={styles.centerState}>
                <Ionicons name="alert-circle-outline" size={26} color={colors.primary} />
                <Text style={styles.centerStateText}>{t("common.missing_params")}</Text>
              </View>
            ) : meetingsLoading && meetings.length === 0 ? (
              <View style={styles.centerState}>
                <ActivityIndicator />
                <Text style={styles.centerStateText}>{t("common.loading")}</Text>
              </View>
            ) : meetingsError ? (
              <TouchableOpacity activeOpacity={0.9} onPress={refetchMeetings} style={styles.retryBox}>
                <Ionicons name="refresh" size={18} color={colors.primary} />
                <Text style={styles.retryText}>{t("common.tap_to_retry")}</Text>
              </TouchableOpacity>
            ) : meetings.length === 0 ? (
              <View style={styles.centerState}>
                <Ionicons name="radio-outline" size={26} color={colors.primary} />
                <Text style={styles.centerStateText}>{t("hub.live_empty")}</Text>
                <Text style={styles.centerStateSub}>{t("hub.live_empty_sub")}</Text>
              </View>
            ) : (
              meetings.map((m, idx) => {
                const teacherName = m.teacherName || "";
                const accent = m.materialColor || colors.primary;
                const nextDate = m.nextSessionAt ? new Date(m.nextSessionAt) : null;
                const isLive = m.status === "live" || m.status === "active";
                const hasDiscount = m.hasDiscount && m.discount > 0;

                return (
                  <TouchableOpacity
                    key={String(m.id)}
                    activeOpacity={0.88}
                    style={[styles.meetingCard, idx === 0 && styles.meetingCardFirst]}
                    onPress={() => openMeeting(m.id)}
                  >
                    <View style={[styles.meetingCardAccent, { backgroundColor: accent }]} />

                    <View style={styles.meetingCardBody}>
                      <View style={styles.meetingCardHeader}>
                        <Text numberOfLines={1} style={styles.meetingCardName}>{m.name}</Text>
                        {isLive ? (
                          <View style={styles.liveIndicator}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                          </View>
                        ) : null}
                      </View>

                      <View style={styles.meetingMetaRow}>
                        <Ionicons name="person-circle-outline" size={16} color={colors.muted} />
                        <Text numberOfLines={1} style={styles.meetingMetaText}>{teacherName}</Text>
                      </View>

                      {nextDate ? (
                        <View style={styles.meetingMetaRow}>
                          <Ionicons name="time-outline" size={16} color={colors.muted} />
                          <Text numberOfLines={1} style={styles.meetingMetaText}>
                            {nextDate.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                            {" - "}
                            {nextDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </Text>
                        </View>
                      ) : null}

                      <View style={styles.meetingFooter}>
                        <View style={styles.meetingPriceRow}>
                          {hasDiscount ? (
                            <Text style={styles.meetingPriceOld}>{m.price.toLocaleString("fr-FR")} DA</Text>
                          ) : null}
                          <Text style={[styles.meetingPrice, { color: accent }]}>
                            {(hasDiscount ? m.finalPrice : m.price).toLocaleString("fr-FR")} DA
                          </Text>
                        </View>

                        <View style={[styles.meetingCta, { backgroundColor: accent }]}>
                          <Text style={styles.meetingCtaText}>{t("common.open")}</Text>
                          <Ionicons name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"} size={14} color="#FFFFFF" />
                        </View>
                      </View>

                      {m.upcomingSessionsCount > 0 ? (
                        <Text style={styles.meetingSessionCount}>
                          {m.upcomingSessionsCount} {t("hub.sessions_remaining")}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}