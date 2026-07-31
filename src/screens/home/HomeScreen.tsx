import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  I18nManager,
  Dimensions,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { createHomeStyles } from "./HomeScreen.styles";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LanguageSwitcher from "@components/header/LanguageSwitcher";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { LEVEL_LABEL_BY_ID } from "@config/enums/Level.enum";

import { PATHS } from "@config/constants/paths";
import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId } from "@redux/slices/authSlice";
import { useSwitchToChildMutation } from "@redux/apis/child/childApi";

import { useGetMaterialsByLevelQuery } from "@redux/apis/materials/materialsApi";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";

import { useGetBooksQuery } from "@redux/apis/books/bookApi";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";

import { HOME_UI, HOME_COMMON_UI, HOME_TOKENS, MOCK_TEACHERS } from "./HomeScreen.constants";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import { pickSubjectVisual } from "./subjectIcon";

const TEACHER_COLORS = ["#F59E0B", "#8B5CF6", "#10B981", "#3B82F6", "#EC4899"];
const ICONS = {
  arabic:  require("../../../assets/images/mat_arabic.png"),
  frensh:  require("../../../assets/images/mat_frensh.png"),
  math:    require("../../../assets/images/mat_math.png"),
  science: require("../../../assets/images/mat_science.png"),
  wake:    require("../../../assets/images/math_english.png"),
};

// Ordered set of 3D subject icons cycled per material card so that, when a
// material's subject can't be resolved, each of the (up to 4) visible cards
// still shows a DISTINCT 3D icon instead of all falling back to the same one.
// Drop the iconscout school-education 3D pack into assets/images and extend
// this list to give every material its own dedicated 3D artwork.
const MATERIAL_ICONS_3D = [
  ICONS.math,
  ICONS.science,
  ICONS.arabic,
  ICONS.frensh,
  ICONS.wake,
];

// How many materials to show inside the horizontal swiper.
const MATERIALS_VISIBLE = 4;

// Match a material to its subject icon. Returns null when no subject can be
// confidently resolved, so the caller can fall back to the server image.
function pickMaterialFallbackIcon(m: MaterialUI): any {
  const key = String(m.slug || (m as any).code || m.name || "").toLowerCase();
  if (key.includes("math")  || key.includes("رياض") || key.includes("calcul")) return ICONS.math;
  if (key.includes("arab")  || key.includes("عرب"))  return ICONS.arabic;
  if (key.includes("fr")    || key.includes("فرن"))  return ICONS.frensh;
  if (key.includes("scien") || key.includes("علوم") || key.includes("svt") ||
      key.includes("phys")  || key.includes("bio")  || key.includes("chim")) return ICONS.science;
  if (key.includes("eng")   || key.includes("anglais") || key.includes("انجل")) return ICONS.wake;
  return null;
}

