import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  PanResponder,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFocusEffect,
  useNavigation,
  type CompositeNavigationProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";

import { PATHS } from "@config/constants/paths";
import type {
  RootStackParamList,
  TabsParamList,
} from "@config/types/navigation.types";
import type { ReservedSession, TeacherItem } from "./ReservedMeetingsScreen.type";
import { useGetReservedMeetingsQuery, useGetReservedMeetingTimesQuery } from "@redux/apis/meetings/meetingApi";
import { useGetTeachersQuery } from "@redux/apis/teachers/teacherApi";
import { useEnsureChildSession } from "@hooks/useEnsureChildSession";
import type { MeetingListItemUI, ReservedMeetingTimeUI } from "@redux/apis/meetings/meetingApi.type";
import {
  DAY_LABELS,
  HOUR_HEIGHT,
  MONTHS,
  RESERVED_ALL_TEACHERS,
  RESERVED_EMPTY_LABEL,
  RESERVED_EMPTY_TITLE,
  RESERVED_LIVE_JOIN,
  RESERVED_LIVE_LABEL,
  RESERVED_PICK_DATE_TITLE,
  RESERVED_SCHEDULE_TITLE,
  RESERVED_TEACHERS_TITLE,
  TIMELINE_PADDING_HOURS,
  buildCalendarWeeks,
  currentNowHour,
  dayLabelOf,
  formatHour,
  weekIndexOf,
} from "./ReservedMeetingsScreen.constants";
import S, { C } from "./ReservedMeetingsScreen.styles";

const TEACHER_ACCENTS = ["#22BEC8", "#7C4DCC", "#F97316", "#EF4444", "#10B981"];

const TEACHER_PHOTOS = [
  require("@assets/teachers/ismail.png"),
  require("@assets/teachers/tounes.png"),
  require("@assets/teachers/tarek.png"),
];

function getTeacherPhoto(index: number): number {
  return TEACHER_PHOTOS[Math.abs(index) % TEACHER_PHOTOS.length];
}

function getSource(photo: number | string | null | undefined): number | { uri: string } {
  if (typeof photo === "string" && photo.startsWith("http")) return { uri: photo };
  if (typeof photo === "number" && photo > 0) return photo;
  return TEACHER_PHOTOS[0];
}

function meetingsToReservedSessions(
  meetings: MeetingListItemUI[],
  teacherAvatarMap?: Map<number, string | null>,
): ReservedSession[] {
  const sessions: ReservedSession[] = [];
  let fallbackIdx = 0;

  for (const m of meetings) {
    const avatarUrl = teacherAvatarMap?.get(m.teacherId ?? -1) ?? null;
    const photo = avatarUrl || getTeacherPhoto(fallbackIdx++);
    const groups = m.meetingGroups ?? [];
    if (groups.length === 0) {
      if (m.nextSessionAt) {
        const startDate = new Date(m.nextSessionAt.replace(" ", "T"));
        if (!isNaN(startDate.getTime())) {
          const endHour = startDate.getHours() + 1.5;
          sessions.push({
            id: m.id,
            teacherId: m.teacherId ?? 0,
            teacherName: m.teacherName || "Enseignant",
            subject: m.materialName || m.name,
            accent: m.materialColor || TEACHER_ACCENTS[sessions.length % TEACHER_ACCENTS.length],
            date: startDate.getDate(),
            month: startDate.getMonth(),
            year: startDate.getFullYear(),
            dayLabel: dayLabelOf(startDate.getDate(), startDate.getFullYear(), startDate.getMonth()),
            start: startDate.getHours() + startDate.getMinutes() / 60,
            end: endHour,
            group: "Groupe",
            room: "",
            status: "upcoming",
            progress: 0,
            photo,
            avatarUrl: avatarUrl || null,
          });
        }
      }
      continue;
    }
    for (const group of groups) {
      const times = group.meetingTimes ?? [];
      if (times.length === 0) {
        if (group.nextSessionAt) {
          const startDate = new Date(group.nextSessionAt.replace(" ", "T"));
          if (!isNaN(startDate.getTime())) {
            const endHour = startDate.getHours() + 1.5;
            sessions.push({
              id: group.id,
              teacherId: m.teacherId ?? 0,
              teacherName: m.teacherName || "Enseignant",
              subject: m.materialName || m.name,
              accent: m.materialColor || TEACHER_ACCENTS[sessions.length % TEACHER_ACCENTS.length],
              date: startDate.getDate(),
              month: startDate.getMonth(),
              year: startDate.getFullYear(),
              dayLabel: dayLabelOf(startDate.getDate(), startDate.getFullYear(), startDate.getMonth()),
              start: startDate.getHours() + startDate.getMinutes() / 60,
              end: endHour,
              group: group.name || "Groupe",
              room: "",
              status: "upcoming",
              progress: 0,
              photo,
              avatarUrl: avatarUrl || null,
            });
          }
        }
        continue;
      }
      for (const time of times) {
        if (!time.startsAt || !time.endsAt) continue;
        const startDate = new Date(time.startsAt.replace(" ", "T"));
        const endDate = new Date(time.endsAt.replace(" ", "T"));
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;
        const startHour = startDate.getHours() + startDate.getMinutes() / 60;
        const endHour = endDate.getHours() + endDate.getMinutes() / 60;
        sessions.push({
          id: time.id || sessions.length + 1,
          teacherId: m.teacherId ?? 0,
          teacherName: m.teacherName || "Enseignant",
          subject: m.materialName || m.name,
          accent: m.materialColor || TEACHER_ACCENTS[sessions.length % TEACHER_ACCENTS.length],
          date: startDate.getDate(),
          month: startDate.getMonth(),
          year: startDate.getFullYear(),
          dayLabel: dayLabelOf(startDate.getDate(), startDate.getFullYear(), startDate.getMonth()),
          start: startHour,
          end: endHour,
          group: group.name || "Groupe",
          room: "",
          status: time.status === "confirmed" ? "confirmed" : "upcoming",
          progress: 0,
          photo,
          avatarUrl: avatarUrl || null,
        });
      }
    }
  }
  return sessions;
}

