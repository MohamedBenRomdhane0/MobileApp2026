import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { createHomeStyles } from "./HomeScreen.styles";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { LEVEL_LABEL_BY_ID, LevelEnum } from "@config/enums/Level.enum";
import { PATHS } from "@config/constants/paths";
import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId, selectIsDraftMode, selectDraftLevelId } from "@redux/slices/authSlice";
import { useSwitchToChildMutation } from "@redux/apis/child/childApi";
import { useGetMaterialsByLevelQuery } from "@redux/apis/materials/materialsApi";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import { useGetBooksQuery } from "@redux/apis/books/bookApi";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";
import { useGetTeachersQuery } from "@redux/apis/teachers/teacherApi";
import type { TeacherUI } from "@redux/apis/teachers/teacherApi.type";
import { useGetMeetingsQuery, useGetReservedMeetingsQuery, useSubscribeToGroupMutation } from "@redux/apis/meetings/meetingApi";
import type { MeetingListItemUI } from "@redux/apis/meetings/meetingApi.type";
import { useGetPlansForChildQuery } from "@redux/apis/plans/plansApi";
import type { PlanUI } from "@redux/apis/plans/plansApi.type";

import {
  useGetDraftBooksQuery,
  useGetDraftLevelMaterialsQuery,
  useGetDraftPlansQuery,
  useGetDraftMeetingsQuery,
} from "@redux/apis/draft/draftApi";

import HomeHero from "@screens/home/components/HomeHero";
import HomeStickyHeader from "@screens/home/components/HomeStickyHeader";
import DiscoveryModeCard from "@screens/home/components/DiscoveryModeCard";
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
import RecordBubbles from "@screens/home/components/RecordBubbles";
import MeetingCardsRail from "@components/meetings/MeetingCardsRail";
import ReserveMeetingModal, {
  type ReserveMeetingData,
} from "@components/meetings/ReserveMeetingModal";
import MiniPlanCards from "@screens/home/components/MiniPlanCards";
import LevelSelectionPopup from "@screens/home/components/LevelSelectionPopup";
import LoginRequiredPopup from "@components/guards/LoginRequiredPopup";
import SignInPopup from "@components/auth/SignInPopup";
import SignUpPopup from "@components/auth/SignUpPopup";

import {
  HOME_UI,
  HOME_COMMON_UI,
  HOME_QUICK_ACTIONS,
  HOME_SECTION_ACCENT,
  MOCK_MEETINGS,
  getHomePalette,
} from "./HomeScreen.constants";
import {
  getMaterialLabel,
  pickResumeBook,
  toValidId,
} from "./HomeScreen.helpers";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import type { HomeQuickAction } from "./HomeScreen.type";

