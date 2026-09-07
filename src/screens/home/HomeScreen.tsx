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
import { useGetTeachersQuery } from "@redux/apis/teachers/teacherApi";
import type { TeacherUI } from "@redux/apis/teachers/teacherApi.type";
import { useGetMeetingsQuery, useGetReservedMeetingsQuery } from "@redux/apis/meetings/meetingApi";
import type { MeetingListItemUI } from "@redux/apis/meetings/meetingApi.type";
import { useGetPlansForChildQuery } from "@redux/apis/plans/plansApi";
import type { PlanUI } from "@redux/apis/plans/plansApi.type";

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
import RecordBubbles from "@screens/home/components/RecordBubbles";
import MeetingCardsRail from "@components/meetings/MeetingCardsRail";
import MiniPlanCards from "@screens/home/components/MiniPlanCards";

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

/** Books kept in the home carousel — the rest live on the Books tab. */
const HOME_BOOKS_LIMIT = 12;

/** Mini plan tiles shown in the 2-column grid — the rest live on Plans. */
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
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0); // 0 = current month, 1 = next
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
    { page: 1, perPage: 20, keyword, childId: activeChildId ?? undefined },
    { skip: !activeChildId }
  );

  const books: BookListItemUI[] = useMemo(
    () => (Array.isArray(booksData?.data) ? booksData.data : []),
    [booksData]
  );
  const homeBooks = useMemo(() => books.slice(0, HOME_BOOKS_LIMIT), [books]);
  const showBooksLoader = isBooksLoading || isBooksFetching;

  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    isFetching: isTeachersFetching,
  } = useGetTeachersQuery(
    activeChildId ? { page: 1, perPage: 20 } : undefined,
    { skip: !activeChildId, refetchOnMountOrArgChange: true }
  );

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

  // ── Plans (mini cards, monthly pricing) ─────────────────────────
  const {
    data: plansData,
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useGetPlansForChildQuery(
    levelId ? { levelId: toValidId(levelId) } : undefined,
    { skip: !toValidId(levelId) }
  );

  const plans: PlanUI[] = useMemo(
    () =>
      Array.isArray(plansData)
        ? plansData.slice(0, HOME_MINI_PLANS_LIMIT)
        : [],
    [plansData]
  );

  // ── Meetings data (live classes + activities calendar) ──────────
  const TEACHER_PHOTOS = useMemo(() => [
    require("@assets/teachers/ismail.png"),
    require("@assets/teachers/tounes.png"),
    require("@assets/teachers/tarek.png"),
  ], []);

  const { data: meetingsData } = useGetMeetingsQuery(
    { page: 1, perPage: 10, childId: activeChildId ?? undefined },
    { skip: !activeChildId, refetchOnMountOrArgChange: true }
  );
  const { data: reservedData } = useGetReservedMeetingsQuery(activeChildId ?? undefined, {
    skip: !activeChildId,
    refetchOnMountOrArgChange: true,
  });

  const meetings: MeetingListItemUI[] = useMemo(() => {
    const items = meetingsData?.data?.items;
    return Array.isArray(items) ? items : [];
  }, [meetingsData]);

  const reservedMeetings: MeetingListItemUI[] = useMemo(() => {
    const items = reservedData?.data?.items;
    const arr = Array.isArray(items) ? items : [];
    if (arr.length > 0) {
      console.log("[HomeScreen] reservedMeetings count:", arr.length);
      arr.forEach((m, i) => {
        const groups = m.meetingGroups ?? [];
        groups.forEach((g, gi) => {
          const times = g.meetingTimes ?? [];
          console.log(`[HomeScreen] meeting[${i}] group[${gi}]:`, {
            materialName: m.materialName,
            teacherName: m.teacherName,
            scheduleDays: g.scheduleDays,
            meetingTimesCount: times.length,
            meetingTimes: times.map((t) => ({
              meetingDate: t.meetingDate,
              startTime: t.startTime,
            })),
          });
        });
      });
    }
    return arr;
  }, [reservedData]);

  // Set of group IDs the child has already reserved (for rail badges)
  const reservedGroupIds = useMemo(() => {
    const ids = new Set<number>();
    for (const m of reservedMeetings) {
      for (const g of m.meetingGroups ?? []) {
        ids.add(g.id);
      }
    }
    return ids;
  }, [reservedMeetings]);

  // Find the NEAREST upcoming meeting from reserved meetings
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
        // 1) Specific dated sessions — only future ones count
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

        // 2) Fallback: scheduleDays → find exact next datetime
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

  // Live detection for the nearest meeting
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

    // Try meetingTimes first (specific dates)
    for (const g of groups) {
      for (const mt of g.meetingTimes ?? []) {
        if (!mt.startsAt || !mt.endsAt) continue;
        const start = new Date(mt.startsAt.replace(" ", "T"));
        const end = new Date(mt.endsAt.replace(" ", "T"));
        if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;
        const isToday = start.toDateString() === now.toDateString();
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
        // Future session → show its time + date
        if (start.getTime() > now.getTime()) {
          const label = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
          return { isLive: false, startTimeLabel: label, nextSessionDate: isToday ? "Aujourd'hui" : fmtDate(start) };
        }
      }
    }

    // Fallback: scheduleDay match
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
      // Next session from scheduleDays
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

  // Build teacher avatar lookup: teacherId → { avatarUrl, localPhoto }
  const teacherAvatarLookup = useMemo(() => {
    const map = new Map<number, { avatarUrl: string | null; localPhoto: number }>();
    let localIdx = 0;
    // First, populate from real teachers API data (has avatarUrl)
    for (const t of teachers) {
      const local = TEACHER_PHOTOS[localIdx % TEACHER_PHOTOS.length];
      map.set(t.id, { avatarUrl: t.avatarUrl ?? null, localPhoto: local });
      localIdx++;
    }
    // Then add any meeting teachers not in the teachers list (from reserved meetings)
    // Also backfill avatarUrl from meeting data if teachers API didn't have it
    const all = [...meetings, ...reservedMeetings];
    for (const m of all) {
      const tid = m.teacherId ?? -1;
      if (tid < 0) continue;
      const existing = map.get(tid);
      if (existing) {
        // Backfill avatarUrl from meeting data if teachers API didn't provide one
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

  // Reserved days for ActivitiesCard calendar
  // Uses meetingTimes dates when available, falls back to scheduleDays (weekday → dates this month)
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
      seen.set(dayNum, {
        teacherPhoto: photo,
        accent: color || "#22BEC8",
      });
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

        // 1) Exact session dates from meetingTimes
        for (const mt of times) {
          const dateStr = mt.meetingDate;
          if (!dateStr) continue;
          const d = new Date(dateStr);
          if (d.getMonth() !== targetMonth || d.getFullYear() !== targetYear) continue;
          if (!isInCycle(d.getTime(), cycleStart, cycleEnd)) continue;
          addDay(d.getDate(), m.teacherId, m.materialColor);
          foundFromTimes = true;
        }

        // 2) Fallback: scheduleDays (weekday 0=Sun..6=Sat) → dates this month
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
    return -1; // no "today" highlight for non-current months
  }, [calendarMonthOffset]);

  const calendarTargetDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + calendarMonthOffset, 1);
  }, [calendarMonthOffset]);

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
    setCalendarMonthOffset(0);
    if (toValidId(levelId)) refetchMaterials();
    if (isChildReady) refetchBooks();
  }, [levelId, isChildReady, refetchMaterials, refetchBooks]);

  const goSubscribe = useCallback(
    () => navigation.navigate(PATHS.APP.PLAN_PRO_PRICING as never, { plans } as never),
    [navigation, plans]
  );
  const goPlanPricing = useCallback(
    (planId: number) => navigation.navigate(PATHS.APP.PLAN_PRO_PRICING as never, { plans, selectedPlanId: planId } as never),
    [navigation, plans]
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

          {/* Most-requested meeting cards — same rail as LearnCalendarScreen */}
          <MeetingCardsRail
            meetings={meetings}
            reservedGroupIds={reservedGroupIds}
            onPressCard={() =>
              navigation.navigate(PATHS.APP.DETAIL_PLAN_MEETING as never)
            }
          />

       

          {/* Plans — mini cards, monthly pricing */}
          <View style={styles.section}>
            <SectionHeader
              {...block}
              title={t(HOME_UI.plansTitle)}
              count={plans.length}
              seeAllLabel={seeAllLabel}
              onSeeAll={goSubscribe}
              icon="diamond"
              accent={HOME_SECTION_ACCENT.plans}
            />

            {isPlansLoading ? (
              <SectionState {...block} status="loading" />
            ) : isPlansError ? (
              <SectionState
                {...block}
                status="error"
                message={t(HOME_COMMON_UI.tapToRetry)}
                onRetry={refetchPlans}
              />
            ) : plans.length > 0 ? (
              <MiniPlanCards
                {...block}
                plans={plans}
                currencyLabel={t("plan.currency", { defaultValue: "د.ت" })}
                perMonthLabel={t("plan.per_month")}
                annualLabel={t("plan.period_yearly", { defaultValue: "Annuel" })}
                startingFromLabel={t("plan.starting_from", { defaultValue: "À partir de" })}
                popularLabel={t("plan.most_popular")}
                ctaLabel={t("plan.cta_label")}
                onPress={goSubscribe}
                onPlanPress={goPlanPricing}
              />
            ) : null}
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

            {/* Record bubbles — navigate to recording screens */}
          <RecordBubbles {...block} />
        </ScrollView>

        <DynamicIslandNotification
          visible={notifVisible}
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
          currency="DT"
          onClose={() => setWalletVisible(false)}
        />
      </View>
   );
}