function meetingsToTeachers(
  meetings: MeetingListItemUI[],
  teacherAvatarMap?: Map<number, string | null>,
): TeacherItem[] {
  const seen = new Map<number, TeacherItem>();
  let photoIndex = 0;
  for (const m of meetings) {
    if (!m.teacherId) continue;
    if (seen.has(m.teacherId)) continue;
    const avatarUrl = teacherAvatarMap?.get(m.teacherId) ?? null;
    seen.set(m.teacherId, {
      id: m.teacherId,
      name: m.teacherName,
      subject: m.materialName,
      accent: m.materialColor || "#22BEC8",
      sessionsCount: 1,
      rating: 4.8,
      photo: avatarUrl || getTeacherPhoto(photoIndex),
      avatarUrl: avatarUrl || null,
    });
    photoIndex++;
  }
  return Array.from(seen.values());
}

/** Hours shown when the selected day has nothing booked. */
const EMPTY_RANGE: [number, number] = [9, 15];

function parseTimeToDecimal(time: string | null): number | null {
  if (!time) return null;
  const match = String(time).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) + Number(match[2]) / 60;
}

function reservedMeetingTimesToSessions(
  times: ReservedMeetingTimeUI[],
): ReservedSession[] {
  const sessions: ReservedSession[] = [];

  for (const time of times) {
    if (!time.meetingDate) continue;

    const date = new Date(`${time.meetingDate}T00:00:00`);
    if (isNaN(date.getTime())) continue;

    const start = parseTimeToDecimal(time.startTime);
    const end = parseTimeToDecimal(time.endTime);
    if (start === null || end === null) continue;

    const accent = time.materialColor || "#22BEC8";
    const teacherName = time.teacherName || "Enseignant";
    const subject = time.materialName || time.meetingName || "Séance";

    sessions.push({
      id: time.id,
      teacherId: time.teacherId ?? 0,
      teacherName,
      subject,
      accent,
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      dayLabel: dayLabelOf(date.getDate(), date.getFullYear(), date.getMonth()),
      start,
      end,
      group: time.groupName || "Groupe",
      room: "",
      status: time.status === "confirmed" ? "confirmed" : "upcoming",
      progress: 0,
      photo: time.teacherAvatarUrl || null,
      avatarUrl: time.teacherAvatarUrl || null,
    });
  }

  return sessions;
}