function normalizeMaterialKey(m: MaterialUI): string | null {
  const raw = String((m as any)?.slug ?? (m as any)?.code ?? m?.name ?? "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.startsWith("mat_")) return lower.slice(4);
  if (/^[a-z0-9_ -]+$/i.test(lower)) return lower.replace(/\s+/g, "_");
  return null;
}

function getMaterialLabel(t: (k: string, opt?: any) => string, m: MaterialUI): string {
  const fallback = String(m?.name ?? "").trim();
  const k = normalizeMaterialKey(m);
  if (!k) return fallback;
  return t(`material.${k}`, { defaultValue: fallback });
}

function toValidId(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// ── Animated book card: staggered entrance + press-scale spring ────────────────
type BookCardProps = {
  book: BookListItemUI;
  index: number;
  title: string;
  pagesCount: number;
  videosCount: number;
  openLabel: string;
  onPress: () => void;
  styles: any;
  isDark: boolean;
};

function BookCard({
  book,
  index,
  title,
  pagesCount,
  videosCount,
  openLabel,
  onPress,
  styles,
  isDark,
}: BookCardProps) {
  // entrance: fade in + rise, staggered by column so cards cascade in
  const enter = useRef(new Animated.Value(0)).current;
  // press feedback: subtle scale-down on touch
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      delay: 90 * index,
      easing: Easing.out(Easing.cubic), // matches skill's cubic-bezier(.2,.8,.2,1)
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const onPressIn = () =>
    Animated.spring(press, {
      toValue: 0.96,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();

  const onPressOut = () =>
    Animated.spring(press, {
      toValue: 1,
      speed: 20,
      bounciness: 8,
      useNativeDriver: true,
    }).start();

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  return (
    <Animated.View
      style={[
        styles.bookCardOuter,
        { opacity: enter, transform: [{ translateY }, { scale: press }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.bookCardPressable}
        accessibilityLabel={title}
        accessibilityRole="button"
      >
        <View style={styles.bookCoverShell}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.bookCoverImage} />
          ) : (
            <View style={styles.bookCoverFallback}>
              <Ionicons name="book-outline" size={38} color="#94A3B8" />
            </View>
          )}

          {/* legibility scrim under the badge */}
          <LinearGradient
            colors={["rgba(15,23,42,0)", "rgba(15,23,42,0.45)"]}
            style={styles.bookCoverScrim}
            pointerEvents="none"
          />

          {pagesCount > 0 && (
            <View style={styles.bookBadgeOverlay}>
              <Ionicons name="reader-outline" size={12} color="#FFFFFF" />
              <Text style={styles.bookBadgeText}>{pagesCount}</Text>
            </View>
          )}

          {videosCount > 0 && (
            <View style={styles.bookVideoBadge}>
              <Ionicons name="play-circle" size={12} color="#FFFFFF" />
              <Text style={styles.bookBadgeText}>{videosCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.bookMetaWrap}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {title}
          </Text>

          {/* <View style={styles.bookOpenBtn}>
            <LinearGradient
              colors={isDark ? ["#0B1B33", "#152A4A"] : ["#1D3B65", "#2A4E7E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="arrow-back" size={13} color="#FFFFFF" />
            <Text style={styles.bookOpenText}>{openLabel}</Text>
          </View> */}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Distinct solid pastel backgrounds cycled per material card (matches design).
// Each entry: card background + icon-tile background + text/icon tint.
const MATERIAL_PALETTE = [
  { bg: "#EAD9FF", tile: "rgba(124,58,237,0.15)", ink: "#5B21B6" }, // purple
  { bg: "#D3F3EE", tile: "rgba(13,148,136,0.15)", ink: "#0F766E" }, // teal
  { bg: "#FFE0E6", tile: "rgba(244,63,94,0.15)",  ink: "#BE123C" }, // pink
  { bg: "#FFEAD1", tile: "rgba(234,88,12,0.15)",  ink: "#C2410C" }, // orange
  { bg: "#DCE8FF", tile: "rgba(37,99,235,0.15)",  ink: "#1D4ED8" }, // blue
  { bg: "#E7EBF0", tile: "rgba(71,85,105,0.15)",  ink: "#334155" }, // slate
];

const MATERIAL_PALETTE_DARK = [
  { bg: "rgba(124,58,237,0.20)", tile: "rgba(124,58,237,0.30)", ink: "#D8B4FE" },
  { bg: "rgba(13,148,136,0.20)", tile: "rgba(13,148,136,0.30)", ink: "#5EEAD4" },
  { bg: "rgba(244,63,94,0.20)",  tile: "rgba(244,63,94,0.30)",  ink: "#FDA4AF" },
  { bg: "rgba(234,88,12,0.20)",  tile: "rgba(234,88,12,0.30)",  ink: "#FDBA74" },
  { bg: "rgba(37,99,235,0.20)",  tile: "rgba(37,99,235,0.30)",  ink: "#93C5FD" },
  { bg: "rgba(71,85,105,0.28)",  tile: "rgba(71,85,105,0.40)",  ink: "#CBD5E1" },
];

// ── Animated material card: staggered entrance + press-scale spring ────────────
type MaterialCardProps = {
  material: MaterialUI;
  index: number;
  label: string;
  onPress: () => void;
  styles: any;
  isDark: boolean;
};

function MaterialCard({
  material,
  index,
  label,
  onPress,
  styles,
  isDark,
}: MaterialCardProps) {
  const enter = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      delay: 70 * index,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const onPressIn = () =>
    Animated.spring(press, {
      toValue: 0.96,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();

  const onPressOut = () =>
    Animated.spring(press, {
      toValue: 1,
      speed: 20,
      bounciness: 8,
      useNativeDriver: true,
    }).start();

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const palette = isDark ? MATERIAL_PALETTE_DARK : MATERIAL_PALETTE;
  const tone = palette[index % palette.length];

  // Rich (3D-style) material artwork. Prefer the icon that matches THIS
  // subject so every material shows its own picture; otherwise fall back to a
  // DISTINCT 3D icon chosen by card index (so no two visible cards repeat),
  // and only use the server image as a last resort.
  const subjectIcon = pickMaterialFallbackIcon(material);
  const fallback3D = MATERIAL_ICONS_3D[index % MATERIAL_ICONS_3D.length];
  const artwork = subjectIcon
    ? subjectIcon
    : fallback3D
    ? fallback3D
    : material.iconUrl
    ? { uri: material.iconUrl }
    : ICONS.math;

  // Guarantee a visible label even if the name/translation resolves empty.
  const displayLabel = (label && label.trim()) || String(material?.name ?? "").trim() || "—";

  return (
    <Animated.View
      style={[
        styles.materialCard,
        { backgroundColor: tone.bg, opacity: enter, transform: [{ translateY }, { scale: press }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.materialCardPress}
        accessibilityLabel={displayLabel}
        accessibilityRole="button"
      >
        <View style={[styles.materialCardIconWrap, { backgroundColor: tone.tile }]}>
          <Image source={artwork} style={styles.materialCardImg} />
        </View>

        <Text style={[styles.materialCardLabel, { color: tone.ink }]} numberOfLines={2}>
          {displayLabel}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const navigation  = useNavigation<any>();
  const insets      = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark  = mode === "dark";
  const isRTL   = (i18n.language ?? "ar") === "ar";
  const styles  = useMemo(
    () => createHomeStyles(colors, isDark, isRTL),
    [colors, isDark, isRTL]
  );

  const booksScrollRef = useRef<ScrollView>(null);
  const materialsScrollRef = useRef<ScrollView>(null);

  const headerData = useActiveChildHeaderData();
  const levelId    = useMemo(() => pickLevelIdFromChild(headerData?.child), [headerData?.child]);
  const levelLabel = useMemo(() => (levelId ? LEVEL_LABEL_BY_ID[levelId] : ""), [levelId]);

  const activeChildId      = useAppSelector(selectActiveChildId);
  const childAccessToken   = useAppSelector((s) => s.auth.childAccessToken);
  const [keyword]          = useState("");
  const [switchToChild, switchState] = useSwitchToChildMutation();

  const canSwitch        = typeof activeChildId === "number" && activeChildId > 0;
  const needsChildToken  = !childAccessToken;
  const lastSwitchChildIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!needsChildToken) { lastSwitchChildIdRef.current = null; return; }
    if (!canSwitch) return;
    if (lastSwitchChildIdRef.current === activeChildId) return;
    if (switchState.isSuccess) return;
    if (switchState.isLoading) return;
    lastSwitchChildIdRef.current = activeChildId;
    switchToChild({ childId: activeChildId })
      .unwrap()
      .catch(() => { lastSwitchChildIdRef.current = null; });
  }, [needsChildToken, canSwitch, activeChildId, switchToChild, switchState.isLoading, switchState.isSuccess]);

  const isChildReady = canSwitch && !!childAccessToken;

  const {
    data: materialsData,
    isLoading:  isMaterialsLoading,
    isFetching: isMaterialsFetching,
    isError:    isMaterialsError,
    refetch:    refetchMaterials,
  } = useGetMaterialsByLevelQuery(
    { levelId: toValidId(levelId) },
    { skip: !toValidId(levelId) }
  );

  const materials: MaterialUI[] = useMemo(
    () => (Array.isArray(materialsData) ? materialsData : []),
    [materialsData]
  );
  const showMaterialsLoader = isMaterialsLoading || isMaterialsFetching;

  const {
    data: booksData,
    isLoading:  isBooksLoading,
    isFetching: isBooksFetching,
    isError:    isBooksError,
    refetch:    refetchBooks,
  } = useGetBooksQuery({ page: 1, perPage: 20, keyword }, { skip: !isChildReady });

  const books: BookListItemUI[] = useMemo(
    () => (Array.isArray(booksData?.data) ? booksData.data : []),
    [booksData]
  );
  // Horizontal swiper can hold the full level list — cap only for perf.
  const homeBooks = useMemo(() => books.slice(0, 12), [books]);

  const displayBooks = useMemo(
    () => (isRTL ? [...homeBooks].reverse() : homeBooks),
    [homeBooks, isRTL]
  );

  const displayMaterials = useMemo(
    () => (isRTL ? [...materials].reverse() : materials),
    [materials, isRTL]
  );

  // Scroll swiper to the rightmost (first-book) position in RTL so the
  // first item appears at the natural reading start (right side).
  useEffect(() => {
    if (!isRTL || !displayBooks.length) return;
    const id = requestAnimationFrame(() => {
      booksScrollRef.current?.scrollToEnd({ animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, [isRTL, displayBooks.length]);

  const goSubscribe = useCallback(
    () => navigation.navigate(PATHS.TABS.PLANS as never),
    [navigation]
  );
  const goBooks    = useCallback(() => navigation.navigate("Books"),    [navigation]);
  const goMeetings = useCallback(() => navigation.navigate("Meetings"), [navigation]);

  const openBook = useCallback(
    (bookId: number) => {
      const id = toValidId(bookId);
      if (!id) return;
      navigation.navigate(PATHS.APP.BOOKS_FILE, { bookId: id });
    },
    [navigation]
  );

  const openMaterial = useCallback(
    (m: MaterialUI) => {
      const lvl = toValidId(levelId);
      const mat = toValidId(m?.id);
      if (!lvl || !mat) return;
      navigation.navigate(PATHS.APP.MATERIAL_HUB, {
        levelId: lvl,
        materialId: mat,
        materialName: String(m?.name ?? "").trim(),
        levelMaterialId: toValidId((m as any)?.levelMaterialId),
      });
    },
    [navigation, levelId]
  );

  // Open a teacher's profile when their card is tapped.
  const openTeacher = useCallback(
    (teacherId: number) => {
      const id = toValidId(teacherId);
      if (!id) return;
      navigation.navigate(PATHS.APP.TEACHER_PROFILE, { teacherId: id });
    },
    [navigation]
  );

  const headerGradientColors: [string, string, string] = useMemo(
    () => isDark
      ? ["#0B1220", colors.header, "#060B14"]
      : ["#153A6B", colors.header, "#091D36"],
    [isDark, colors.header]
  );

  const materialsCount        = materials.length;
  const materialsShouldScroll = materialsCount > 4;

  const materialsRowStyle = useMemo(
    () => ({
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      gap: 6,
      paddingHorizontal: 6,
    }) as const,
    []
  );

  const materialsRowCenterStyle = useMemo(() => {
    if (materialsShouldScroll) return null;
    return { flexGrow: 1, justifyContent: "center" as const };
  }, [materialsShouldScroll]);

  const categoryBlockStyle = useMemo(() => {
    if (!materialsCount || materialsCount > 4) return null;
    const W          = Dimensions.get("window").width;
    const containerW = W - 32 - 24 - 12;
    const gap        = 12;
    const usable     = containerW - gap * Math.max(0, materialsCount - 1);
    const w          = Math.floor(usable / materialsCount);
    return { width: Math.max(88, Math.min(120, w)) };
  }, [materialsCount]);

  const showBooksLoader = isBooksLoading || isBooksFetching;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerShell}>
          <LinearGradient
            colors={headerGradientColors}
            start={{ x: 0.08, y: 0.05 }}
            end={{ x: 0.95, y: 1 }}
            style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 14) }]}
          >
            <View style={styles.headerGlowA} />
            <View style={styles.headerGlowB} />

            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <ActiveChildHeaderAvatar />
                <View>
                  <Text style={styles.hello} numberOfLines={1}>
                    {headerData?.name
                      ? t("home.hello_name", { name: headerData.name })
                      : t("home.hello_default")}
                  </Text>
                  <Text style={styles.levelUp} numberOfLines={1}>
                    {levelLabel || t("home.level_default")}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <LanguageSwitcher />
                <TouchableOpacity
                  style={styles.bellBtn}
                  accessibilityRole="button"
                  accessibilityLabel={t("common.notifications", { defaultValue: "Notifications" })}
                >
                  <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

       
        <View style={styles.body}>
          {/* <View style={styles.categoriesCard}> */}
            {/* header row */}
            {/* <View style={styles.catHeaderRow}>
              <View style={styles.catWeekPill}>
                <Text style={styles.catWeekText}>{t("home.week_label", { defaultValue: "Week" })}</Text>
              </View>
              {!!levelLabel && (
                <View style={styles.catLevelPill}>
                  <Ionicons name="person-outline" size={12} color={colors.primary} />
                  <Text style={styles.catLevelText}>{levelLabel}</Text>
                </View>
              )}
              <View style={styles.catCountPill}>
                <View style={styles.catCountDot} />
                <Text style={styles.catCountText}>
                  {materials.length} {t("home.subjects_label", { defaultValue: "Subjects" })}
                </Text>
              </View>
            </View> */}

            {/* body */}
            {/* {showMaterialsLoader ? (
              <View style={styles.materialsStateWrap}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : isMaterialsError ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={refetchMaterials}
                style={styles.materialsStateWrap}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.categoryLabel}>{t(HOME_COMMON_UI.tapToRetry)}</Text>
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                scrollEnabled={materialsShouldScroll}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.categoriesRow, materialsRowStyle, materialsRowCenterStyle]}
              >
                {materials.map((m) => {
                  const visual = pickSubjectVisual(m);
                  return (
                    <TouchableOpacity
                      key={String(m.id)}
                      activeOpacity={0.88}
                      style={[styles.categoryBlock, categoryBlockStyle]}
                      onPress={() => openMaterial(m)}
                      accessibilityLabel={getMaterialLabel(t, m)}
                      accessibilityRole="button"
                    >
                      <View style={[styles.categoryItem, { backgroundColor: visual.bg }]}>
                        {m.iconUrl ? (
                          <Image source={{ uri: m.iconUrl }} style={styles.categoryImg} />
                        ) : (
                          <MaterialCommunityIcons
                            name={visual.icon}
                            size={36}
                            color={visual.color}
                          />
                        )}
                      </View>
                      <Text style={styles.categoryLabel} numberOfLines={1}>
                        {getMaterialLabel(t, m)}
                      </Text>
                      {!!(m as any).hoursCount && (
                        <Text style={styles.categoryHours} numberOfLines={1}>
                          {(m as any).hoursCount} {t("home.hours_label", { defaultValue: "hours" })}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )} */}
          {/* </View> */}

          {/* <TouchableOpacity
            activeOpacity={0.92}
            onPress={goSubscribe}
            style={{ borderRadius: 22, overflow: "hidden" }}
            accessibilityLabel={t(HOME_UI.subscribeTitle)}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={HOME_TOKENS.subscribeGradient}
              start={{ x: 1, y: 0.2 }}
              end={{ x: 0, y: 0.95 }}
              style={styles.subscribeBanner}
            >
              <View style={styles.subscribeContent}>
                <View style={styles.subscribeTextBlock}>
                  <Text style={styles.subscribeTitle}>{t(HOME_UI.subscribeTitle)}</Text>
                  <Text style={styles.subscribeSub}>{t(HOME_UI.subscribeSub)}</Text>
                </View>

                <View style={styles.subscribeBtn}>
                  <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                  <Text style={styles.subscribeBtnText}>{t(HOME_UI.subscribeCta)}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goBooks}
              accessibilityRole="link"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.sectionLink}>
                {t(HOME_COMMON_UI.seeAll)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{t(HOME_UI.schoolBooks)}</Text>
          </View> */}

          {/* ── Materials (colored grid) ─────────────────────────────────── */}
          {showMaterialsLoader ? (
            <View style={styles.materialsStateWrap}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : isMaterialsError ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={refetchMaterials}
              style={styles.materialsStateWrap}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.sectionLink}>{t(HOME_COMMON_UI.tapToRetry)}</Text>
            </TouchableOpacity>
          ) : displayMaterials.length > 0 ? (
            <ScrollView
              horizontal
              ref={materialsScrollRef}
              showsHorizontalScrollIndicator={false}
              style={styles.materialsSwiper}
              contentContainerStyle={styles.materialsSwiperContent}
            >
              {displayMaterials.slice(0, MATERIALS_VISIBLE).map((m, i) => (
                <MaterialCard
                  key={String(m.id)}
                  material={m}
                  index={i}
                  label={getMaterialLabel(t, m)}
                  onPress={() => openMaterial(m)}
                  styles={styles}
                  isDark={isDark}
                />
              ))}
            </ScrollView>
          ) : null}

          {/* ── School books ─────────────────────────────────────────────── */}
          <View style={styles.booksHeaderRow}>
            
            <View style={styles.booksHeaderTitleWrap}>
              <Text style={styles.sectionTitle}>{t(HOME_UI.schoolBooks)}</Text>
              {!showBooksLoader && !isBooksError && homeBooks.length > 0 && (
                <View style={styles.booksCountPill}>
                  <Text style={styles.booksCountText}>{homeBooks.length}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goBooks}
              accessibilityRole="link"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.booksSeeAll}
            >
              <Text style={styles.sectionLink}>{t(HOME_COMMON_UI.seeAll)}</Text>
              <Ionicons name="chevron-back" size={14} color={colors.primary} />
            </TouchableOpacity>

          </View>

          {showBooksLoader ? (
            <View style={styles.booksStateWrap}>
              <ActivityIndicator />
            </View>
          ) : isBooksError ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={refetchBooks}
              style={styles.booksStateWrap}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.sectionLink}>{t(HOME_COMMON_UI.tapToRetry)}</Text>
            </TouchableOpacity>
          ) : displayBooks.length === 0 ? (
            <View style={styles.booksStateWrap}>
              <Text style={styles.sectionLink}>{t("book.empty_title")}</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              ref={booksScrollRef}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.booksSwiperContent}
              style={styles.booksSwiper}
            >
              {displayBooks.map((b, i) => {
                const title       = String(b?.title ?? "").trim() || t("common.unnamed");
                const pagesCount  = Number((b as any)?.pagesTotal ?? (b as any)?.pages_count ?? 0);
                const videosCount = Number((b as any)?.videosCount ?? (b as any)?.videos_count ?? 0);

                return (
                  <BookCard
                    key={String(b.id)}
                    book={b}
                    index={i}
                    title={title}
                    pagesCount={pagesCount}
                    videosCount={videosCount}
                    openLabel={t(HOME_COMMON_UI.open)}
                    onPress={() => openBook(b.id)}
                    styles={styles}
                    isDark={isDark}
                  />
                );
              })}
            </ScrollView>
          )}

          {/* <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goMeetings}
              accessibilityRole="link"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.sectionLink}>
                {t(HOME_COMMON_UI.seeAll)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{t(HOME_UI.liveMeetings)}</Text>
          </View> */}

          {/* <View style={styles.liveCard}>
            <View style={styles.liveTopRow}>
              <View style={styles.liveInfo}>
                <Text style={styles.liveTitle}>{t("home.live_title_mock")}</Text>
                <Text style={styles.liveMeta}>{t("home.live_meta_mock")}</Text>
              </View>
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>{t(HOME_COMMON_UI.live)}</Text>
                <View style={styles.liveDot} />
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.liveJoinBtn}
              onPress={goMeetings}
              accessibilityLabel={t(HOME_UI.join)}
              accessibilityRole="button"
            >
              <Text style={styles.liveJoinText}>{t(HOME_UI.join)}</Text>
            </TouchableOpacity>
          </View> */}
        </View>
         <View style={styles.teachersSection}>
          <View style={styles.teachersHeader}>
            <Text style={styles.teachersSectionTitle}>
              {t("home.available_teachers")}
            </Text>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.teachersSeeAll}>
                {t(HOME_COMMON_UI.seeAll, { defaultValue: "عرض الكل" })}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teachersRow}>
            {MOCK_TEACHERS.map((teacher, i) => (
              <TouchableOpacity
                key={teacher.id}
                style={styles.teacherCol}
                activeOpacity={0.8}
                onPress={() => openTeacher(teacher.id)}
                accessibilityRole="button"
                accessibilityLabel={teacher.fullName}
              >
                <View style={[styles.teacherAvatar, { backgroundColor: TEACHER_COLORS[i] }]}>
                  <Image source={teacher.avatar} style={styles.teacherImg} />
                </View>
                <Text style={styles.teacherName} numberOfLines={1}>{teacher.fullName}</Text>
                <View style={styles.teacherBadge}>
                  <Text style={styles.teacherBadgeText}>4.0</Text>
                </View>
              </TouchableOpacity>
            ))}
            {TEACHER_COLORS.slice(MOCK_TEACHERS.length).map((c, i) => (
              <TouchableOpacity key={`extra-${i}`} style={styles.teacherCol}>
                <View style={[styles.teacherAvatar, { backgroundColor: c }]} />
                <Text style={styles.teacherName} numberOfLines={1}>{`Teacher ${MOCK_TEACHERS.length + i + 1}`}</Text>
                <View style={styles.teacherBadge}>
                  <Text style={styles.teacherBadgeText}>4.0</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}
