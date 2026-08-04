import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { createHomeStyles } from "./HomeScreen.styles";
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

import HomeHero from "@screens/home/components/HomeHero";
import QuickActions from "@screens/home/components/QuickActions";
import ContinueCard from "@screens/home/components/ContinueCard";
import MaterialsRow from "@screens/home/components/MaterialsRow";
import LiveNowCard from "@screens/home/components/LiveNowCard";
import BooksRow from "@screens/home/components/BooksRow";
import TeachersRow from "@screens/home/components/TeachersRow";
import SubscribeBanner from "@screens/home/components/SubscribeBanner";
import SectionHeader from "@screens/home/components/SectionHeader";
import SectionState from "@screens/home/components/SectionState";

import {
  HOME_UI,
  HOME_COMMON_UI,
  HOME_STATS,
  HOME_QUICK_ACTIONS,
  MOCK_TEACHERS,
  getHomePalette,
} from "./HomeScreen.constants";
import {
  getMaterialLabel,
  pickResumeBook,
  toValidId,
} from "./HomeScreen.helpers";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import type { HomeStat, HomeQuickAction } from "./HomeScreen.type";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = (i18n.language ?? "ar") === "ar";
  const styles = useMemo(
    () => createHomeStyles(colors, isDark, isRTL),
    [colors, isDark, isRTL]
  );
  const palette = useMemo(
    () => getHomePalette(colors, isDark),
    [colors, isDark]
  );

  const booksScrollToEndRef = useRef<(() => void) | null>(null);

  const headerData = useActiveChildHeaderData();
  const levelId = useMemo(
    () => pickLevelIdFromChild(headerData?.child),
    [headerData?.child]
  );
  const levelLabel = useMemo(
    () => (levelId ? LEVEL_LABEL_BY_ID[levelId] : ""),
    [levelId]
  );

  const activeChildId = useAppSelector(selectActiveChildId);
  const childAccessToken = useAppSelector((s) => s.auth.childAccessToken);
  const [keyword] = useState("");
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
  }, [
    needsChildToken,
    canSwitch,
    activeChildId,
    switchToChild,
    switchState.isLoading,
    switchState.isSuccess,
  ]);

  const isChildReady = canSwitch && !!childAccessToken;

  const {
    data: materialsData,
    isLoading: isMaterialsLoading,
    isFetching: isMaterialsFetching,
    isError: isMaterialsError,
    refetch: refetchMaterials,
  } = useGetMaterialsByLevelQuery(
    { levelId: toValidId(levelId) },
    { skip: !toValidId(levelId) }
  );

  const materials: MaterialUI[] = useMemo(
    () => (Array.isArray(materialsData) ? materialsData : []),
    [materialsData]
  );
  const displayMaterials = useMemo(
    () => (isRTL ? [...materials].reverse() : materials),
    [materials, isRTL]
  );
  const showMaterialsLoader = isMaterialsLoading || isMaterialsFetching;

  const {
    data: booksData,
    isLoading: isBooksLoading,
    isFetching: isBooksFetching,
    isError: isBooksError,
    refetch: refetchBooks,
  } = useGetBooksQuery(
    { page: 1, perPage: 20, keyword },
    { skip: !isChildReady }
  );

  const books: BookListItemUI[] = useMemo(
    () => (Array.isArray(booksData?.data) ? booksData.data : []),
    [booksData]
  );
  const homeBooks = useMemo(() => books.slice(0, 12), [books]);
  const displayBooks = useMemo(
    () => (isRTL ? [...homeBooks].reverse() : homeBooks),
    [homeBooks, isRTL]
  );
  const showBooksLoader = isBooksLoading || isBooksFetching;

  const resume = useMemo(() => pickResumeBook(homeBooks, t), [homeBooks, t]);

  const onLayoutReady = useCallback((scrollToEnd: () => void) => {
    if (isRTL && displayBooks.length > 0) scrollToEnd();
    booksScrollToEndRef.current = scrollToEnd;
  }, [isRTL, displayBooks.length]);

  const greeting = headerData?.name
    ? t("home.hello_name", { name: headerData.name })
    : t("home.hello_default");

  const stats: HomeStat[] = useMemo(
    () => [
      { ...HOME_STATS[0], value: homeBooks.length },
      { ...HOME_STATS[1], value: materials.length },
      { ...HOME_STATS[2], value: 1 },
    ],
    [homeBooks.length, materials.length]
  );

  const goSubscribe = useCallback(
    () => navigation.navigate(PATHS.TABS.PLANS as never),
    [navigation]
  );
  const goBooks = useCallback(
    () => navigation.navigate(PATHS.TABS.BOOKS as never),
    [navigation]
  );
  const goMeetings = useCallback(
    () => navigation.navigate(PATHS.TABS.MEETINGS as never),
    [navigation]
  );
  const goNotifications = useCallback(
    () => navigation.navigate(PATHS.APP.NOTIFICATIONS as never),
    [navigation]
  );

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
        levelMaterialId: toValidId(m?.levelMaterialId),
      });
    },
    [navigation, levelId]
  );

  const openTeacher = useCallback(
    (teacherId: number) => {
      const id = toValidId(teacherId);
      if (!id) return;
      navigation.navigate(PATHS.APP.TEACHER_PROFILE, { teacherId: id });
    },
    [navigation]
  );

  const onPressQuickAction = useCallback(
    (action: HomeQuickAction) => navigation.navigate(action.route as never),
    [navigation]
  );

  const onRefresh = useCallback(() => {
    refetchMaterials();
    refetchBooks();
  }, [refetchMaterials, refetchBooks]);

  const refreshing = isMaterialsFetching || isBooksFetching;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <HomeHero
          styles={styles}
          palette={palette}
          isRTL={isRTL}
          isDark={isDark}
          greeting={greeting}
          levelLabel={levelLabel || t("home.level_default")}
          stats={stats}
          topInset={insets.top}
          notificationsLabel={t(HOME_COMMON_UI.notifications)}
          onNotifications={goNotifications}
        />

        <View style={styles.body}>
          <QuickActions
            styles={styles}
            palette={palette}
            isRTL={isRTL}
            actions={HOME_QUICK_ACTIONS}
            onPressAction={onPressQuickAction}
          />

          {resume && (
            <View style={styles.section}>
              <ContinueCard
                styles={styles}
                palette={palette}
                isRTL={isRTL}
                resume={resume}
                title={t(HOME_UI.continueTitle)}
                ctaLabel={t(HOME_UI.continueCta)}
                progressLabel={t(HOME_UI.progressLabel)}
                onPress={() => openBook(resume.book.id)}
              />
            </View>
          )}

          {/* Subjects */}
          <View style={styles.section}>
            <SectionHeader
              styles={styles}
              palette={palette}
              isRTL={isRTL}
              title={t(HOME_UI.subjectsTitle)}
              count={materials.length}
            />
            {showMaterialsLoader ? (
              <SectionState styles={styles} palette={palette} isRTL={isRTL} status="loading" />
            ) : isMaterialsError ? (
              <SectionState
                styles={styles}
                palette={palette}
                isRTL={isRTL}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={refetchMaterials}
              />
            ) : displayMaterials.length > 0 ? (
              <MaterialsRow
                styles={styles}
                palette={palette}
                isRTL={isRTL}
                isDark={isDark}
                materials={displayMaterials}
                getLabel={(m) => getMaterialLabel(t, m)}
                onPressMaterial={openMaterial}
              />
            ) : null}
          </View>

          {/* Live now */}
          <View style={styles.section}>
            <SectionHeader
              styles={styles}
              palette={palette}
              isRTL={isRTL}
              title={t(HOME_UI.liveMeetings)}
              seeAllLabel={t(HOME_COMMON_UI.seeAll)}
              onSeeAll={goMeetings}
            />
            <LiveNowCard
              styles={styles}
              palette={palette}
              isRTL={isRTL}
              title={t("home.live_title_mock")}
              meta={t("home.live_meta_mock")}
              liveLabel={t(HOME_COMMON_UI.live)}
              joinLabel={t(HOME_UI.join)}
              onJoin={goMeetings}
            />
          </View>

          {/* School books */}
          <View style={styles.section}>
            <SectionHeader
              styles={styles}
              palette={palette}
              isRTL={isRTL}
              title={t(HOME_UI.schoolBooks)}
              count={homeBooks.length}
              seeAllLabel={t(HOME_COMMON_UI.seeAll)}
              onSeeAll={goBooks}
            />
            {showBooksLoader ? (
              <SectionState styles={styles} palette={palette} isRTL={isRTL} status="loading" />
            ) : isBooksError ? (
              <SectionState
                styles={styles}
                palette={palette}
                isRTL={isRTL}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={refetchBooks}
              />
            ) : displayBooks.length === 0 ? (
              <SectionState
                styles={styles}
                palette={palette}
                isRTL={isRTL}
                status="empty"
                message={t(HOME_UI.booksEmpty)}
              />
            ) : (
              <BooksRow
                styles={styles}
                palette={palette}
                isRTL={isRTL}
                books={displayBooks}
                unnamedLabel={t("common.unnamed")}
                onPressBook={openBook}
                onLayoutReady={onLayoutReady}
              />
            )}
          </View>

          {/* Teachers */}
          <View style={styles.section}>
            <SectionHeader
              styles={styles}
              palette={palette}
              isRTL={isRTL}
              title={t(HOME_UI.availableTeachers)}
              count={MOCK_TEACHERS.length}
            />
            <TeachersRow
              styles={styles}
              palette={palette}
              isRTL={isRTL}
              teachers={MOCK_TEACHERS}
              onPressTeacher={openTeacher}
            />
          </View>

          {/* Subscribe */}
          <View style={styles.section}>
            <SubscribeBanner
              styles={styles}
              palette={palette}
              isRTL={isRTL}
              title={t(HOME_UI.subscribeTitle)}
              subtitle={t(HOME_UI.subscribeSub)}
              ctaLabel={t(HOME_UI.subscribeCta)}
              onPress={goSubscribe}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