export default function ReservedMeetingsScreen({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { activeChildId } = useEnsureChildSession();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        NativeStackNavigationProp<RootStackParamList>,
        BottomTabNavigationProp<TabsParamList>
      >
    >();

  const {
    data: reservedResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetReservedMeetingsQuery(activeChildId ?? undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: reservedTimesResponse,
    isLoading: reservedTimesLoading,
    refetch: refetchReservedTimes,
  } = useGetReservedMeetingTimesQuery(activeChildId ?? undefined, {
    refetchOnMountOrArgChange: true,
  });

  // When the screen regains focus (e.g. returning from a reservation flow),
  // refetch so newly reserved sessions appear in the agenda in real time.
  useFocusEffect(
    useCallback(() => {
      refetchReservedTimes();
      return () => undefined;
    }, [refetchReservedTimes]),
  );

  const allMeetings = useMemo(
    () => reservedResponse?.data?.items ?? [],
    [reservedResponse],
  );

  const { data: teachersData } = useGetTeachersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const teacherAvatarMap = useMemo(() => {
    const items = Array.isArray(teachersData?.data) ? teachersData.data : [];
    const map = new Map<number, string | null>();
    for (const t of items) {
      map.set(t.id, t.avatarUrl ?? null);
    }
    return map;
  }, [teachersData]);

  const allSessions = useMemo(
    () => meetingsToReservedSessions(allMeetings, teacherAvatarMap),
    [allMeetings, teacherAvatarMap],
  );

  const meetingTimeSessions = useMemo(
    () => reservedMeetingTimesToSessions(reservedTimesResponse?.data ?? []),
    [reservedTimesResponse],
  );

  // The dedicated meeting-times endpoint is authoritative for the agenda:
  // when it has data, prefer it; otherwise fall back to the nested times.
  const agendaSessions = useMemo(() => {
    if (meetingTimeSessions.length > 0) return meetingTimeSessions;
    return allSessions;
  }, [meetingTimeSessions, allSessions]);

  const allTeachers = useMemo(
    () => meetingsToTeachers(allMeetings, teacherAvatarMap),
    [allMeetings, teacherAvatarMap],
  );

  // Debug: log API response shape
  useEffect(() => {
    if (reservedResponse) {
      console.log("[ReservedMeetings] API response:", JSON.stringify({
        message: reservedResponse.message,
        itemCount: reservedResponse.data?.items?.length ?? 0,
        firstItem: reservedResponse.data?.items?.[0] ? {
          id: reservedResponse.data.items[0].id,
          name: reservedResponse.data.items[0].name,
          meetingGroupsCount: reservedResponse.data.items[0].meetingGroups?.length ?? 0,
          firstGroupTimes: reservedResponse.data.items[0].meetingGroups?.[0]?.meetingTimes?.length ?? 0,
        } : null,
        sessionCount: allSessions.length,
        teacherCount: allTeachers.length,
      }, null, 2));
    }
  }, [reservedResponse, allSessions, allTeachers]);

  const today = useMemo(() => new Date(), []);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const todayDate = today.getDate();

  // ── Agenda: all sessions grouped by date ─────────────────────────
  const agendaGroups = useMemo(() => {
    const sorted = [...agendaSessions].sort((a, b) => {
      const da = a.year * 10000 + a.month * 100 + a.date;
      const db = b.year * 10000 + b.month * 100 + b.date;
      if (da !== db) return da - db;
      return a.start - b.start;
    });
    const groups = new Map<string, { label: string; sessions: typeof sorted }>();
    for (const s of sorted) {
      const key = `${s.year}-${s.month}-${s.date}`;
      if (!groups.has(key)) {
        const isToday =
          s.year === today.getFullYear() &&
          s.month === today.getMonth() &&
          s.date === todayDate;
        const label = isToday
          ? `Aujourd'hui — ${dayLabelOf(s.date, s.year, s.month)} ${s.date} ${MONTHS[s.month]}`
          : `${dayLabelOf(s.date, s.year, s.month)} ${s.date} ${MONTHS[s.month]} ${s.year}`;
        groups.set(key, { label, sessions: [] });
      }
      groups.get(key)!.sessions.push(s);
    }
    return Array.from(groups.values());
  }, [agendaSessions, today, todayDate]);

  const [monthIndex, setMonthIndex] = useState(currentMonth);

  const displayYear = useMemo(() => {
    const d = new Date(currentYear, monthIndex, 1);
    return d.getFullYear();
  }, [monthIndex, currentYear]);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [monthOpen, setMonthOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  type ViewMode = "week" | "month" | "agenda";
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  const weeks = useMemo(
    () => buildCalendarWeeks(displayYear, monthIndex, allSessions),
    [displayYear, monthIndex, allSessions]
  );
  const [weekIndex, setWeekIndex] = useState(() =>
    weekIndexOf(todayDate, currentYear, currentMonth)
  );
  const week = weeks[Math.min(weekIndex, weeks.length - 1)] ?? [];

  const isCurrentMonth = monthIndex === currentMonth;

  /** Filter sessions for the selected day in the current month/year. */
  const daySessions = useMemo(
    () =>
      allSessions.filter(
        (s) =>
          s.date === selectedDate &&
          s.month === monthIndex &&
          s.year === displayYear
      ).sort((a, b) => a.start - b.start),
    [selectedDate, monthIndex, displayYear, allSessions]
  );

  /** Teachers actually teaching that day, shown in the horizontal strip. */
  const dayTeachers = useMemo(() => {
    const ids = new Set(daySessions.map((s) => s.teacherId));
    return allTeachers.filter((t) => ids.has(t.id));
  }, [daySessions, allTeachers]);

  const visibleSessions = useMemo(
    () =>
      selectedTeacher === null
        ? daySessions
        : daySessions.filter((s) => s.teacherId === selectedTeacher),
    [daySessions, selectedTeacher]
  );

  /** Timeline window: one hour of air above the first and below the last. */
  const [rangeStart, rangeEnd] = useMemo<[number, number]>(() => {
    if (daySessions.length === 0) return EMPTY_RANGE;
    const first = Math.floor(daySessions[0].start) - TIMELINE_PADDING_HOURS;
    const last =
      Math.ceil(Math.max(...daySessions.map((s) => s.end))) +
      TIMELINE_PADDING_HOURS;
    return [Math.max(0, first), Math.min(24, last)];
  }, [daySessions]);

  const hours = useMemo(
    () =>
      Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i),
    [rangeStart, rangeEnd]
  );

  /** Current hour (decimal), refreshed every 30s. */
  const [nowHour, setNowHour] = useState(currentNowHour);

  useEffect(() => {
    const id = setInterval(() => setNowHour(currentNowHour), 30_000);
    return () => clearInterval(id);
  }, []);

  /** Ids of sessions running right now — only meaningful on today. */
  const liveIds = useMemo(() => {
    return new Set(
      allSessions.filter(
        (s) =>
          s.date === todayDate &&
          nowHour >= s.start &&
          nowHour < s.end,
      ).map((s) => s.id),
    );
  }, [nowHour, allSessions, todayDate]);

  const showNow =
    selectedDate === todayDate &&
    nowHour > rangeStart &&
    nowHour < rangeEnd;

  const selectedTeacherName =
    allTeachers.find((t) => t.id === selectedTeacher)?.name ?? "";

  const goWeek = (delta: number) => {
    const next = weekIndex + delta;

    if (next < 0) {
      const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
      setMonthIndex(prevMonth);
      setSelectedDate(1);
      setWeekIndex(0);
      setSelectedTeacher(null);
      return;
    }

    if (next > weeks.length - 1) {
      const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
      setMonthIndex(nextMonth);
      setSelectedDate(1);
      setWeekIndex(0);
      setSelectedTeacher(null);
      return;
    }

    setWeekIndex(next);
    const firstDay = weeks[next].find(Boolean);
    if (firstDay) setSelectedDate(firstDay.date);
  };

  // ── Swipe gesture on week row ───────────────────────────────────
  const swipeThreshold = 50;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -swipeThreshold) goWeek(1);
        else if (g.dx > swipeThreshold) goWeek(-1);
      },
    })
  ).current;

  const pickMonth = (index: number) => {
    setMonthIndex(index);
    setMonthOpen(false);
    setSelectedTeacher(null);
    if (index === currentMonth) {
      setSelectedDate(todayDate);
      setWeekIndex(weekIndexOf(todayDate, currentYear, index));
    } else {
      setSelectedDate(1);
      setWeekIndex(0);
    }
  };

  const openSession = (_session: ReservedSession) => {
    navigation.navigate(PATHS.TABS.MEETING_VIEW);
  };

  const headerDateWeek = `${MONTHS[monthIndex]} ${displayYear}`;

  const headerDateMonth = `${dayLabelOf(selectedDate, displayYear, monthIndex)} ${selectedDate} ${MONTHS[monthIndex]} ${displayYear}`;

  const dayChipLabel = `${dayLabelOf(selectedDate, displayYear, monthIndex)} ${selectedDate}`;

  return (
    <View style={S.screen}>
      {!embedded && <StatusBar barStyle="dark-content" />}
      <View style={S.glowTop} pointerEvents="none" />
      <View style={S.glowSide} pointerEvents="none" />

      {/* ── Header ─────────────────────────────────────────────── */}
      {viewMode === "month" ? (
      <View style={[S.header, { paddingTop: embedded ? 10 : insets.top + 8 }]}>
        <View style={S.headerCenter}>
          <Text style={S.title}>Mes séances</Text>
          <Text style={S.subtitle}>{headerDateMonth}</Text>
        </View>

        <TouchableOpacity style={S.dayChip} activeOpacity={0.85}>
          <Ionicons name="calendar-outline" size={15} color={C.teal} />
          <Text style={S.dayChipText}>{dayChipLabel}</Text>
        </TouchableOpacity>
      </View>
      ) : (
      <View style={[S.header, { paddingTop: embedded ? 10 : insets.top + 8 }]}>
        <View style={S.headerCenter}>
          <Text style={S.title}>Mes séances</Text>
          <Text style={S.subtitle}>{headerDateWeek}</Text>
        </View>

        <TouchableOpacity
          style={S.monthBtn}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Changer de mois"
          onPress={() => setMonthOpen(true)}
        >
          <Ionicons name="calendar-outline" size={15} color={C.teal} />
          <Text style={S.monthBtnText}>{MONTHS[monthIndex]}</Text>
          <Ionicons name="chevron-down" size={14} color={C.sub} />
        </TouchableOpacity>
      </View>
      )}

      {/* ── View mode selector (Semaine / Mois / Agenda) ──────── */}
      <View style={S.viewModeRow}>
        {([
          { key: "week" as const, label: "Semaine", icon: "calendar-outline" as const },
          { key: "month" as const, label: "Mois", icon: "grid-outline" as const },
          { key: "agenda" as const, label: "Agenda", icon: "list-outline" as const },
        ]).map((item) => {
          const active = viewMode === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[S.viewModeBtn, active && S.viewModeBtnActive]}
              activeOpacity={0.85}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
              onPress={() => setViewMode(item.key)}
            >
              {active && (
                <LinearGradient
                  colors={["#16324F", "#0B1B2E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons name={item.icon} size={14} color={active ? "#5FE3EA" : C.sub} />
              <Text style={[S.viewModeText, active && S.viewModeTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      >
        {isLoading || (reservedTimesLoading && viewMode === "agenda") ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={C.teal} />
            <Text style={{ marginTop: 10, color: C.sub, fontSize: 13 }}>
              Chargement des séances...
            </Text>
          </View>
        ) : (
        <View style={S.content}>
        {/* ═══ WEEK VIEW ═══════════════════════════════════════════ */}
        {viewMode === "week" && (
          <>
          {/* ── Week strip ───────────────────────────────────────── */}
          <View style={S.calendarCard} {...panResponder.panHandlers}>
            <View style={S.pickerRow}>
              <TouchableOpacity
                style={S.arrowBtn}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Semaine précédente"
                onPress={() => goWeek(-1)}
              >
                <Ionicons name="chevron-back" size={15} color={C.ink} />
              </TouchableOpacity>

              <Text style={S.pickerTitle}>{RESERVED_PICK_DATE_TITLE}</Text>

              <TouchableOpacity
                style={S.arrowBtn}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Semaine suivante"
                onPress={() => goWeek(1)}
              >
                <Ionicons name="chevron-forward" size={15} color={C.ink} />
              </TouchableOpacity>
            </View>

            <View style={S.weekHeader}>
              {DAY_LABELS.map((label, i) => (
                <View key={`${label}-${i}`} style={S.weekHeaderCell}>
                  <Text style={S.weekHeaderText}>{label}</Text>
                </View>
              ))}
            </View>

            <View style={S.weekRow}>
              {week.map((day, i) => {
                if (!day) return <View key={`pad-${i}`} style={S.dayCell} />;
                const isSelected = day.date === selectedDate;
                const isLive = day.isToday && liveIds.size > 0;
                return (
                  <TouchableOpacity
                    key={day.date}
                    style={S.dayCell}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`${day.date} ${MONTHS[monthIndex]}`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setSelectedDate(day.date);
                      setSelectedTeacher(null);
                    }}
                  >
                    <View
                      style={[
                        S.dayNumberWrap,
                        day.isToday && S.dayNumberWrapToday,
                        isSelected && S.dayNumberWrapSelected,
                        isLive && S.dayNumberWrapLive,
                      ]}
                    >
                      <Text
                        style={[
                          S.dayNumber,
                          isSelected && S.dayNumberSelected,
                        ]}
                      >
                        {day.date}
                      </Text>
                    </View>
                    <View
                      style={[
                        S.dayDot,
                        isLive
                          ? { backgroundColor: C.live }
                          : !!day.accent && {
                              backgroundColor: isSelected ? C.teal : day.accent,
                            },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Today banner ─────────────────────────────────────── */}
          {bannerVisible && daySessions.length > 0 && (
            <View style={S.banner}>
              <View style={S.bannerIcon}>
                <Ionicons name="notifications" size={15} color={C.teal} />
              </View>
              <Text style={S.bannerText}>
                {`C'est parti ! ${daySessions.length} séance${
                  daySessions.length > 1 ? "s" : ""
                } ${
                  selectedDate === todayDate ? "aujourd'hui" : "ce jour"
                }`}
              </Text>
              <TouchableOpacity
                style={S.bannerClose}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Masquer le rappel"
                onPress={() => setBannerVisible(false)}
              >
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

         
          {/* ── Timeline ─────────────────────────────────────────── */}
          <View style={S.sectionHeader}>
            <View style={S.sectionTitleRow}>
              <View style={S.sectionIcon}>
                <Ionicons name="calendar-clear" size={15} color={C.teal} />
              </View>
              <Text style={S.sectionTitle}>{RESERVED_SCHEDULE_TITLE}</Text>
            </View>
            <View style={S.sectionHeaderRight}>
              <View style={S.sectionCount}>
                <Text style={S.sectionCountText}>{visibleSessions.length}</Text>
              </View>
              <TouchableOpacity
                style={S.sectionAddBtn}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Réserver une nouvelle séance"
                onPress={() => navigation.navigate(PATHS.TABS.MEETINGS)}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={S.timelineCard}>
            {visibleSessions.length === 0 ? (
              <View style={S.empty}>
                <View style={S.emptyIcon}>
                  <Ionicons name="cafe-outline" size={24} color={C.teal} />
                </View>
                <Text style={S.emptyTitle}>
                  {selectedTeacher !== null
                    ? `Aucune séance avec ${selectedTeacherName}`
                    : RESERVED_EMPTY_TITLE}
                </Text>
                <Text style={S.emptyLabel}>{RESERVED_EMPTY_LABEL}</Text>
              </View>
            ) : (
              <View
                style={[
                  S.timeline,
                  { height: (rangeEnd - rangeStart) * HOUR_HEIGHT + 20 },
                ]}
              >
                {hours.map((hour) => (
                  <View
                    key={hour}
                    style={[
                      S.hourRow,
                      { top: (hour - rangeStart) * HOUR_HEIGHT + 10 },
                    ]}
                  >
                    <Text style={S.hourLabel}>{formatHour(hour)}</Text>
                    <View style={S.hourLine} />
                  </View>
                ))}

                {showNow && (
                  <View
                    style={[
                      S.nowRow,
                      { top: (nowHour - rangeStart) * HOUR_HEIGHT + 10 },
                    ]}
                    pointerEvents="none"
                  >
                    <View style={S.nowDot} />
                    <View style={S.nowLine} />
                  </View>
                )}

                {visibleSessions.map((session) => {
                  const top = (session.start - rangeStart) * HOUR_HEIGHT + 10;
                  const height = Math.max(
                    64,
                    (session.end - session.start) * HOUR_HEIGHT - 10
                  );
                  // Short slots only get the title + hours, no meta chips.
                  const compact = height < 86;
                  const live = liveIds.has(session.id);
                  return (
                    <TouchableOpacity
                      key={session.id}
                      style={[S.blockWrap, { top, height }]}
                      activeOpacity={0.88}
                      accessibilityRole="button"
                      accessibilityLabel={`${session.subject} avec ${
                        session.teacherName
                      }, ${formatHour(session.start)} à ${formatHour(
                        session.end
                      )}${live ? ", en direct" : ""}`}
                      onPress={() => openSession(session)}
                    >
                      <LinearGradient
                        colors={[`${session.accent}3D`, `${session.accent}A6`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[S.block, { height }]}
                      >
                        <View style={S.blockInfo}>
                          {live && (
                            <View style={S.liveBadge}>
                              <View style={S.liveBadgeDot} />
                              <Text style={S.liveBadgeText}>
                                {RESERVED_LIVE_LABEL}
                              </Text>
                            </View>
                          )}
                          <Text style={S.blockTitle} numberOfLines={1}>
                            {session.subject}
                          </Text>
                          <Text style={S.blockTime}>
                            {`${formatHour(session.start)} – ${formatHour(
                              session.end
                            )}`}
                          </Text>

                          {!compact && !live && (
                            <View style={S.blockMetaRow}>
                              <View style={S.blockChip}>
                                <Ionicons
                                  name="people-outline"
                                  size={10}
                                  color="#0B2033"
                                />
                                <Text style={S.blockChipText}>
                                  {session.group}
                                </Text>
                              </View>
                              <View style={S.blockChip}>
                                <Ionicons
                                  name={
                                    session.status === "confirmed"
                                      ? "checkmark-circle"
                                      : "time-outline"
                                  }
                                  size={10}
                                  color="#0B2033"
                                />
                                <Text style={S.blockChipText}>
                                  {session.status === "confirmed"
                                    ? "Confirmée"
                                    : "À venir"}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>

                        {live ? (
                          <TouchableOpacity
                            style={S.liveJoinBtn}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel="Rejoindre la séance en direct"
                            onPress={() =>
                              navigation.navigate(PATHS.APP.JOIN_SESSION)
                            }
                          >
                            <Ionicons
                              name="videocam"
                              size={12}
                              color="#FFFFFF"
                            />
                            <Text style={S.liveJoinText}>
                              {RESERVED_LIVE_JOIN}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={S.progressPill}>
                            <Text style={S.progressPillText}>
                              {`${session.progress}%`}
                            </Text>
                          </View>
                        )}
                      </LinearGradient>

                      <Image
                        source={getSource(session.photo)}
                        style={S.blockAvatar}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

           {/* ── Teachers of the day ──────────────────────────────── */}
          {dayTeachers.length > 0 && (
            <>
              <View style={S.sectionHeader}>
                <View style={S.sectionTitleRow}>
                  <View style={S.sectionIcon}>
                    <Ionicons name="people" size={15} color={C.teal} />
                  </View>
                  <Text style={S.sectionTitle}>{RESERVED_TEACHERS_TITLE}</Text>
                </View>

                {selectedTeacher !== null ? (
                  <TouchableOpacity
                    style={S.sectionCount}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Afficher tous les enseignants"
                    onPress={() => setSelectedTeacher(null)}
                  >
                    <Text style={S.sectionCountText}>
                      {RESERVED_ALL_TEACHERS}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={S.sectionCount}>
                    <Text style={S.sectionCountText}>{dayTeachers.length}</Text>
                  </View>
                )}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={S.teacherStrip}
              >
                {dayTeachers.map((teacher) => {
                  const isActive = selectedTeacher === teacher.id;
                  return (
                    <TouchableOpacity
                      key={teacher.id}
                      style={[
                        S.teacherCard,
                        isActive && {
                          borderColor: teacher.accent,
                          shadowColor: teacher.accent,
                          shadowOpacity: 0.25,
                        },
                      ]}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                      accessibilityLabel={`${teacher.name}, ${teacher.subject}`}
                      onPress={() =>
                        setSelectedTeacher(isActive ? null : teacher.id)
                      }
                    >
                      <View
                        style={[
                          S.teacherPhotoWrap,
                          { borderColor: teacher.accent },
                        ]}
                      >
                        <Image
                          source={getSource(teacher.photo)}
                          style={S.teacherPhoto}
                          resizeMode="cover"
                        />
                        {isActive && (
                          <View
                            style={[
                              S.teacherCheck,
                              { backgroundColor: teacher.accent },
                            ]}
                          >
                            <Ionicons
                              name="checkmark"
                              size={11}
                              color="#FFFFFF"
                            />
                          </View>
                        )}
                      </View>

                      <Text style={S.teacherName} numberOfLines={1}>
                        {teacher.name}
                      </Text>

                      <View
                        style={[
                          S.subjectPill,
                          { backgroundColor: `${teacher.accent}1A` },
                        ]}
                      >
                        <View
                          style={[
                            S.subjectDot,
                            { backgroundColor: teacher.accent },
                          ]}
                        />
                        <Text
                          style={[
                            S.subjectPillText,
                            { color: teacher.accent },
                          ]}
                          numberOfLines={1}
                        >
                          {teacher.subject}
                        </Text>
                      </View>

                      <Text style={S.teacherMeta}>
                        {`${teacher.sessionsCount} séances · ★ ${teacher.rating}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}

          </>
        )}

        {/* ═══ MONTH VIEW ══════════════════════════════════════════ */}
        {viewMode === "month" && (
          <>
          <View style={S.calendarCard}>
            <View style={S.pickerRow}>
              <TouchableOpacity
                style={S.arrowBtn}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Mois précédent"
                onPress={() => { pickMonth(monthIndex === 0 ? 11 : monthIndex - 1); }}
              >
                <Ionicons name="chevron-back" size={15} color={C.ink} />
              </TouchableOpacity>
              <Text style={S.pickerTitle}>{`${MONTHS[monthIndex]} ${displayYear}`}</Text>
              <TouchableOpacity
                style={S.arrowBtn}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Mois suivant"
                onPress={() => { pickMonth(monthIndex === 11 ? 0 : monthIndex + 1); }}
              >
                <Ionicons name="chevron-forward" size={15} color={C.ink} />
              </TouchableOpacity>
            </View>

            <View style={S.weekHeader}>
              {DAY_LABELS.map((label, i) => (
                <View key={`${label}-${i}`} style={S.weekHeaderCell}>
                  <Text style={S.weekHeaderText}>{label}</Text>
                </View>
              ))}
            </View>

            {weeks.map((weekRow, wi) => (
              <View key={wi} style={S.weekRow}>
                {weekRow.map((day, i) => {
                  if (!day) return <View key={`pad-${wi}-${i}`} style={S.dayCell} />;
                  const isSelected = day.date === selectedDate;
                  const isLive = day.isToday && liveIds.size > 0;
                  return (
                    <TouchableOpacity
                      key={day.date}
                      style={S.dayCell}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`${day.date} ${MONTHS[monthIndex]}`}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => { setSelectedDate(day.date); setSelectedTeacher(null); }}
                    >
                      <View
                        style={[
                          S.dayNumberWrap,
                          day.isToday && S.dayNumberWrapToday,
                          isSelected && S.dayNumberWrapSelected,
                          isLive && S.dayNumberWrapLive,
                        ]}
                      >
                        <Text style={[S.dayNumber, isSelected && S.dayNumberSelected]}>
                          {day.date}
                        </Text>
                      </View>
                      <View
                        style={[
                          S.dayDot,
                          isLive
                            ? { backgroundColor: C.live }
                            : !!day.accent && {
                                backgroundColor: isSelected ? C.teal : day.accent,
                              },
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Today banner */}
          {bannerVisible && daySessions.length > 0 && (
            <View style={S.banner}>
              <View style={S.bannerIcon}>
                <Ionicons name="notifications" size={15} color={C.teal} />
              </View>
              <Text style={S.bannerText}>
                {`${daySessions.length} séance${daySessions.length > 1 ? "s" : ""} ${selectedDate === todayDate ? "aujourd'hui" : "ce jour"}`}
              </Text>
              <TouchableOpacity style={S.bannerClose} activeOpacity={0.8} onPress={() => setBannerVisible(false)}>
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Timeline for selected day */}
          <View style={S.sectionHeader}>
            <View style={S.sectionTitleRow}>
              <View style={S.sectionIcon}>
                <Ionicons name="calendar-clear" size={15} color={C.teal} />
              </View>
              <Text style={S.sectionTitle}>{RESERVED_SCHEDULE_TITLE}</Text>
            </View>
            <View style={S.sectionCount}>
              <Text style={S.sectionCountText}>{visibleSessions.length}</Text>
            </View>
          </View>

          <View style={S.timelineCard}>
            {visibleSessions.length === 0 ? (
              <View style={S.empty}>
                <View style={S.emptyIcon}>
                  <Ionicons name="cafe-outline" size={24} color={C.teal} />
                </View>
                <Text style={S.emptyTitle}>{RESERVED_EMPTY_TITLE}</Text>
                <Text style={S.emptyLabel}>{RESERVED_EMPTY_LABEL}</Text>
              </View>
            ) : (
              <View style={[S.timeline, { height: (rangeEnd - rangeStart) * HOUR_HEIGHT + 20 }]}>
                {hours.map((hour) => (
                  <View key={hour} style={[S.hourRow, { top: (hour - rangeStart) * HOUR_HEIGHT + 10 }]}>
                    <Text style={S.hourLabel}>{formatHour(hour)}</Text>
                    <View style={S.hourLine} />
                  </View>
                ))}
                {showNow && (
                  <View style={[S.nowRow, { top: (nowHour - rangeStart) * HOUR_HEIGHT + 10 }]} pointerEvents="none">
                    <View style={S.nowDot} />
                    <View style={S.nowLine} />
                  </View>
                )}
                {visibleSessions.map((session) => {
                  const top = (session.start - rangeStart) * HOUR_HEIGHT + 10;
                  const height = Math.max(64, (session.end - session.start) * HOUR_HEIGHT - 10);
                  const compact = height < 86;
                  const live = liveIds.has(session.id);
                  return (
                    <TouchableOpacity key={session.id} style={[S.blockWrap, { top, height }]} activeOpacity={0.88} onPress={() => openSession(session)}>
                      <LinearGradient colors={[`${session.accent}3D`, `${session.accent}A6`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[S.block, { height }]}>
                        <View style={S.blockInfo}>
                          {live && (
                            <View style={S.liveBadge}>
                              <View style={S.liveBadgeDot} />
                              <Text style={S.liveBadgeText}>{RESERVED_LIVE_LABEL}</Text>
                            </View>
                          )}
                          <Text style={S.blockTitle} numberOfLines={1}>{session.subject}</Text>
                          <Text style={S.blockTime}>{`${formatHour(session.start)} – ${formatHour(session.end)}`}</Text>
                          {!compact && !live && (
                            <View style={S.blockMetaRow}>
                              <View style={S.blockChip}>
                                <Ionicons name="people-outline" size={10} color="#0B2033" />
                                <Text style={S.blockChipText}>{session.group}</Text>
                              </View>
                              <View style={S.blockChip}>
                                <Ionicons name={session.status === "confirmed" ? "checkmark-circle" : "time-outline"} size={10} color="#0B2033" />
                                <Text style={S.blockChipText}>{session.status === "confirmed" ? "Confirmée" : "À venir"}</Text>
                              </View>
                            </View>
                          )}
                        </View>
                        {live ? (
                          <TouchableOpacity style={S.liveJoinBtn} activeOpacity={0.85} onPress={() => navigation.navigate(PATHS.APP.JOIN_SESSION)}>
                            <Ionicons name="videocam" size={12} color="#FFFFFF" />
                            <Text style={S.liveJoinText}>{RESERVED_LIVE_JOIN}</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={S.progressPill}>
                            <Text style={S.progressPillText}>{`${session.progress}%`}</Text>
                          </View>
                        )}
                      </LinearGradient>
                      <Image source={getSource(session.photo)} style={S.blockAvatar} resizeMode="cover" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
          </>
        )}

        {/* ═══ AGENDA VIEW ═════════════════════════════════════════ */}
        {viewMode === "agenda" && (
          <>
          <View style={S.calendarCard}>
            <Text style={S.pickerTitle}>{`Toutes les séances · ${allSessions.length}`}</Text>
          </View>

          {agendaGroups.length === 0 ? (
            <View style={S.empty}>
              <View style={S.emptyIcon}>
                <Ionicons name="calendar-outline" size={24} color={C.teal} />
              </View>
              <Text style={S.emptyTitle}>Aucune séance réservée</Text>
              <Text style={S.emptyLabel}>Réservez des séances pour les voir ici.</Text>
            </View>
          ) : (
            agendaGroups.map((group) => (
              <View key={group.label} style={S.agendaDateBlock}>
                <View style={S.agendaDateRow}>
                  <View style={S.agendaDateDot} />
                  <Text style={S.agendaDateText}>{group.label}</Text>
                  <View style={S.agendaCountBadge}>
                    <Text style={S.agendaCountText}>{group.sessions.length}</Text>
                  </View>
                </View>
                {group.sessions.map((session) => {
                  const live = liveIds.has(session.id);
                  return (
                    <TouchableOpacity key={session.id} style={S.agendaCard} activeOpacity={0.88} onPress={() => openSession(session)}>
                      <View style={[S.agendaAccentBar, { backgroundColor: session.accent }]} />
                      <View style={S.agendaCardBody}>
                        <View style={S.agendaCardTop}>
                          <Image source={getSource(session.photo)} style={S.agendaAvatar} resizeMode="cover" />
                          <View style={{ flex: 1 }}>
                            <Text style={S.agendaCardTitle} numberOfLines={1}>{session.subject}</Text>
                            <Text style={S.agendaCardTeacher} numberOfLines={1}>{session.teacherName}</Text>
                          </View>
                          {live && (
                            <View style={S.liveBadge}>
                              <View style={S.liveBadgeDot} />
                              <Text style={S.liveBadgeText}>{RESERVED_LIVE_LABEL}</Text>
                            </View>
                          )}
                        </View>
                        <View style={S.agendaCardMeta}>
                          <View style={S.agendaMetaChip}>
                            <Ionicons name="time-outline" size={11} color={C.teal} />
                            <Text style={S.agendaMetaText}>{`${formatHour(session.start)} – ${formatHour(session.end)}`}</Text>
                          </View>
                          <View style={S.agendaMetaChip}>
                            <Ionicons name="people-outline" size={11} color={C.teal} />
                            <Text style={S.agendaMetaText}>{session.group}</Text>
                          </View>
                          <View style={[S.agendaStatusChip, session.status === "confirmed" && { backgroundColor: "#D1FAE5" }]}>
                            <Text style={[S.agendaStatusText, session.status === "confirmed" && { color: "#065F46" }]}>
                              {session.status === "confirmed" ? "Confirmée" : "À venir"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
          </>
        )}

        </View>
        )}
      </ScrollView>

      {/* ── Month picker ───────────────────────────────────────── */}
      <Modal
        visible={monthOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthOpen(false)}
      >
        <Pressable style={S.sheetBackdrop} onPress={() => setMonthOpen(false)}>
          <Pressable
            style={[S.sheet, { paddingBottom: insets.bottom + 20 }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={S.sheetHandle} />
            <Text style={S.sheetTitle}>{`Mois · ${displayYear}`}</Text>
            <View style={S.monthGrid}>
              {MONTHS.map((label, index) => {
                const isActive = index === monthIndex;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[S.monthItem, isActive && S.monthItemActive]}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    onPress={() => pickMonth(index)}
                  >
                    <Text
                      style={[
                        S.monthItemText,
                        isActive && S.monthItemTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
