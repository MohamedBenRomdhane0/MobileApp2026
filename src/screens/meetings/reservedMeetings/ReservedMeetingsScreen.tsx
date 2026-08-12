import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
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
import type { ReservedSession } from "./ReservedMeetingsScreen.type";
import {
  DAY_LABELS,
  HOUR_HEIGHT,
  MONTHS,
  RESERVED_ALL_TEACHERS,
  RESERVED_EMPTY_LABEL,
  RESERVED_EMPTY_TITLE,
  RESERVED_LIVE_JOIN,
  RESERVED_LIVE_LABEL,
  RESERVED_MONTH_INDEX,
  RESERVED_PICK_DATE_TITLE,
  RESERVED_SCHEDULE_TITLE,
  RESERVED_SESSIONS,
  RESERVED_TEACHERS,
  RESERVED_TEACHERS_TITLE,
  RESERVED_TODAY,
  RESERVED_YEAR,
  TIMELINE_PADDING_HOURS,
  buildCalendarWeeks,
  currentNowHour,
  dayLabelOf,
  formatHour,
  weekIndexOf,
} from "./ReservedMeetingsScreen.constants";
import S, { C } from "./ReservedMeetingsScreen.styles";

/** Hours shown when the selected day has nothing booked. */
const EMPTY_RANGE: [number, number] = [9, 15];

export default function ReservedMeetingsScreen({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        NativeStackNavigationProp<RootStackParamList>,
        BottomTabNavigationProp<TabsParamList>
      >
    >();

  const [monthIndex, setMonthIndex] = useState(RESERVED_MONTH_INDEX);
  const [selectedDate, setSelectedDate] = useState(RESERVED_TODAY);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [monthOpen, setMonthOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  const weeks = useMemo(
    () => buildCalendarWeeks(RESERVED_YEAR, monthIndex),
    [monthIndex]
  );
  const [weekIndex, setWeekIndex] = useState(() =>
    weekIndexOf(RESERVED_TODAY, RESERVED_YEAR, RESERVED_MONTH_INDEX)
  );
  const week = weeks[Math.min(weekIndex, weeks.length - 1)] ?? [];

  const isReservedMonth = monthIndex === RESERVED_MONTH_INDEX;

  /** Every session of the selected day — drives the timeline range. */
  const daySessions = useMemo(
    () =>
      isReservedMonth
        ? RESERVED_SESSIONS.filter((s) => s.date === selectedDate).sort(
            (a, b) => a.start - b.start
          )
        : [],
    [isReservedMonth, selectedDate]
  );

  /** Teachers actually teaching that day, shown in the horizontal strip. */
  const dayTeachers = useMemo(() => {
    const ids = new Set(daySessions.map((s) => s.teacherId));
    return RESERVED_TEACHERS.filter((t) => ids.has(t.id));
  }, [daySessions]);

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

  /** Ids of sessions running right now — only meaningful on the mock "today". */
  const liveIds = useMemo(() => {
    if (!isReservedMonth) return new Set<number>();
    return new Set(
      RESERVED_SESSIONS.filter(
        (s) =>
          s.date === RESERVED_TODAY &&
          nowHour >= s.start &&
          nowHour < s.end,
      ).map((s) => s.id),
    );
  }, [nowHour, isReservedMonth]);

  const showNow =
    isReservedMonth &&
    selectedDate === RESERVED_TODAY &&
    nowHour > rangeStart &&
    nowHour < rangeEnd;

  const selectedTeacherName =
    RESERVED_TEACHERS.find((t) => t.id === selectedTeacher)?.name ?? "";

  const goWeek = (delta: number) => {
    const next = weekIndex + delta;
    if (next < 0 || next > weeks.length - 1) return;
    setWeekIndex(next);
    const firstDay = weeks[next].find(Boolean);
    if (firstDay) setSelectedDate(firstDay.date);
  };

  const pickMonth = (index: number) => {
    setMonthIndex(index);
    setMonthOpen(false);
    setSelectedTeacher(null);
    if (index === RESERVED_MONTH_INDEX) {
      setSelectedDate(RESERVED_TODAY);
      setWeekIndex(weekIndexOf(RESERVED_TODAY, RESERVED_YEAR, index));
    } else {
      setSelectedDate(1);
      setWeekIndex(0);
    }
  };

  const openSession = (_session: ReservedSession) => {
    navigation.navigate(PATHS.TABS.MEETING_VIEW);
  };

  const headerDate = isReservedMonth
    ? `${dayLabelOf(selectedDate)} ${selectedDate} ${MONTHS[monthIndex]} ${RESERVED_YEAR}`
    : `${MONTHS[monthIndex]} ${RESERVED_YEAR}`;

  return (
    <View style={S.screen}>
      {!embedded && <StatusBar barStyle="dark-content" />}
      <View style={S.glowTop} pointerEvents="none" />
      <View style={S.glowSide} pointerEvents="none" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <View style={[S.header, { paddingTop: embedded ? 10 : insets.top + 8 }]}>
        {!embedded && navigation.canGoBack() ? (
          <TouchableOpacity
            style={S.roundBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color={C.ink} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}

        <View style={S.headerCenter}>
          <Text style={S.title}>Mes séances</Text>
          <Text style={S.subtitle}>{headerDate}</Text>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      >
        <View style={S.content}>
          {/* ── Week strip ───────────────────────────────────────── */}
          <View style={S.calendarCard}>
            <View style={S.pickerRow}>
              <TouchableOpacity
                style={[S.arrowBtn, weekIndex === 0 && S.arrowBtnDisabled]}
                activeOpacity={0.8}
                disabled={weekIndex === 0}
                accessibilityRole="button"
                accessibilityLabel="Semaine précédente"
                onPress={() => goWeek(-1)}
              >
                <Ionicons name="chevron-back" size={15} color={C.ink} />
              </TouchableOpacity>

              <Text style={S.pickerTitle}>{RESERVED_PICK_DATE_TITLE}</Text>

              <TouchableOpacity
                style={[
                  S.arrowBtn,
                  weekIndex === weeks.length - 1 && S.arrowBtnDisabled,
                ]}
                activeOpacity={0.8}
                disabled={weekIndex === weeks.length - 1}
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
                  selectedDate === RESERVED_TODAY ? "aujourd'hui" : "ce jour"
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
                        source={session.photo}
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
                          source={teacher.photo}
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

        </View>
      </ScrollView>

      {/* ── Add a session ──────────────────────────────────────── */}
      <TouchableOpacity
        style={[S.fab, { bottom: insets.bottom + 96 }]}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Réserver une nouvelle séance"
        onPress={() => navigation.navigate(PATHS.TABS.MEETINGS)}
      >
        <LinearGradient
          colors={["#4FD8DF", C.teal]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={S.fabInner}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

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
            <Text style={S.sheetTitle}>{`Mois · ${RESERVED_YEAR}`}</Text>
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