const HOME_BOOKS_LIMIT = 12;
const HOME_MINI_PLANS_LIMIT = 4;

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

  const block = useMemo(
    () => ({ styles, palette, isRTL }),
    [styles, palette, isRTL]
  );

  const isDraftMode = useAppSelector(selectIsDraftMode);
  const draftLevelId = useAppSelector(selectDraftLevelId);
  const [showLevelPopup, setShowLevelPopup] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (isDraftMode && !draftLevelId) {
      setShowLevelPopup(true);
    }
    if (!isDraftMode) {
      setShowLevelPopup(false);
    }
  }, [isDraftMode, draftLevelId]);

  const handleLevelSelect = useCallback(() => {
    setShowLevelPopup(false);
  }, []);

  const [reserveVisible, setReserveVisible] = useState(false);
  const [reserveSession, setReserveSession] = useState<ReserveMeetingData | null>(null);
  const [subscribeToGroup, { isLoading: subscribing }] = useSubscribeToGroupMutation();

  const closeReserve = useCallback(() => {
    setReserveVisible(false);
    setReserveSession(null);
  }, []);

  const openReserve = useCallback(
    (card: {
      name: string;
      accent: string;
      price: number;
      teacherName: string;
      groupId: number | null;
      time: string;
      daysPerWeek: number;
    }) => {
      setReserveSession({
        groupId: card.groupId,
        materialName: card.name,
        teacherName: card.teacherName,
        price: card.price,
        sessionsPerWeek: card.daysPerWeek,
        time: card.time,
        accent: card.accent,
      });
      setReserveVisible(true);
    },
    []
  );

  const confirmReserve = useCallback(async () => {
    if (!reserveSession) return;
    if (isDraftMode || !reserveSession.groupId) {
      setReserveVisible(false);
      setReserveSession(null);
      setShowLoginRequired(true);
      return;
    }
    try {
      await subscribeToGroup({
        groupId: reserveSession.groupId,
        billingCycle: "monthly",
      }).unwrap();
      closeReserve();
      Alert.alert(t("learning.reserve_success", { name: reserveSession.materialName }));
    } catch (err: any) {
      const msg = err?.data?.message || t("learning.reserve_error");
      Alert.alert(msg);
    }
  }, [reserveSession, subscribeToGroup, isDraftMode, closeReserve, t]);

  const headerData = useActiveChildHeaderData();
  const levelId = useMemo(
    () => pickLevelIdFromChild(headerData?.child),
    [headerData?.child]
  );
  const levelLabel = useMemo(
    () => (levelId ? LEVEL_LABEL_BY_ID[levelId] : ""),
    [levelId]
  );

  const showConcours = levelId === LevelEnum.Six || levelId === 12;
  const showDraftConcours = draftLevelId === LevelEnum.Six || draftLevelId === 12;

  const activeChildId = useAppSelector(selectActiveChildId);
  const childAccessToken = useAppSelector((s) => s.auth.childAccessToken);
  const [keyword] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [walletVisible, setWalletVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [switchToChild, switchState] = useSwitchToChildMutation();

  const canSwitch = typeof activeChildId === "number" && activeChildId > 0;
  const needsChildToken = !childAccessToken;
  const lastSwitchChildIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDraftMode) return;
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
    isDraftMode,
    needsChildToken,
    canSwitch,
    activeChildId,
    switchToChild,
    switchState.isLoading,
    switchState.isSuccess,
  ]);

  const isChildReady = !isDraftMode && canSwitch && !!childAccessToken;

  // ── Draft mode queries ──────────────────────────────────────────
  const {
    data: draftMaterials,
    isLoading: isDraftMaterialsLoading,
    isFetching: isDraftMaterialsFetching,
    isError: isDraftMaterialsError,
    refetch: refetchDraftMaterials,
  } = useGetDraftLevelMaterialsQuery(
    { levelId: draftLevelId ?? 0, locale: i18n.language ?? "fr" },
    { skip: !isDraftMode || !draftLevelId }
  );

  const {
    data: draftBooksData,
    isLoading: isDraftBooksLoading,
    isFetching: isDraftBooksFetching,
    isError: isDraftBooksError,
    refetch: refetchDraftBooks,
  } = useGetDraftBooksQuery(
    { levelId: draftLevelId ?? 0, page: 1, perPage: 20 },
    { skip: !isDraftMode || !draftLevelId }
  );

  const {
    data: draftConcoursData,
    isLoading: isDraftConcoursLoading,
    isFetching: isDraftConcoursFetching,
    isError: isDraftConcoursError,
    refetch: refetchDraftConcours,
  } = useGetDraftBooksQuery(
    { levelId: draftLevelId ?? 0, page: 1, perPage: 20, type: 2 },
    { skip: !isDraftMode || !draftLevelId }
  );

  const draftConcoursBooks: BookListItemUI[] = useMemo(
    () =>
      isDraftMode
        ? Array.isArray(draftConcoursData?.data)
          ? draftConcoursData.data
          : []
        : [],
    [isDraftMode, draftConcoursData]
  );
  const homeDraftConcours = useMemo(
    () => draftConcoursBooks.slice(0, HOME_BOOKS_LIMIT),
    [draftConcoursBooks]
  );
  const showDraftConcoursLoader = isDraftConcoursLoading || isDraftConcoursFetching;
  const isDraftConcoursErrorBool = isDraftConcoursError;

  const {
    data: draftPlans,
    isLoading: isDraftPlansLoading,
    isError: isDraftPlansError,
    refetch: refetchDraftPlans,
  } = useGetDraftPlansQuery(
    draftLevelId ? { levelId: draftLevelId } : undefined,
    { skip: !isDraftMode || !draftLevelId }
  );

  const {
    data: draftMeetingsData,
    isLoading: isDraftMeetingsLoading,
    isFetching: isDraftMeetingsFetching,
    isError: isDraftMeetingsError,
    refetch: refetchDraftMeetings,
  } = useGetDraftMeetingsQuery(
    draftLevelId ? { levelId: draftLevelId, page: 1, perPage: 20 } : undefined,
    { skip: !isDraftMode || !draftLevelId }
  );

  const draftMeetings: MeetingListItemUI[] = useMemo(
    () =>
      isDraftMode
        ? Array.isArray(draftMeetingsData)
          ? draftMeetingsData
          : []
        : [],
    [isDraftMode, draftMeetingsData]
  );
  const homeDraftMeetings = useMemo(
    () => draftMeetings.slice(0, 10),
    [draftMeetings]
  );
  const showDraftMeetingsLoader = isDraftMeetingsLoading || isDraftMeetingsFetching;
  const isDraftMeetingsErrorBool = isDraftMeetingsError;

  // ── Auth mode queries ───────────────────────────────────────────
  const {
    data: materialsData,
    isLoading: isMaterialsLoading,
    isFetching: isMaterialsFetching,
    isError: isMaterialsError,
    refetch: refetchMaterials,
  } = useGetMaterialsByLevelQuery(
    { levelId: toValidId(levelId), locale: i18n.language ?? "fr" },
    { skip: isDraftMode || !toValidId(levelId) }
  );

  const materials: MaterialUI[] = useMemo(() => {
    if (isDraftMode) return Array.isArray(draftMaterials) ? draftMaterials : [];
    return Array.isArray(materialsData) ? materialsData : [];
  }, [isDraftMode, draftMaterials, materialsData]);
  const showMaterialsLoader = isDraftMode
    ? isDraftMaterialsLoading || isDraftMaterialsFetching
    : isMaterialsLoading || isMaterialsFetching;

  const {
    data: booksData,
    isLoading: isBooksLoading,
    isFetching: isBooksFetching,
    isError: isBooksError,
    refetch: refetchBooks,
  } = useGetBooksQuery(
    { page: 1, perPage: 20, keyword, childId: activeChildId ?? undefined, type: 1 },
    { skip: isDraftMode || !activeChildId }
  );

  const books: BookListItemUI[] = useMemo(() => {
    if (isDraftMode) {
      const items = draftBooksData?.data;
      return Array.isArray(items) ? items : [];
    }
    return Array.isArray(booksData?.data) ? booksData.data : [];
  }, [isDraftMode, draftBooksData, booksData]);
  const homeBooks = useMemo(() => books.slice(0, HOME_BOOKS_LIMIT), [books]);
  const showBooksLoader = isDraftMode
    ? isDraftBooksLoading || isDraftBooksFetching
    : isBooksLoading || isBooksFetching;

  const {
    data: concoursData,
    isLoading: isConcoursLoading,
    isFetching: isConcoursFetching,
    isError: isConcoursError,
    refetch: refetchConcours,
  } = useGetBooksQuery(
    { page: 1, perPage: 20, keyword, childId: activeChildId ?? undefined, type: 2 },
    { skip: isDraftMode || !activeChildId || !showConcours }
  );

  const concoursBooks: BookListItemUI[] = useMemo(
    () => (Array.isArray(concoursData?.data) ? concoursData.data : []),
    [concoursData]
  );
  const homeConcours = useMemo(() => concoursBooks.slice(0, HOME_BOOKS_LIMIT), [concoursBooks]);
  const showConcoursLoader = isConcoursLoading || isConcoursFetching;

  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    isFetching: isTeachersFetching,
    refetch: refetchTeachers,
  } = useGetTeachersQuery(
    activeChildId ? { page: 1, perPage: 20, childId: activeChildId } : undefined,
    { skip: isDraftMode || !activeChildId, refetchOnMountOrArgChange: true }
  );

  const lastChildTokenRef = useRef<string | null>(childAccessToken);

  useEffect(() => {
    if (isDraftMode || !activeChildId || !childAccessToken) return;
    if (lastChildTokenRef.current === childAccessToken) return;
    lastChildTokenRef.current = childAccessToken;
    refetchTeachers();
  }, [isDraftMode, activeChildId, childAccessToken, refetchTeachers]);

  const teachers = useMemo(() => {
    const items: TeacherUI[] = Array.isArray(teachersData?.data)
      ? teachersData.data
      : [];
    return items.map((t) => ({
      id: t.id,
      fullName: t.fullName,
      subject: t.materialName ?? t.subjectName ?? "",
      avatarUrl: t.avatarUrl,
      rating: t.ratingAverage,
      isFollowed: t.isFollowed,
      followersCount: t.followersCount,
    }));
  }, [teachersData]);

  const plans: PlanUI[] = useMemo(() => {
    if (isDraftMode) {
      const items = draftPlans;
      return Array.isArray(items) ? items.slice(0, HOME_MINI_PLANS_LIMIT) : [];
    }
    return [];
  }, [isDraftMode, draftPlans]);

  const {
    data: plansData,
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useGetPlansForChildQuery(
    levelId ? { levelId: toValidId(levelId) } : undefined,
    { skip: isDraftMode || !toValidId(levelId) }
  );

  const authPlans: PlanUI[] = useMemo(
    () =>
      !isDraftMode && Array.isArray(plansData)
        ? plansData.slice(0, HOME_MINI_PLANS_LIMIT)
        : [],
    [isDraftMode, plansData]
  );

  const displayPlans = isDraftMode ? plans : authPlans;

  const TEACHER_PHOTOS = useMemo(() => [
    require("@assets/teachers/ismail.png"),
    require("@assets/teachers/tounes.png"),
    require("@assets/teachers/tarek.png"),
  ], []);

  const { data: meetingsData } = useGetMeetingsQuery(
    { page: 1, perPage: 10, childId: activeChildId ?? undefined },
    { skip: isDraftMode || !activeChildId, refetchOnMountOrArgChange: true }
  );
  const { data: reservedData } = useGetReservedMeetingsQuery(activeChildId ?? undefined, {
    skip: isDraftMode || !activeChildId,
    refetchOnMountOrArgChange: true,
  });

  const meetings: MeetingListItemUI[] = useMemo(() => {
    const items = meetingsData?.data?.items;
    return Array.isArray(items) ? items : [];
  }, [meetingsData]);

  const reservedMeetings: MeetingListItemUI[] = useMemo(() => {
    const items = reservedData?.data?.items;
    return Array.isArray(items) ? items : [];
  }, [reservedData]);

  const reservedGroupIds = useMemo(() => {
    const ids = new Set<number>();
    for (const m of reservedMeetings) {
      for (const g of m.meetingGroups ?? []) {
        ids.add(g.id);
      }
    }
    return ids;
  }, [reservedMeetings]);

  const nearestMeeting = useMemo(() => {
    if (reservedMeetings.length === 0) return null;
    const now = new Date();
    const nowMs = now.getTime();

    type Candidate = { meeting: MeetingListItemUI; nextStartMs: number };
    const candidates: Candidate[] = [];

    for (const m of reservedMeetings) {
      const groups = m.meetingGroups ?? [];
      let foundDated = false;
      for (const g of groups) {
        for (const mt of g.meetingTimes ?? []) {
          if (!mt.startsAt) continue;
          const startMs = new Date(mt.startsAt.replace(" ", "T")).getTime();
          if (startMs > nowMs) {
            candidates.push({ meeting: m, nextStartMs: startMs });
            foundDated = true;
            break;
          }
        }
        if (foundDated) break;

        const schedDays = g.scheduleDays ?? [];
        if (schedDays.length > 0 && g.startTime) {
          const [sh, sm] = g.startTime.split(":").map(Number);
          for (let d = 0; d <= 7; d++) {
            const check = new Date(now);
            check.setDate(now.getDate() + d);
            check.setHours(sh, sm || 0, 0, 0);
            if (schedDays.includes(check.getDay()) && check.getTime() > nowMs) {
              candidates.push({ meeting: m, nextStartMs: check.getTime() });
              foundDated = true;
              break;
            }
          }
        }
        if (foundDated) break;
      }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.nextStartMs - b.nextStartMs);
    return candidates[0].meeting;
  }, [reservedMeetings]);

  const hasReservedMeeting = nearestMeeting != null;
  const activeMeeting = nearestMeeting ?? meetings[0];
  const firstTeacherId = activeMeeting?.teacherId ?? -1;

  const { isLive, startTimeLabel, nextSessionDate } = useMemo(() => {
    if (!activeMeeting) return { isLive: false, startTimeLabel: "", nextSessionDate: "" };
    const groups = activeMeeting.meetingGroups ?? [];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const stripSeconds = (t: string) => t.replace(/:\d{2}$/, "").trim();

    const fmtDate = (d: Date) => {
      const dayNames = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
      const monthNames = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
      return `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`;
    };

    for (const g of groups) {
      for (const mt of g.meetingTimes ?? []) {
        if (!mt.startsAt || !mt.endsAt) continue;
        const start = new Date(mt.startsAt.replace(" ", "T"));
        const end = new Date(mt.endsAt.replace(" ", "T"));
        if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;
        if (
          start.getFullYear() === now.getFullYear() &&
          start.getMonth() === now.getMonth() &&
          start.getDate() === now.getDate()
        ) {
          const startMin = start.getHours() * 60 + start.getMinutes();
          const endMin = end.getHours() * 60 + end.getMinutes();
          const label = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
          if (nowMinutes >= startMin && nowMinutes <= endMin) {
            return { isLive: true, startTimeLabel: label, nextSessionDate: "Aujourd'hui" };
          }
          if (nowMinutes < startMin) {
            return { isLive: false, startTimeLabel: label, nextSessionDate: "Aujourd'hui" };
          }
        }
        if (start.getTime() > now.getTime()) {
          const label = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
          return { isLive: false, startTimeLabel: label, nextSessionDate: start.toDateString() === now.toDateString() ? "Aujourd'hui" : fmtDate(start) };
        }
      }
    }

    const todayWeekday = now.getDay();
    for (const g of groups) {
      const schedDays = g.scheduleDays ?? [];
      if (schedDays.includes(todayWeekday) && g.startTime && g.endTime) {
        const [sh, sm] = g.startTime.split(":").map(Number);
        const [eh, em] = g.endTime.split(":").map(Number);
        const startMin = sh * 60 + (sm || 0);
        const endMin = eh * 60 + (em || 0);
        if (nowMinutes >= startMin && nowMinutes <= endMin) {
          return { isLive: true, startTimeLabel: stripSeconds(g.startTime), nextSessionDate: "Aujourd'hui" };
        }
        if (nowMinutes < startMin) {
          return { isLive: false, startTimeLabel: stripSeconds(g.startTime), nextSessionDate: "Aujourd'hui" };
        }
      }
      if (schedDays.length > 0 && g.startTime) {
        for (let d = 1; d <= 7; d++) {
          const check = new Date(now);
          check.setDate(check.getDate() + d);
          if (schedDays.includes(check.getDay())) {
            return { isLive: false, startTimeLabel: stripSeconds(g.startTime), nextSessionDate: fmtDate(check) };
          }
        }
      }
    }

    return { isLive: false, startTimeLabel: stripSeconds(activeMeeting.nextSessionAt ?? ""), nextSessionDate: "" };
  }, [activeMeeting]);

  const teacherAvatarLookup = useMemo(() => {
    const map = new Map<number, { avatarUrl: string | null; localPhoto: number }>();
    let localIdx = 0;
    for (const t of teachers) {
      const local = TEACHER_PHOTOS[localIdx % TEACHER_PHOTOS.length];
      map.set(t.id, { avatarUrl: t.avatarUrl ?? null, localPhoto: local });
      localIdx++;
    }
    const all = [...meetings, ...reservedMeetings];
    for (const m of all) {
      const tid = m.teacherId ?? -1;
      if (tid < 0) continue;
      const existing = map.get(tid);
      if (existing) {
        if (!existing.avatarUrl && m.teacherAvatarUrl) {
          existing.avatarUrl = m.teacherAvatarUrl;
        }
      } else {
        map.set(tid, {
          avatarUrl: m.teacherAvatarUrl ?? null,
          localPhoto: TEACHER_PHOTOS[localIdx % TEACHER_PHOTOS.length],
        });
        localIdx++;
      }
    }
    return map;
  }, [meetings, reservedMeetings, teachers]);

  const summaryTitle = useMemo(() => {
    if (!activeMeeting) return t("home.live_title_mock");
    const mat = activeMeeting.materialName || activeMeeting.name;
    const lvl = activeMeeting.levelName || "";
    return lvl ? `${mat} (${lvl})` : mat;
  }, [activeMeeting, t]);

  const summaryMeta = useMemo(() => {
    if (!activeMeeting) return t("home.live_meta_mock");
    return activeMeeting.teacherName || "";
  }, [activeMeeting, t]);

  const summaryTeacherPhoto = useMemo(() => {
    const lookup = teacherAvatarLookup.get(firstTeacherId);
    if (lookup?.avatarUrl) return { uri: lookup.avatarUrl };
    return lookup?.localPhoto ?? TEACHER_PHOTOS[0];
  }, [firstTeacherId, teacherAvatarLookup]);

  const reservedDays = useMemo(() => {
    const now = new Date();
    const targetMonth = (now.getMonth() + calendarMonthOffset) % 12;
    const targetYear = now.getFullYear() + (now.getMonth() + calendarMonthOffset >= 12 ? 1 : 0);
    const todayDate = now.getDate();
    const isCurrentMonth = calendarMonthOffset === 0;
    const result: { day: number; teacherPhoto: number | { uri: string }; accent: string }[] = [];
    const seen = new Map<number, { teacherPhoto: number | { uri: string }; accent: string }>();

    const addDay = (dayNum: number, teacherId: number | null, color: string) => {
      if (dayNum < 1 || dayNum > 31) return;
      if (seen.has(dayNum)) return;
      const lookup = teacherAvatarLookup.get(teacherId ?? -1);
      const photo = lookup?.avatarUrl ? { uri: lookup.avatarUrl } : (lookup?.localPhoto ?? TEACHER_PHOTOS[0]);
      seen.set(dayNum, { teacherPhoto: photo, accent: color || "#22BEC8" });
    };

    const isInCycle = (dateMs: number, cycleStart: string | null, cycleEnd: string | null): boolean => {
      if (!cycleStart && !cycleEnd) return true;
      if (cycleStart) {
        const s = new Date(cycleStart).getTime();
        if (!isNaN(s) && dateMs < s) return false;
      }
      if (cycleEnd) {
        const e = new Date(cycleEnd).getTime();
        if (!isNaN(e) && dateMs > e) return false;
      }
      return true;
    };

    for (const m of reservedMeetings) {
      const groups = m.meetingGroups ?? [];
      for (const g of groups) {
        const cycleStart = g.cycleStartDate;
        const cycleEnd = g.cycleEndDate;
        const times = g.meetingTimes ?? [];
        let foundFromTimes = false;

        for (const mt of times) {
          const dateStr = mt.meetingDate;
          if (!dateStr) continue;
          const d = new Date(dateStr);
          if (d.getMonth() !== targetMonth || d.getFullYear() !== targetYear) continue;
          if (!isInCycle(d.getTime(), cycleStart, cycleEnd)) continue;
          addDay(d.getDate(), m.teacherId, m.materialColor);
          foundFromTimes = true;
        }

        if (!foundFromTimes) {
          const schedDays = g.scheduleDays ?? [];
          const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
          const startDay = isCurrentMonth ? todayDate : 1;
          for (const weekday of schedDays) {
            for (let day = startDay; day <= daysInMonth; day++) {
              const d = new Date(targetYear, targetMonth, day);
              if (d.getDay() === weekday) {
                if (!isInCycle(d.getTime(), cycleStart, cycleEnd)) continue;
                addDay(day, m.teacherId, m.materialColor);
              }
            }
          }
        }
      }
    }
    seen.forEach((v, day) => result.push({ day, ...v }));
    return result;
  }, [reservedMeetings, teacherAvatarLookup, calendarMonthOffset]);

  const calendarMonthLabel = useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + calendarMonthOffset, 1);
    const monthNames = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
    const monthNamesAr = ["جانفي", "فبراير", "مارس", "أبريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lang = i18n.language ?? "fr";
    const names = lang === "ar" ? monthNamesAr : lang === "en" ? monthNamesEn : monthNames;
    return names[target.getMonth()];
  }, [calendarMonthOffset, i18n.language]);

  const calendarToday = useMemo(() => {
    const now = new Date();
    if (calendarMonthOffset === 0) return now.getDate();
    return -1;
  }, [calendarMonthOffset]);

  const calendarTargetDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + calendarMonthOffset, 1);
  }, [calendarMonthOffset]);

  const displayMaterials = useMemo(
    () => (isRTL ? [...materials].reverse() : materials),
    [materials, isRTL]
  );
  const displayBooks = useMemo(
    () => (isRTL ? [...homeBooks].reverse() : homeBooks),
    [homeBooks, isRTL]
  );
  const displayConcours = useMemo(
    () => (isRTL ? [...homeConcours].reverse() : homeConcours),
    [homeConcours, isRTL]
  );

  const parkBooksAtStart = useCallback(
    (scrollToEnd: () => void) => {
      if (!isRTL) return;
      requestAnimationFrame(scrollToEnd);
    },
    [isRTL]
  );

  const resume = useMemo(() => pickResumeBook(homeBooks, t), [homeBooks, t]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFetchingAny = isDraftMode
    ? isDraftMaterialsFetching || isDraftBooksFetching
    : isMaterialsFetching || isBooksFetching || isConcoursFetching;

  const [isScrolled, setIsScrolled] = useState(false);

  const onStickyScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setIsScrolled(y > 2);
  }, []);

  useEffect(() => {
    if (isRefreshing && !isFetchingAny) setIsRefreshing(false);
  }, [isRefreshing, isFetchingAny]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCalendarMonthOffset(0);
    if (isDraftMode) {
      if (draftLevelId) {
        refetchDraftMaterials();
        refetchDraftBooks();
      }
    } else {
      if (toValidId(levelId)) refetchMaterials();
      if (isChildReady) {
        refetchBooks();
        refetchConcours();
      }
    }
  }, [isDraftMode, draftLevelId, levelId, isChildReady, refetchDraftMaterials, refetchDraftBooks, refetchMaterials, refetchBooks, refetchConcours]);

  const goSubscribe = useCallback(
    () => navigation.navigate(PATHS.APP.PLAN_PRO_PRICING as never, { plans: displayPlans } as never),
    [navigation, displayPlans]
  );
  const goPlanPricing = useCallback(
    (planId: number) => navigation.navigate(PATHS.APP.PLAN_PRO_PRICING as never, { plans: displayPlans, selectedPlanId: planId } as never),
    [navigation, displayPlans]
  );
  const goBooks = useCallback(
    () => navigation.navigate(PATHS.TABS.BOOKS as never),
    [navigation]
  );
  const goMeetings = useCallback(
    () => navigation.navigate(PATHS.APP.JOIN_SESSION as never),
    [navigation]
  );
  const goReserve = useCallback(
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
      const lvl = isDraftMode ? draftLevelId : toValidId(levelId);
      const mat = toValidId(m?.id);
      if (!lvl || !mat) return;
      navigation.navigate(PATHS.APP.MATERIAL_HUB, {
        levelId: lvl,
        materialId: mat,
        materialName: String(m?.name ?? "").trim(),
        levelMaterialId: toValidId(m?.levelMaterialId),
      });
    },
    [navigation, levelId, isDraftMode, draftLevelId]
  );

  const openTeacher = useCallback(
    (teacherId: number) => {
      const id = toValidId(teacherId);
      if (!id) return;
      navigation.navigate(PATHS.APP.TEACHER_PROFILE, { teacherId: id });
    },
    [navigation]
  );

  const goAllTeachers = useCallback(
    () => navigation.navigate(PATHS.APP.ALL_TEACHERS as never),
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

  const draftLevelLabel = useMemo(() => {
    if (!isDraftMode || !draftLevelId) return "";
    return LEVEL_LABEL_BY_ID[draftLevelId] ?? "";
  }, [isDraftMode, draftLevelId]);

  const heroChildName = isDraftMode
    ? t("home.visitor_greeting", { defaultValue: "Welcome, Visitor!" })
    : headerData?.name ?? "";
  const heroLevelLabel = isDraftMode
    ? draftLevelLabel || t("home.level_default")
    : levelLabel || t("home.level_default");

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {isDraftMode && (
        <LevelSelectionPopup visible={showLevelPopup} onSelect={handleLevelSelect} />
      )}

      <LoginRequiredPopup
        visible={showLoginRequired}
        onClose={() => setShowLoginRequired(false)}
      />

      <SignInPopup
        visible={showSignIn}
        onClose={() => setShowSignIn(false)}
      />

      <SignUpPopup
        visible={showSignUp}
        onClose={() => setShowSignUp(false)}
      />

      <ReserveMeetingModal
        visible={reserveVisible}
        session={reserveSession}
        loading={subscribing}
        onClose={closeReserve}
        onConfirm={confirmReserve}
      />

      <HomeStickyHeader
        styles={styles}
        isDark={isDark}
        topInset={insets.top}
        scrolled={isScrolled}
        notificationsLabel={t(HOME_COMMON_UI.notifications)}
        isGuest={isDraftMode}
        onNotifications={isDraftMode ? undefined : goNotifications}
        onSearch={() => setSearchVisible(true)}
        onStreak={isDraftMode ? undefined : () => setWalletVisible(true)}
        onAvatarPress={
          isDraftMode
            ? () => setShowSignIn(true)
            : showConcours
              ? () => navigation.navigate(PATHS.TABS.SETTINGS as never)
              : undefined
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onStickyScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={palette.teal}
            colors={[palette.teal]}
          />
        }
      >
        {isDraftMode ? (
          <View style={styles.bodyTop}>
            <DiscoveryModeCard
              {...block}
              isDark={isDark}
              titleLabel={t("home.discovery_mode_title")}
              subtitleLabel={t("home.discovery_mode_subtitle")}
              ctaLabel={t("home.finish_registration")}
              onPress={() => setShowSignUp(true)}
            />
          </View>
        ) : (
          <HomeHero
            {...block}
            isDark={isDark}
            scrolled={isScrolled}
            childName={heroChildName}
            levelLabel={heroLevelLabel}
          />
        )}

        <View style={styles.body}>
          {!isDraftMode && !!resume && (
            <ContinueCard
              {...block}
              resume={resume}
              title={t(HOME_UI.continueTitle)}
              ctaLabel={t(HOME_UI.continueCta)}
              progressLabel={t(HOME_UI.progressLabel, { percent: resume.progress })}
              onPress={() => openBook(resume.book.id)}
            />
          )}

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
            ) : isMaterialsError || isDraftMaterialsError ? (
              <SectionState
                {...block}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={isDraftMode ? refetchDraftMaterials : refetchMaterials}
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
            ) : isBooksError || isDraftBooksError ? (
              <SectionState
                {...block}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={isDraftMode ? refetchDraftBooks : refetchBooks}
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

          {showDraftConcours && (
            <View style={styles.section}>
              <SectionHeader
                {...block}
                title={t(HOME_UI.concoursBooks)}
                count={homeDraftConcours.length}
                seeAllLabel={seeAllLabel}
                onSeeAll={goBooks}
                icon="trophy"
                accent={HOME_SECTION_ACCENT.concours}
              />

              {showDraftConcoursLoader ? (
                <SectionState {...block} status="loading" />
              ) : isDraftConcoursErrorBool ? (
                <SectionState
                  {...block}
                  status="error"
                  message={t(HOME_COMMON_UI.tapToRetry)}
                  onRetry={refetchDraftConcours}
                />
              ) : homeDraftConcours.length === 0 ? (
                <SectionState {...block} status="empty" message={t(HOME_UI.concoursEmpty)} />
              ) : (
                <BooksRow
                  {...block}
                  books={homeDraftConcours}
                  unnamedLabel={t("common.unnamed")}
                  onPressBook={openBook}
                  onLayoutReady={parkBooksAtStart}
                />
              )}
            </View>
          )}

          {isDraftMode && homeDraftMeetings.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                {...block}
                title={t(HOME_UI.liveClasses)}
                count={homeDraftMeetings.length}
                seeAllLabel={seeAllLabel}
                onSeeAll={goMeetings}
                icon="flame"
                accent={HOME_SECTION_ACCENT.liveClasses}
              />

              {showDraftMeetingsLoader ? (
                <SectionState {...block} status="loading" />
              ) : isDraftMeetingsErrorBool ? (
                <SectionState
                  {...block}
                  status="error"
                  message={t(HOME_COMMON_UI.tapToRetry)}
                  onRetry={refetchDraftMeetings}
                />
              ) : (
                <MeetingCardsRail
                  meetings={homeDraftMeetings}
                  onPressCard={openReserve}
                />
              )}
            </View>
          )}

          {!isDraftMode && (
            <View style={styles.section}>
              <SectionHeader
                {...block}
                title={t(HOME_UI.availableTeachers)}
                count={teachers.length}
                seeAllLabel={seeAllLabel}
                onSeeAll={goAllTeachers}
                icon="people"
                accent={HOME_SECTION_ACCENT.teachers}
              />

              <TeachersRow
                {...block}
                teachers={teachers}
                onPressTeacher={openTeacher}
              />
            </View>
          )}

          {!isDraftMode && showConcours && (
            <View style={styles.section}>
              <SectionHeader
                {...block}
                title={t(HOME_UI.concoursBooks)}
                count={homeConcours.length}
                seeAllLabel={seeAllLabel}
                onSeeAll={goBooks}
                icon="trophy"
                accent={HOME_SECTION_ACCENT.concours}
              />

              {showConcoursLoader ? (
                <SectionState {...block} status="loading" />
              ) : isConcoursError ? (
                <SectionState
                  {...block}
                  status="error"
                  message={t(HOME_COMMON_UI.tapToRetry)}
                  onRetry={refetchConcours}
                />
              ) : displayConcours.length === 0 ? (
                <SectionState {...block} status="empty" message={t(HOME_UI.concoursEmpty)} />
              ) : (
                <BooksRow
                  {...block}
                  books={displayConcours}
                  unnamedLabel={t("common.unnamed")}
                  onPressBook={openBook}
                  onLayoutReady={parkBooksAtStart}
                />
              )}
            </View>
          )}

          {!isDraftMode && (
            <View style={styles.section}>
              <SectionHeader
                {...block}
                title={t(HOME_UI.liveMeetings)}
                seeAllLabel={seeAllLabel}
                onSeeAll={goMeetings}
                icon="videocam"
                accent={HOME_SECTION_ACCENT.live}
              />
            </View>
          )}

          {!isDraftMode && (
            <View style={styles.summaryRow}>
              <SummaryCard
                {...block}
                title={summaryTitle}
                meta={summaryMeta}
                teacherPhoto={summaryTeacherPhoto}
                liveLabel={t("home.summary_live_now")}
                joinLabel={t("home.summary_join")}
                reserveLabel={t("home.summary_reserve", { defaultValue: "Réserver" })}
                isLive={isLive}
                startTimeLabel={startTimeLabel}
                nextSessionDate={nextSessionDate}
                participants={activeMeeting?.meetingGroups?.reduce((s, g) => s + (g.enrolledCount ?? 0), 0) ?? 0}
                hasReservedMeeting={hasReservedMeeting}
                onJoin={goMeetings}
                onReserve={goReserve}
              />
              <ActivitiesCard
                {...block}
                title={t("home.activities_title")}
                subtitle={t("home.activities_subtitle")}
                weekDays={["S", "M", "T", "W", "T", "F", "S"]}
                reservedDays={reservedDays}
                today={calendarToday}
                monthLabel={calendarMonthLabel}
                targetDate={calendarTargetDate}
                onMonthAdvance={() => setCalendarMonthOffset((p) => Math.min(p + 1, 1))}
              />
            </View>
          )}

          {!isDraftMode && (
            <MeetingCardsRail
              meetings={meetings}
              reservedGroupIds={reservedGroupIds}
              onPressCard={openReserve}
            />
          )}

          <View style={styles.section}>
            <SectionHeader
              {...block}
              title={t(HOME_UI.plansTitle)}
              count={displayPlans.length}
              seeAllLabel={seeAllLabel}
              onSeeAll={goSubscribe}
              icon="diamond"
              accent={HOME_SECTION_ACCENT.plans}
            />

            {(isDraftMode ? isDraftPlansLoading : isPlansLoading) ? (
              <SectionState {...block} status="loading" />
            ) : (isDraftMode ? isDraftPlansError : isPlansError) ? (
              <SectionState
                {...block}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={isDraftMode ? refetchDraftPlans : refetchPlans}
              />
            ) : displayPlans.length > 0 ? (
              <View style={styles.plansCardFrame}>
                <MiniPlanCards
                  {...block}
                  plans={displayPlans}
                  currencyLabel={t("plan.currency", { defaultValue: "د.ت" })}
                  perMonthLabel={t("plan.per_month")}
                  annualLabel={t("plan.period_yearly", { defaultValue: "Annuel" })}
                  startingFromLabel={t("plan.starting_from", { defaultValue: "À partir de" })}
                  popularLabel={t("plan.most_popular")}
                  ctaLabel={t("plan.cta_label")}
                  noPricingLabel={t("plan.no_pricing", { defaultValue: "Voir détails" })}
                  onPress={goSubscribe}
                  onPlanPress={goPlanPricing}
                />
              </View>
            ) : null}
          </View>

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

        {!isDraftMode && <RecordBubbles {...block} />}
      </ScrollView>

      {!isDraftMode && (
        <DynamicIslandNotification
          visible={isLive ? notifVisible : false}
          teacherPhoto={summaryTeacherPhoto}
          liveLabel={t("home.notif_live_now")}
          teacherName={activeMeeting?.teacherName || ""}
          meetingTitle={summaryTitle}
          meetingTime={activeMeeting?.meetingGroups?.[0]?.startTime && activeMeeting?.meetingGroups?.[0]?.endTime
            ? `${activeMeeting.meetingGroups[0].startTime} - ${activeMeeting.meetingGroups[0].endTime}`
            : ""}
          joinLabel={t("home.notif_join")}
          timestamp={t("home.notif_just_now")}
          onPress={() => { setNotifVisible(false); goMeetings(); }}
          onDismiss={() => setNotifVisible(false)}
          topInset={insets.top}
          autoShowIntervalMs={isLive ? 30_000 : undefined}
        />
      )}

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

      {!isDraftMode && (
        <WalletBottomSheet
          visible={walletVisible}
          currency="DT"
          onClose={() => setWalletVisible(false)}
        />
      )}
    </View>
  );
}
