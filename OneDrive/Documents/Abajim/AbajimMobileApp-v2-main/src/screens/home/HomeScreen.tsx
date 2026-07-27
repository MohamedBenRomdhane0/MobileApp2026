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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { createHomeStyles } from "./HomeScreen.styles";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
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

import { HOME_UI, HOME_COMMON_UI, HOME_TOKENS } from "./HomeScreen.constants";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";

const ICONS = {
  arabic:  require("../../../assets/images/mat_arabic.png"),
  frensh:  require("../../../assets/images/mat_frensh.png"),
  math:    require("../../../assets/images/mat_math.png"),
  science: require("../../../assets/images/mat_science.png"),
  wake:    require("../../../assets/images/math_english.png"),
};

function pickMaterialFallbackIcon(m: MaterialUI): any {
  const key = String(m.slug || m.name || "").toLowerCase();
  if (key.includes("math")   || key.includes("رياض"))  return ICONS.math;
  if (key.includes("arab")   || key.includes("عرب"))   return ICONS.arabic;
  if (key.includes("fr")     || key.includes("فرن"))   return ICONS.frensh;
  if (key.includes("scien")  || key.includes("علوم"))  return ICONS.science;
  if (key.includes("eng")    || key.includes("anglais") || key.includes("انجل")) return ICONS.wake;
  return ICONS.math;
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

export default function HomeScreen() {
  const navigation  = useNavigation<any>();
  const insets      = useSafeAreaInsets();
  const { t }       = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark  = mode === "dark";
  const styles  = useMemo(() => createHomeStyles(colors, isDark), [colors, isDark]);

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
  } = useGetBooksQuery({ page: 1, keyword }, { skip: !isChildReady });

  const books: BookListItemUI[] = useMemo(
    () => (Array.isArray(booksData?.data) ? booksData.data : []),
    [booksData]
  );
  const homeBooks = useMemo(() => books.slice(0, 2), [books]);

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

            <Text style={styles.heroHello} numberOfLines={1}>
              {t(HOME_UI.helloPresence)}
            </Text>

            <View style={styles.heroCenter}>
              <View style={styles.heroAvatarWrap}>
                <ActiveChildHeaderAvatar />
              </View>
              {!!levelLabel && (
                <View style={styles.heroLevelPill}>
                  <Ionicons name="star" size={12} color="#FACC15" style={{ marginLeft: 6 }} />
                  <Text style={styles.heroLevelText} numberOfLines={1}>{levelLabel}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.body}>
          <View style={styles.categoriesCard}>
            {showMaterialsLoader ? (
              <View style={styles.materialsStateWrap}>
                <ActivityIndicator />
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
                contentContainerStyle={[
                  styles.categoriesRow,
                  materialsRowStyle,
                  materialsRowCenterStyle,
                ]}
              >
                {materials.map((m) => (
                  <TouchableOpacity
                    key={String(m.id)}
                    activeOpacity={0.9}
                    style={[styles.categoryBlock, categoryBlockStyle]}
                    onPress={() => openMaterial(m)}
                    accessibilityLabel={getMaterialLabel(t, m)}
                    accessibilityRole="button"
                  >
                    <View style={styles.categoryItem}>
                      <Image
                        source={m.iconUrl ? { uri: m.iconUrl } : pickMaterialFallbackIcon(m)}
                        style={styles.categoryImg}
                      />
                    </View>
                    <Text style={styles.categoryLabel} numberOfLines={1}>
                      {getMaterialLabel(t, m)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity
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
          </View>

          <View style={styles.booksRow}>
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
            ) : homeBooks.length === 0 ? (
              <View style={styles.booksStateWrap}>
                <Text style={styles.sectionLink}>{t("book.empty_title")}</Text>
              </View>
            ) : (
              homeBooks.map((b) => {
                const title      = String(b?.title ?? "").trim() || t("common.unnamed");
                const pagesCount = Number((b as any)?.pagesTotal ?? (b as any)?.pages_count ?? 0);

                return (
                  <TouchableOpacity
                    key={String(b.id)}
                    activeOpacity={0.92}
                    style={styles.bookCardOuter}
                    onPress={() => openBook(b.id)}
                    accessibilityLabel={title}
                    accessibilityRole="button"
                  >
                    <View style={styles.bookCoverShell}>
                      {b.coverUrl ? (
                        <Image source={{ uri: b.coverUrl }} style={styles.bookCoverImage} />
                      ) : (
                        <View style={styles.bookCoverFallback}>
                          <Ionicons name="book-outline" size={34} color="#94A3B8" />
                        </View>
                      )}
                      {pagesCount > 0 && (
                        <View style={styles.bookBadgeOverlay}>
                          <Text style={styles.bookBadgeText}>{pagesCount}</Text>
                          <Ionicons name="chevron-back" size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </View>

                    <View style={styles.bookMetaWrap}>
                      <Text style={styles.bookTitle} numberOfLines={2}>{title}</Text>
                      <View style={styles.bookOpenBtn}>
                        <Text style={styles.bookOpenText}>{t(HOME_COMMON_UI.open)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
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
          </View>

          <View style={styles.liveCard}>
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
