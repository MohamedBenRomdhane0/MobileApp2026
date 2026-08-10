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
import SummaryCard from "@screens/home/components/SummaryCard";
import ActivitiesCard from "@screens/home/components/ActivitiesCard";
import DynamicIslandNotification from "@screens/home/components/DynamicIslandNotification";
import SectionHeader from "@screens/home/components/SectionHeader";
import SectionState from "@screens/home/components/SectionState";
import HomeSearchModal from "@screens/home/components/HomeSearchModal";
import WalletBottomSheet from "@components/wallet/WalletBottomSheet";

import {
  HOME_UI,
  HOME_COMMON_UI,
  HOME_QUICK_ACTIONS,
  HOME_SECTION_ACCENT,
  MOCK_TEACHERS,
  MOCK_MEETINGS,
  AUGUST_RESERVED_DAYS,
  getHomePalette,
} from "./HomeScreen.constants";
import {
  getMaterialLabel,
  pickResumeBook,
  toValidId,
} from "./HomeScreen.helpers";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import type { HomeQuickAction } from "./HomeScreen.type";

/** Books kept in the home carousel — the rest live on the Books tab. */
const HOME_BOOKS_LIMIT = 12;

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

  // Every block takes the same styling trio — bundle it once instead of
  // repeating three props on ten components.
  const block = useMemo(
    () => ({ styles, palette, isRTL }),
    [styles, palette, isRTL]
  );

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
  const [searchVisible, setSearchVisible] = useState(false);
  const [walletVisible, setWalletVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [switchToChild, switchState] = useSwitchToChildMutation();

  const canSwitch = typeof activeChildId === "number" && activeChildId > 0;
  const needsChildToken = !childAccessToken;
  const lastSwitchChildIdRef = useRef<number | null>(null);

  // Exchange the parent token for a child token before any child-scoped query.
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
    { levelId: toValidId(levelId), locale: i18n.language ?? "fr" },
    { skip: !toValidId(levelId) }
  );

  const materials: MaterialUI[] = useMemo(
    () => (Array.isArray(materialsData) ? materialsData : []),
    [materialsData]
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
  const homeBooks = useMemo(() => books.slice(0, HOME_BOOKS_LIMIT), [books]);
  const showBooksLoader = isBooksLoading || isBooksFetching;

  // Carousels are laid out LTR by the platform, so in Arabic the arrays are
  // reversed and the swiper is parked at its end — that puts the first item
  // at the natural reading start (the right edge).
  const displayMaterials = useMemo(
    () => (isRTL ? [...materials].reverse() : materials),
    [materials, isRTL]
  );
  const displayBooks = useMemo(
    () => (isRTL ? [...homeBooks].reverse() : homeBooks),
    [homeBooks, isRTL]
  );

  const parkBooksAtStart = useCallback(
    (scrollToEnd: () => void) => {
      if (!isRTL) return;
      requestAnimationFrame(scrollToEnd);
    },
    [isRTL]
  );

  const resume = useMemo(() => pickResumeBook(homeBooks, t), [homeBooks, t]);

  // Pull-to-refresh: the spinner is tied to a user gesture, so background
  // refetches (locale switch, cache invalidation) don't flash it.
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFetchingAny = isMaterialsFetching || isBooksFetching;

  useEffect(() => {
    if (isRefreshing && !isFetchingAny) setIsRefreshing(false);
  }, [isRefreshing, isFetchingAny]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (toValidId(levelId)) refetchMaterials();
    if (isChildReady) refetchBooks();
  }, [levelId, isChildReady, refetchMaterials, refetchBooks]);

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
    () => {
      if (notifVisible) {
        setNotifVisible(false);
      } else {
        setNotifVisible(true);
      }
    },
    [notifVisible]
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

  const materialLabel = useCallback(
    (m: MaterialUI) => getMaterialLabel(t, m),
    [t]
  );

  const seeAllLabel = t(HOME_COMMON_UI.seeAll);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={palette.teal}
            colors={[palette.teal]}
          />
        }
      >
        <HomeHero
          {...block}
          isDark={isDark}
          childName={headerData?.name ?? ""}
          levelLabel={levelLabel || t("home.level_default")}
          topInset={insets.top}
          notificationsLabel={t(HOME_COMMON_UI.notifications)}
           onNotifications={goNotifications}
           onSearch={() => setSearchVisible(true)}
           onStreak={() => setWalletVisible(true)}
        />

        {/* Floats over the hero curve — kept outside `body` so its own
            horizontal margin isn't doubled by the body padding. */}
        {/* <QuickActions
          {...block}
          actions={HOME_QUICK_ACTIONS}
          onPressAction={onPressQuickAction}
        /> */}

        <View style={styles.body}>
          {/* Continue learning — only once something has been started */}
          {!!resume && (
            <ContinueCard
              {...block}
              resume={resume}
              title={t(HOME_UI.continueTitle)}
              ctaLabel={t(HOME_UI.continueCta)}
              progressLabel={t(HOME_UI.progressLabel, { percent: resume.progress })}
              onPress={() => openBook(resume.book.id)}
            />
          )}

          {/* Subjects */}
          <View style={styles.section}>
            <SectionHeader
              {...block}
              title={t(HOME_UI.subjectsTitle)}
              count={materials.length}
              icon="grid"
              accent={HOME_SECTION_ACCENT.subjects}
            />

            {showMaterialsLoader ? (
              <SectionState {...block} status="loading" />
            ) : isMaterialsError ? (
              <SectionState
                {...block}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={refetchMaterials}
              />
            ) : (
              <MaterialsRow
                {...block}
                isDark={isDark}
                materials={displayMaterials}
                getLabel={materialLabel}
                onPressMaterial={openMaterial}
              />
            )}
          </View>

          {/* School books */}
          <View style={styles.section}>
            <SectionHeader
              {...block}
              title={t(HOME_UI.schoolBooks)}
              count={homeBooks.length}
              seeAllLabel={seeAllLabel}
              onSeeAll={goBooks}
              icon="library"
              accent={HOME_SECTION_ACCENT.books}
            />

            {showBooksLoader ? (
              <SectionState {...block} status="loading" />
            ) : isBooksError ? (
              <SectionState
                {...block}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={refetchBooks}
              />
            ) : displayBooks.length === 0 ? (
              <SectionState {...block} status="empty" message={t(HOME_UI.booksEmpty)} />
            ) : (
              <BooksRow
                {...block}
                books={displayBooks}
                unnamedLabel={t("common.unnamed")}
                onPressBook={openBook}
                onLayoutReady={parkBooksAtStart}
              />
            )}
          </View>

         
          {/* Teachers */}
          <View style={styles.section}>
            <SectionHeader
              {...block}
              title={t(HOME_UI.availableTeachers)}
              count={MOCK_TEACHERS.length}
              seeAllLabel={seeAllLabel}
              onSeeAll={goMeetings}
              icon="people"
              accent={HOME_SECTION_ACCENT.teachers}
            />

            <TeachersRow
              {...block}
              teachers={MOCK_TEACHERS}
              onPressTeacher={openTeacher}
            />
          </View>
          {/* Live classes — time-sensitive, so it sits above browse content */}
                    <View style={styles.section}>
                      <SectionHeader
                        {...block}
                        title={t(HOME_UI.liveMeetings)}
                        seeAllLabel={seeAllLabel}
                        onSeeAll={goMeetings}
                        icon="videocam"
                        accent={HOME_SECTION_ACCENT.live}
                      />

                        {/* <LiveNowCard
                          {...block}
                          title={t("home.live_title_mock")}
                          meta={t("home.live_meta_mock")}
                          liveLabel={t(HOME_COMMON_UI.live)}
                          joinLabel={t(HOME_UI.join)}
                          onJoin={goMeetings}
                        /> */}
                    </View>

          {/* Summary + Activities row */}
          <View style={styles.summaryRow}>
            <SummaryCard
              {...block}
              title={t("home.live_title_mock")}
              meta={t("home.live_meta_mock")}
              teacherPhoto={require("../../../assets/teachers/tarek.png")}
              liveLabel={t("home.summary_live_now")}
              joinLabel={t("home.summary_join")}
              onJoin={goMeetings}
            />
            <ActivitiesCard
              {...block}
              title={t("home.activities_title")}
              subtitle={t("home.activities_subtitle")}
              weekDays={["S", "M", "T", "W", "T", "F", "S"]}
              reservedDays={AUGUST_RESERVED_DAYS}
              today={10}
            />
          </View>

          {/* Subscribe */}
          <View style={styles.section}>
            <SubscribeBanner
              {...block}
              title={t(HOME_UI.subscribeTitle)}
              subtitle={t(HOME_UI.subscribeSub)}
              ctaLabel={t(HOME_UI.subscribeCta)}
              onPress={goSubscribe}
            />
           </View>
         </View>
        </ScrollView>

        <DynamicIslandNotification
          visible={notifVisible}
          teacherPhoto={require("../../../assets/teachers/tarek.png")}
          liveLabel={t("home.notif_live_now")}
          teacherName={t("home.live_meta_mock").split("•")[0].trim()}
          meetingTitle={t("home.live_title_mock")}
          meetingTime="18:00 - 19:30"
          joinLabel={t("home.notif_join")}
          timestamp={t("home.notif_just_now")}
          onPress={() => { setNotifVisible(false); goMeetings(); }}
          onDismiss={() => setNotifVisible(false)}
          topInset={insets.top}
          autoShowIntervalMs={30_000}
        />

        <HomeSearchModal
          styles={styles}
          palette={palette}
          isRTL={isRTL}
          isDark={isDark}
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          materials={materials}
          labelForMaterial={(m) => getMaterialLabel(t, m)}
          onSelectMaterial={openMaterial}
          books={books}
          unnamedLabel={t("common.unnamed")}
          onSelectBook={openBook}
          liveSessions={MOCK_MEETINGS}
          onSelectLive={goMeetings}
        />

        <WalletBottomSheet
          visible={walletVisible}
          balance={5}
          currency="DT"
          onClose={() => setWalletVisible(false)}
        />
      </View>
   );
}
