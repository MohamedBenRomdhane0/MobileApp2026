import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity,
  ScrollView, StatusBar, Image, StyleSheet, Modal, Animated, Easing,
  Dimensions, ActivityIndicator,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { PATHS } from "@config/constants/paths";
import { LEVEL_LABEL_BY_ID } from "@config/enums/Level.enum";
import ReservedMeetingsScreen from "@screens/meetings/reservedMeetings/ReservedMeetingsScreen";
import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LanguageSwitcher from "@components/header/LanguageSwitcher";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useAppTheme } from "@theme/ThemeProvider";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";

// Teacher photo shown at the top-right of the "Map the Path" card.
const TEACHER_PHOTO = require("../../../assets/teachers/ismail.png");

// Clear cover image for the group-session card (Pexels — a study/classroom
// scene). Replaces the blurry teacher headshot as the card banner.
const SESSION_COVER = require("../../../assets/teachers/testtt.jpeg");
const COVER_MATHS = require("../../../assets/teachers/ma1.jpeg");
const COVER_FR = require("../../../assets/teachers/fr1.jpeg");
const COVER_SCIENCES = require("../../../assets/teachers/ar1.jpeg");

// Children already reserved in this session (shown as overlapping avatars).
const RESERVED_CHILDREN = [
  require("../../../assets/kids/boys/boy1.png"),
  require("../../../assets/kids/girls/girl1.jpg"),
  require("../../../assets/kids/boys/boy2.jpg"),
  require("../../../assets/kids/girls/girl2.png"),
];

// Overlapping student avatars in the "Explanation" row (with a "+13" counter).
const EXPLAIN_AVATARS = [
  require("../../../assets/teachers/ismail.png"),
  require("../../../assets/teachers/tounes.png"),
  require("../../../assets/teachers/tarek.png"),
];



type SubjectSession = {
  id: number;
  name: string;
  accent: string;
  time: string;
  sessionsCount: number;
  rating: number;
  ratingCount: number;
  placesLeft: number;
  placesTotal: number;
  reservedExtra: number;
  groupsCount: number;
  daysPerWeek: number;
  days: { label: string; active: boolean }[];
  price: number;
  cover: any;
};

const SUBJECT_SESSIONS: SubjectSession[] = [
  {
    id: 1, name: "Anglais", accent: "#22BEC8",
    time: "18:30 – 20:00", sessionsCount: 8,
    rating: 4.8, ratingCount: 126,
    placesLeft: 5, placesTotal: 20, reservedExtra: 12,
    groupsCount: 4, daysPerWeek: 2,
    cover: SESSION_COVER,
    days: [
      { label: "L", active: true }, { label: "M", active: false },
      { label: "M", active: true }, { label: "J", active: false },
      { label: "V", active: false }, { label: "D", active: true },
    ],
    price: 80,
  },
  {
    id: 2, name: "Mathématiques", accent: "#7C4DCC",
    time: "14:00 – 15:30", sessionsCount: 4,
    rating: 4.9, ratingCount: 89,
    placesLeft: 3, placesTotal: 20, reservedExtra: 8,
    groupsCount: 3, daysPerWeek: 4,
    cover: COVER_MATHS,
    days: [
      { label: "L", active: true }, { label: "M", active: false },
      { label: "M", active: true }, { label: "J", active: true },
      { label: "V", active: true }, { label: "D", active: false },
    ],
    price: 55,
  },
  {
    id: 3, name: "Français", accent: "#F97316",
    time: "10:00 – 11:30", sessionsCount: 4,
    rating: 4.7, ratingCount: 94,
    placesLeft: 7, placesTotal: 20, reservedExtra: 10,
    groupsCount: 2, daysPerWeek: 4,
    cover: COVER_FR,
    days: [
      { label: "L", active: true }, { label: "M", active: true },
      { label: "M", active: false }, { label: "J", active: true },
      { label: "V", active: true }, { label: "D", active: false },
    ],
    price: 40,
  },
  {
    id: 4, name: "Sciences", accent: "#10B981",
    time: "16:00 – 17:30", sessionsCount: 6,
    rating: 4.6, ratingCount: 73,
    placesLeft: 2, placesTotal: 20, reservedExtra: 15,
    groupsCount: 2, daysPerWeek: 6,
    cover: COVER_SCIENCES,
    days: [
      { label: "L", active: true }, { label: "M", active: true },
      { label: "M", active: true }, { label: "J", active: true },
      { label: "V", active: true }, { label: "D", active: false },
    ],
    price: 50,
  },
];

type RecordedSession = {
  id: number;
  teacherId: number;
  subject: string;
  teacherName: string;
  accent: string;
  date: string;
  time: string;
  duration: string;
  /** Watch progress 0–100; 0 = never opened. */
  progress: number;
  photo: any;
  /** Video thumbnail cover. */
  cover: any;
  /** Recording stream URL played on tap. */
  videoUrl: string;
};

/** Demo recording stream used by every recorded session until real URLs arrive. */
const RECORDING_DEMO_URL =
  "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/53d03906-bb84-4540-b8de-027c79e7afd2/room-zqwjt6imoa-1759836495_2026-06-17-19-15-14.mp4";

/** Teachers who have recordings — one paged carousel per teacher. */
type RecordedTeacher = {
  id: number;
  name: string;
  subject: string;
  accent: string;
  photo: any;
};

const RECORDED_TEACHERS: RecordedTeacher[] = [
  {
    id: 1,
    name: "Mrs. Ismail",
    subject: "Anglais",
    accent: "#22BEC8",
    photo: require("../../../assets/teachers/ismail.png"),
  },
  {
    id: 2,
    name: "Mr. Tounes",
    subject: "Mathématiques",
    accent: "#7C4DCC",
    photo: require("../../../assets/teachers/tounes.png"),
  },
  {
    id: 3,
    name: "Mr. Tarek",
    subject: "Français",
    accent: "#F97316",
    photo: require("../../../assets/teachers/tarek.png"),
  },
];

const RECORDED_SESSIONS: RecordedSession[] = [
  {
    id: 1,
    teacherId: 1,
    subject: "Anglais",
    teacherName: "Mrs. Ismail",
    accent: "#22BEC8",
    date: "Ven 19 Juin",
    time: "18:30 – 20:00",
    duration: "1h 30",
    progress: 100,
    photo: require("../../../assets/teachers/ismail.png"),
    cover: SESSION_COVER,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 2,
    teacherId: 2,
    subject: "Mathématiques",
    teacherName: "Mr. Tounes",
    accent: "#7C4DCC",
    date: "Jeu 18 Juin",
    time: "14:00 – 15:30",
    duration: "1h 30",
    progress: 62,
    photo: require("../../../assets/teachers/tounes.png"),
    cover: COVER_MATHS,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 3,
    teacherId: 3,
    subject: "Français",
    teacherName: "Mr. Tarek",
    accent: "#F97316",
    date: "Mar 16 Juin",
    time: "10:00 – 11:30",
    duration: "1h 30",
    progress: 34,
    photo: require("../../../assets/teachers/tarek.png"),
    cover: COVER_FR,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 4,
    teacherId: 1,
    subject: "Anglais",
    teacherName: "Mrs. Ismail",
    accent: "#22BEC8",
    date: "Mer 17 Juin",
    time: "18:30 – 20:00",
    duration: "1h 30",
    progress: 85,
    photo: require("../../../assets/teachers/ismail.png"),
    cover: SESSION_COVER,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 5,
    teacherId: 1,
    subject: "Anglais",
    teacherName: "Mrs. Ismail",
    accent: "#22BEC8",
    date: "Lun 15 Juin",
    time: "18:30 – 20:00",
    duration: "1h 30",
    progress: 0,
    photo: require("../../../assets/teachers/ismail.png"),
    cover: SESSION_COVER,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 6,
    teacherId: 1,
    subject: "Anglais",
    teacherName: "Mrs. Ismail",
    accent: "#22BEC8",
    date: "Sam 13 Juin",
    time: "18:30 – 20:00",
    duration: "1h 30",
    progress: 45,
    photo: require("../../../assets/teachers/ismail.png"),
    cover: SESSION_COVER,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 7,
    teacherId: 2,
    subject: "Mathématiques",
    teacherName: "Mr. Tounes",
    accent: "#7C4DCC",
    date: "Mar 16 Juin",
    time: "14:00 – 15:30",
    duration: "1h 30",
    progress: 50,
    photo: require("../../../assets/teachers/tounes.png"),
    cover: COVER_MATHS,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 8,
    teacherId: 2,
    subject: "Mathématiques",
    teacherName: "Mr. Tounes",
    accent: "#7C4DCC",
    date: "Dim 14 Juin",
    time: "14:00 – 15:30",
    duration: "1h 30",
    progress: 0,
    photo: require("../../../assets/teachers/tounes.png"),
    cover: COVER_MATHS,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 9,
    teacherId: 2,
    subject: "Mathématiques",
    teacherName: "Mr. Tounes",
    accent: "#7C4DCC",
    date: "Ven 12 Juin",
    time: "14:00 – 15:30",
    duration: "1h 30",
    progress: 28,
    photo: require("../../../assets/teachers/tounes.png"),
    cover: COVER_MATHS,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 10,
    teacherId: 3,
    subject: "Français",
    teacherName: "Mr. Tarek",
    accent: "#F97316",
    date: "Dim 14 Juin",
    time: "10:00 – 11:30",
    duration: "1h 30",
    progress: 0,
    photo: require("../../../assets/teachers/tarek.png"),
    cover: COVER_FR,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 11,
    teacherId: 3,
    subject: "Français",
    teacherName: "Mr. Tarek",
    accent: "#F97316",
    date: "Jeu 11 Juin",
    time: "10:00 – 11:30",
    duration: "1h 30",
    progress: 72,
    photo: require("../../../assets/teachers/tarek.png"),
    cover: COVER_FR,
    videoUrl: RECORDING_DEMO_URL,
  },
  {
    id: 12,
    teacherId: 3,
    subject: "Français",
    teacherName: "Mr. Tarek",
    accent: "#F97316",
    date: "Mar 9 Juin",
    time: "10:00 – 11:30",
    duration: "1h 30",
    progress: 0,
    photo: require("../../../assets/teachers/tarek.png"),
    cover: COVER_FR,
    videoUrl: RECORDING_DEMO_URL,
  },
];

const RECORDED_FEATURED = {
  subject: "Anglais",
  accent: "#22BEC8",
  title: "Lecture 4 · Reading comprehension",
  teacherName: "Mrs. Ismail",
  teacherPhoto: require("../../../assets/teachers/ismail.png"),
  date: "Ven 19 Juin",
  time: "18:30 – 20:00",
  duration: "1h 30",
  progress: 73,
  cover: SESSION_COVER,
  videoUrl: RECORDING_DEMO_URL,
};

/** Width of one recorded video card in the paged carousel. */
const RECORDED_CARD_W = 264;
/** Per-card snap stride = card width + gap. */
const RECORDED_SNAP = RECORDED_CARD_W + 14;

const { width: W } = Dimensions.get("window");

/** Screen gutter used by every block. */
const GUTTER = 20;

type ViewKey = "reservation" | "calendar" | "recorded";

/** The three top-level views, rendered as an animated pill switch. */
const VIEW_TABS: {
  key: ViewKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "reservation",
    label: "Réserver",
    icon: "sparkles-outline",
    iconActive: "sparkles",
  },
  {
    key: "calendar",
    label: "Agenda",
    icon: "calendar-outline",
    iconActive: "calendar",
  },
  {
    key: "recorded",
    label: "Replays",
    icon: "play-circle-outline",
    iconActive: "play-circle",
  },
];

/**
 * Geometry of the switch: inactive tabs collapse to an icon, the active one
 * springs open wide enough for its label. Widths always sum to the bar.
 */
const TAB_PAD = 5;
const TAB_BAR_W = W - GUTTER * 2;
const TAB_COLLAPSED_W = 56;
const TAB_ACTIVE_W =
  TAB_BAR_W - TAB_PAD * 2 - TAB_COLLAPSED_W * (VIEW_TABS.length - 1);

/**
 * One tab of the view switch. Owns its own spring so expanding and
 * collapsing run in parallel instead of waiting on a shared timeline.
 */
function ViewSwitchTab({
  tab,
  active,
  onPress,
}: {
  tab: (typeof VIEW_TABS)[number];
  active: boolean;
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: active ? 1 : 0,
      friction: 9,
      tension: 90,
      // width/flex can't run on the native thread
      useNativeDriver: false,
    }).start();
  }, [active, anim]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [TAB_COLLAPSED_W, TAB_ACTIVE_W],
  });
  const labelOpacity = anim.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0, 0, 1],
  });
  const labelShift = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });
  // Little pop as the icon takes the active state.
  const iconScale = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.22, 1.05],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      onPress={onPress}
    >
      <Animated.View style={[styles.switchTab, { width }]}>
        {active && (
          <LinearGradient
            colors={["#16324F", "#0B1B2E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Ionicons
            name={active ? tab.iconActive : tab.icon}
            size={18}
            color={active ? "#5FE3EA" : "#8A94A6"}
          />
        </Animated.View>

        <Animated.Text
          numberOfLines={1}
          style={[
            styles.switchLabel,
            { opacity: labelOpacity, transform: [{ translateX: labelShift }] },
          ]}
        >
          {tab.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

/** Day cell width + gap in the horizontal month strip. */
const DAY_STRIDE = 52;

/** Compact card width in the "populaires" rail. */
const RAIL_CARD_W = 232;

export default function LearnCalendarScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL  = (i18n.language ?? "ar") === "ar";

  const headerData = useActiveChildHeaderData();
  const levelId    = useMemo(() => pickLevelIdFromChild(headerData?.child), [headerData?.child]);
  const levelLabel = useMemo(() => (levelId ? LEVEL_LABEL_BY_ID[levelId] : ""), [levelId]);

  const row = isRTL ? "row-reverse" : "row";

  // ── Calendar state ──────────────────────────────────────────────
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = useMemo(() => {
    const days: { day: number; label: string }[] = [];
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const label = date.toLocaleDateString(i18n.language || "en", { weekday: "short" });
      days.push({ day: i, label });
    }
    return days;
  }, [currentMonth, currentYear, i18n.language]);

  const monthLabel = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    return date.toLocaleDateString(i18n.language || "en", { month: "long" });
  }, [currentMonth, currentYear, i18n.language]);

  const yearLabel = useMemo(() => String(currentYear), [currentYear]);

  const isToday = useCallback(
    (day: number) =>
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear(),
    [currentMonth, currentYear]
  );

  const goPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((p) => p - 1);
    } else {
      setCurrentMonth((p) => p - 1);
    }
  }, [currentMonth]);

  const goNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((p) => p + 1);
    } else {
      setCurrentMonth((p) => p + 1);
    }
  }, [currentMonth]);

  // ── Filter state ──────────────────────────────────────────────────
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSubjects, setFilterSubjects] = useState<number[]>([]);
  const [filterMaxPrice, setFilterMaxPrice] = useState(100);

  const toggleSubject = (id: number) => {
    setFilterSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredSessions = useMemo(() => {
    let list = SUBJECT_SESSIONS;
    if (filterSubjects.length > 0) {
      list = list.filter((s) => filterSubjects.includes(s.id));
    }
    list = list.filter((s) => s.price <= filterMaxPrice);
    return list;
  }, [filterSubjects, filterMaxPrice]);

  const resetFilters = () => {
    setFilterSubjects([]);
    setFilterMaxPrice(100);
  };

  /** Badge on the filter button: subject picks + a non-default price cap. */
  const activeFilterCount =
    filterSubjects.length + (filterMaxPrice < 100 ? 1 : 0);

  // ── View toggle (Réservation ↔ Calendrier ↔ Séances enregistrées) ─
  const [view, setView] = useState<ViewKey>("reservation");

  // ── Day strip auto-centering ──────────────────────────────────────
  const stripRef = useRef<ScrollView>(null);

  const centerDay = useCallback((day: number) => {
    stripRef.current?.scrollTo({
      x: Math.max(0, (day - 1) * DAY_STRIDE - W / 2 + DAY_STRIDE / 2),
      animated: true,
    });
  }, []);

  useEffect(() => {
    const id = setTimeout(() => centerDay(selectedDay), 60);
    return () => clearTimeout(id);
  }, [selectedDay, currentMonth, centerDay]);

  const selectDay = useCallback(
    (day: number) => {
      setSelectedDay(day);
      centerDay(day);
    },
    [centerDay],
  );

  const goToday = useCallback(() => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  }, [today]);

  // ── Recorded carousel pagination (one page index per teacher) ──
  const [recordedPages, setRecordedPages] = useState<Record<number, number>>({});

  const onRecordedScrollEnd = (teacherId: number) => (e: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    setRecordedPages((prev) => ({
      ...prev,
      [teacherId]: Math.round(e.nativeEvent.contentOffset.x / RECORDED_SNAP),
    }));
  };

  // ── Featured video play-button pulse ─────────────────────────────
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // ── Recording player modal ───────────────────────────────────────
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const playerRef = useRef<Video>(null);

  const openPlayer = useCallback((url: string) => {
    if (!url) return;
    setPlayerUrl(url);
    setPlayerLoading(true);
    setPlayerError(false);
    setPlayerVisible(true);
  }, []);

  const closePlayer = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.stopAsync().catch(() => {});
    }
    setPlayerVisible(false);
    setPlayerUrl(null);
    setPlayerLoading(false);
    setPlayerError(false);
  }, []);

  const retryPlayer = useCallback(() => {
    setPlayerError(false);
    setPlayerLoading(true);
    setPlayerKey((k) => k + 1);
  }, []);

  const headerGradientColors: [string, string, string] = useMemo(
    () => isDark
      ? ["#0B1220", colors.header, "#060B14"]
      : ["#153A6B", colors.header, "#091D36"],
    [isDark, colors.header]
  );

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
     {/* Header */}
        <View style={styles.headerShell}>
          <LinearGradient
            colors={headerGradientColors}
            start={{ x: 0.08, y: 0.05 }}
            end={{ x: 0.95, y: 1 }}
            style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 14) }]}
          >
            <View style={[styles.headerGlowA, isRTL ? { left: -80 } : { right: -80 }]} />
            <View style={[styles.headerGlowB, isRTL ? { right: -100 } : { left: -100 }]} />

            <View style={[styles.header, { flexDirection: row }]}>
              <View style={[styles.headerLeft, { flexDirection: row }]}>
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
              <View style={[styles.headerRight, { flexDirection: row }]}>
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
      {/* Réserver ↔ Agenda ↔ Replays — expanding pill switch */}
      <View style={styles.segWrap}>
        <View style={styles.segControl} accessibilityRole="tablist">
          {VIEW_TABS.map((tab) => (
            <ViewSwitchTab
              key={tab.key}
              tab={tab}
              active={view === tab.key}
              onPress={() => setView(tab.key)}
            />
          ))}
        </View>
      </View>

      {view === "calendar" ? (
        <ReservedMeetingsScreen embedded />
      ) : (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {view === "reservation" ? (
          <>

        {/* Planner card — month navigation + scrollable day strip */}
        <View style={styles.plannerCard}>
          <View style={styles.monthRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.monthTitle} numberOfLines={1}>
                {monthLabel}
              </Text>
              <Text style={styles.monthYear}>{yearLabel}</Text>
            </View>

            <View style={styles.monthNav}>
              <TouchableOpacity
                style={styles.todayChip}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={t("learning.today", {
                  defaultValue: "Aujourd'hui",
                })}
                onPress={goToday}
              >
                <Ionicons name="locate-outline" size={13} color="#0E7C86" />
                <Text style={styles.todayChipText}>
                  {t("learning.today", { defaultValue: "Aujourd'hui" })}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navArrow}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Mois précédent"
                onPress={goPrevMonth}
              >
                <Ionicons name="chevron-back" size={16} color="#12A9B4" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navArrow}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Mois suivant"
                onPress={goNextMonth}
              >
                <Ionicons name="chevron-forward" size={16} color="#12A9B4" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            ref={stripRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarStrip}
            snapToInterval={DAY_STRIDE}
            decelerationRate="fast"
          >
            {daysInMonth.map((day) => {
              const isSelected = day.day === selectedDay;
              const todayFlag = isToday(day.day);
              const label = day.label.replace(".", "").toUpperCase();

              if (isSelected) {
                return (
                  <TouchableOpacity
                    key={day.day}
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityState={{ selected: true }}
                    accessibilityLabel={`${day.day} ${monthLabel}`}
                    onPress={() => selectDay(day.day)}
                  >
                    <LinearGradient
                      colors={["#3BD6DF", "#12A9B4"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.dayCell, styles.dayCellSelected]}
                    >
                      <Text
                        style={[styles.dayCellLabel, styles.dayCellLabelOn]}
                      >
                        {label}
                      </Text>
                      <Text style={[styles.dayCellNum, styles.dayCellNumOn]}>
                        {day.day}
                      </Text>
                      <View style={[styles.dayCellDot, styles.dayCellDotOn]} />
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={day.day}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: false }}
                  accessibilityLabel={`${day.day} ${monthLabel}`}
                  onPress={() => selectDay(day.day)}
                >
                  <View
                    style={[styles.dayCell, todayFlag && styles.dayCellToday]}
                  >
                    <Text style={styles.dayCellLabel}>{label}</Text>
                    <Text
                      style={[
                        styles.dayCellNum,
                        todayFlag && styles.dayCellNumToday,
                      ]}
                    >
                      {day.day}
                    </Text>
                    <View
                      style={[
                        styles.dayCellDot,
                        todayFlag && styles.dayCellDotToday,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Map the Path card */}
        {/* <View style={styles.mapCard}>
          <View style={styles.mapTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapTitle}>Map the Path</Text>
              <View style={styles.briefRow}>
                <Ionicons name="document-text-outline" size={12} color="#6B7280" />
                <Text style={styles.briefText}>Brief 001</Text>
              </View>
            </View>
            <View style={styles.mapAvatarShell}>
              <Image source={TEACHER_PHOTO} style={styles.mapAvatarImg} />
            </View>
          </View>

          <View style={styles.timelineRow}>
            <Text style={styles.timelineLabel}>Timeline:</Text>
            <View style={styles.timelineBar}><View style={styles.timelineFill} /></View>
            <Text style={styles.timelineTime}>15:32/56:26</Text>
          </View>

          <View style={styles.mapBottom}>
            <Text style={styles.explainText}>Explanation:</Text>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map((s) => <Ionicons key={s} name="star" size={12} color="#FBBF24" />)}
            </View>
          </View>

          <View style={styles.avatarsRow}>
            <View style={styles.avatarStack}>
              {EXPLAIN_AVATARS.map((src, i) => (
                <Image
                  key={i}
                  source={src}
                  style={[styles.stackAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: EXPLAIN_AVATARS.length - i }]}
                />
              ))}
              <View style={[styles.stackAvatar, styles.stackMore, { marginLeft: -10 }]}>
                <Text style={styles.stackMoreText}>+13</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.copyBtn}>
              <Ionicons name="link-outline" size={14} color="#7C4DCC" />
              <Text style={styles.copyText}>Copy link</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Matières — chip filter + sheet trigger */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>{t("learning.all_subjects")}</Text>
            <Text style={styles.sectionCaption}>
              {`${filteredSessions.length} matière${
                filteredSessions.length > 1 ? "s" : ""
              } disponible${filteredSessions.length > 1 ? "s" : ""}`}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnOn]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t("learning.filter")}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons
              name="options-outline"
              size={16}
              color={activeFilterCount > 0 ? "#FFFFFF" : "#1F2937"}
            />
            <Text
              style={[
                styles.filterBtnText,
                activeFilterCount > 0 && styles.filterBtnTextOn,
              ]}
            >
              {t("learning.filter")}
            </Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <TouchableOpacity
            style={[
              styles.chip,
              filterSubjects.length === 0 && styles.chipActiveNeutral,
            ]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ selected: filterSubjects.length === 0 }}
            onPress={() => setFilterSubjects([])}
          >
            <Text
              style={[
                styles.chipText,
                filterSubjects.length === 0 && styles.chipTextActiveNeutral,
              ]}
            >
              Toutes
            </Text>
          </TouchableOpacity>

          {SUBJECT_SESSIONS.map((s) => {
            const on = filterSubjects.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.chip,
                  on && {
                    backgroundColor: `${s.accent}16`,
                    borderColor: `${s.accent}55`,
                  },
                ]}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => toggleSubject(s.id)}
              >
                <View style={[styles.chipDot, { backgroundColor: s.accent }]} />
                <Text style={[styles.chipText, on && { color: s.accent }]}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Populaires — compact rail */}
        {filteredSessions.length > 0 && (
          <>
            <View style={styles.railHeader}>
              <Ionicons name="flame" size={15} color="#F97316" />
              <Text style={styles.railTitle}>Les plus demandées</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sessionsSwiperContent}
              snapToInterval={RAIL_CARD_W + 14}
              decelerationRate="fast"
            >
              {filteredSessions.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.railCard}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                  accessibilityLabel={`${s.name}, ${s.price} DT par mois`}
                  onPress={() =>
                    navigation.navigate(PATHS.APP.DETAIL_PLAN_MEETING)
                  }
                >
                  <View style={styles.railCoverWrap}>
                    <Image source={s.cover} style={styles.railCover} />
                    <LinearGradient
                      colors={["rgba(9,29,54,0.02)", "rgba(9,29,54,0.78)"]}
                      start={{ x: 0, y: 0.25 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <View
                      style={[
                        styles.railSubjectPill,
                        { backgroundColor: s.accent },
                      ]}
                    >
                      <Text style={styles.railSubjectText}>{s.name}</Text>
                    </View>
                    <View style={styles.railRating}>
                      <Ionicons name="star" size={11} color="#FBBF24" />
                      <Text style={styles.railRatingText}>
                        {s.rating.toFixed(1)}
                      </Text>
                    </View>
                    <View style={styles.railCoverFooter}>
                      <Ionicons name="time-outline" size={11} color="#FFFFFF" />
                      <Text style={styles.railCoverFooterText}>{s.time}</Text>
                    </View>
                  </View>

                  <View style={styles.railBody}>
                    <View style={styles.railMetaRow}>
                      <View style={styles.railMetaChip}>
                        <Ionicons name="people" size={11} color="#0E7C86" />
                        <Text style={styles.railMetaText}>
                          {t("learning.groups_count", {
                            count: s.groupsCount,
                          })}
                        </Text>
                      </View>
                      <View style={styles.railMetaChip}>
                        <Ionicons
                          name="repeat-outline"
                          size={11}
                          color="#0E7C86"
                        />
                        <Text style={styles.railMetaText}>
                          {t("learning.days_per_week", {
                            days: s.daysPerWeek,
                          })}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.placesBar}>
                      <View
                        style={[
                          styles.placesFill,
                          {
                            width: `${
                              ((s.placesTotal - s.placesLeft) / s.placesTotal) *
                              100
                            }%`,
                            backgroundColor: s.accent,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.railPlaces}>
                      {t("learning.places_left", { count: s.placesLeft })}
                    </Text>

                    <View style={styles.railBottomRow}>
                      <View style={styles.railPriceRow}>
                        <Text style={styles.railPrice}>{s.price}</Text>
                        <Text style={styles.railPriceUnit}>
                          {t("learning.price_per_month")}
                        </Text>
                      </View>
                      <View
                        style={[styles.railGoBtn, { backgroundColor: s.accent }]}
                      >
                        <Ionicons
                          name="arrow-forward"
                          size={15}
                          color="#FFFFFF"
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {filteredSessions.length === 0 && (
          <View style={styles.emptyBlock}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search-outline" size={24} color="#12A9B4" />
            </View>
            <Text style={styles.emptyTitle}>Aucune matière trouvée</Text>
            <Text style={styles.emptyText}>
              Ajustez les filtres pour voir plus de séances.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              activeOpacity={0.85}
              onPress={resetFilters}
            >
              <Text style={styles.emptyBtnText}>{t("learning.reset")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Featured session cards — full-width, one per subject */}
        {filteredSessions.map((s) => (
          <React.Fragment key={s.id}>
            <View style={styles.featuredTitleRow}>
              <View
                style={[styles.featuredTitleBar, { backgroundColor: s.accent }]}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.featuredTitleText}>{s.name}</Text>
                <Text style={styles.featuredTitleSub} numberOfLines={1}>
                  {`${t("learning.sessions_count", {
                    count: s.sessionsCount,
                  })} · ${s.time}`}
                </Text>
              </View>
              <View
                style={[
                  styles.featuredPricePill,
                  { backgroundColor: `${s.accent}14` },
                ]}
              >
                <Text
                  style={[styles.featuredPriceText, { color: s.accent }]}
                >{`${s.price} DT`}</Text>
              </View>
            </View>
            <View style={styles.sessionCard}>
            {/* Subject + session count pills */}
            <View style={styles.cardSubjectPillRow}>
              <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}18`, borderColor: `${s.accent}35` }]}>
                <Ionicons name="book-outline" size={12} color={s.accent} />
                <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{s.name}</Text>
              </View>
              <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}12`, borderColor: `${s.accent}30` }]}>
                <Ionicons name="calendar-outline" size={12} color={s.accent} />
                <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{t("learning.sessions_count", { count: s.sessionsCount })}</Text>
              </View>
              <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}12`, borderColor: `${s.accent}30` }]}>
                <Ionicons name="time-outline" size={12} color={s.accent} />
                <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{s.time}</Text>
              </View>
            </View>

            {/* Cover image with rating + time overlays */}
            <View style={styles.sessionPhotoWrap}>
              <Image source={s.cover} style={styles.sessionPhoto} />
              <View style={styles.coverScrim} />
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingBadgeText}>{s.rating.toFixed(1)}</Text>
                <Text style={styles.ratingBadgeCount}>({s.ratingCount})</Text>
              </View>
              <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                <Text style={styles.timeBadgeText}>{s.time}</Text>
              </View>
            </View>

            <View style={styles.sessionBody}>
              <View style={styles.sessionTopRow}>
                <View style={styles.groupPill}>
                  <Ionicons name="people" size={14} color={s.accent} />
                  <Text style={styles.groupPillText}>{t("learning.groups_count", { count: s.groupsCount })}</Text>
                </View>
                <Text style={styles.sessionFreq}>{t("learning.days_per_week", { days: s.daysPerWeek })}</Text>
              </View>

              <View style={styles.dayPillsRow}>
                {s.days.map((day, i) => (
                  <View key={i} style={[styles.dayPill, day.active ? styles.dayPillActive : styles.dayPillOff]}>
                    <Text style={[styles.dayPillText, day.active ? styles.dayPillTextActive : styles.dayPillTextOff]}>
                      {day.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.reserveRow}>
                <View style={styles.avatarStack}>
                  {RESERVED_CHILDREN.map((src, i) => (
                    <Image key={i} source={src} style={[styles.reserveAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: RESERVED_CHILDREN.length - i }]} />
                  ))}
                  <View style={[styles.reserveAvatar, styles.reserveMore, { marginLeft: -10 }]}>
                    <Text style={styles.reserveMoreText}>+{s.reservedExtra}</Text>
                  </View>
                </View>
                <Text style={styles.reserveText}>{t("learning.reserved_children")}</Text>
              </View>

              <View style={styles.placesBar}>
                <View style={[styles.placesFill, { width: `${((s.placesTotal - s.placesLeft) / s.placesTotal) * 100}%` }]} />
              </View>
              <Text style={styles.placesCaption}>{t("learning.places_reserved", { filled: s.placesTotal - s.placesLeft, total: s.placesTotal })}</Text>

              <View style={styles.sessionBottomRow}>
                <View style={styles.priceBlock}>
                  <Text style={styles.priceFrom}>{t("learning.price_from")}</Text>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceValue}>{s.price}</Text>
                    <Text style={styles.priceUnit}>{t("learning.price_per_month")}</Text>
                  </View>
                  <View style={styles.placesRow}>
                    <View style={styles.placesDot} />
                    <Text style={styles.placesText}>{t("learning.places_left", { count: s.placesLeft })}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.detailsBtn,
                    { backgroundColor: s.accent, shadowColor: s.accent },
                  ]}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={`${t("learning.view_details")} — ${s.name}`}
                  onPress={() => navigation.navigate(PATHS.APP.DETAIL_PLAN_MEETING)}
                >
                  <Text style={styles.detailsBtnText}>{t("learning.view_details")}</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </React.Fragment>
        ))}

        {/* Filter Modal */}
        <Modal
          visible={filterVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              accessibilityRole="button"
              accessibilityLabel="Fermer les filtres"
              onPress={() => setFilterVisible(false)}
            />
            <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 18 }]}>
              <View style={styles.sheetHandle} />

              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{t("learning.filter")}</Text>
                  <Text style={styles.modalSubtitle}>
                    {`${filteredSessions.length} résultat${
                      filteredSessions.length > 1 ? "s" : ""
                    }`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Fermer"
                  onPress={() => setFilterVisible(false)}
                >
                  <Ionicons name="close" size={18} color="#475569" />
                </TouchableOpacity>
              </View>

              {/* Subject filter */}
              <Text style={styles.filterLabel}>{t("learning.subject_label")}</Text>
              <View style={styles.filterChipsGrid}>
                {SUBJECT_SESSIONS.map((s) => {
                  const checked = filterSubjects.includes(s.id);
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.filterChip,
                        checked && {
                          backgroundColor: `${s.accent}14`,
                          borderColor: s.accent,
                        },
                      ]}
                      activeOpacity={0.85}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked }}
                      onPress={() => toggleSubject(s.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          checked && {
                            backgroundColor: s.accent,
                            borderColor: s.accent,
                          },
                        ]}
                      >
                        {checked && (
                          <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.filterCheckLabel,
                          checked && { color: s.accent },
                        ]}
                      >
                        {s.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Price filter */}
              <Text style={[styles.filterLabel, { marginTop: 20 }]}>
                {t("learning.max_price", { price: filterMaxPrice })}
              </Text>
              <View style={styles.priceChips}>
                {[40, 55, 80, 100].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priceChip, filterMaxPrice === p && styles.priceChipActive]}
                    activeOpacity={0.85}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: filterMaxPrice === p }}
                    onPress={() => setFilterMaxPrice(p)}
                  >
                    <Text style={[styles.priceChipText, filterMaxPrice === p && styles.priceChipTextActive]}>
                      {p} DT
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  onPress={resetFilters}
                >
                  <Ionicons name="refresh" size={15} color="#475569" />
                  <Text style={styles.resetBtnText}>{t("learning.reset")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyBtn}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                  onPress={() => setFilterVisible(false)}
                >
                  <Text style={styles.applyBtnText}>{t("learning.apply")}</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
          </>
        ) : (
          <View>
            {/* Featured recording — video preview card */}
            <View style={styles.videoCard}>
              <View style={styles.videoCoverWrap}>
                <Image
                  source={RECORDED_FEATURED.cover}
                  style={styles.videoCover}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["rgba(9,29,54,0.05)", "rgba(9,29,54,0.88)"]}
                  start={{ x: 0, y: 0.2 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.videoTopRow}>
                  <View
                    style={[
                      styles.videoSubjectPill,
                      { backgroundColor: RECORDED_FEATURED.accent },
                    ]}
                  >
                    <Ionicons name="book-outline" size={11} color="#FFFFFF" />
                    <Text style={styles.videoSubjectText}>
                      {RECORDED_FEATURED.subject}
                    </Text>
                  </View>
                  <View style={styles.videoDurationPill}>
                    <Ionicons name="time-outline" size={11} color="#FFFFFF" />
                    <Text style={styles.videoDurationText}>
                      {RECORDED_FEATURED.duration}
                    </Text>
                  </View>
                </View>

                <View style={styles.videoPlayCenter}>
                  <TouchableOpacity
                    style={styles.videoPlayWrap}
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityLabel={`Revoir ${RECORDED_FEATURED.subject} — ${RECORDED_FEATURED.title}`}
                    onPress={() => openPlayer(RECORDED_FEATURED.videoUrl)}
                  >
                    <Animated.View
                      style={[
                        styles.videoPlayHalo,
                        {
                          opacity: pulseAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1],
                          }),
                          transform: [
                            {
                              scale: pulseAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.3],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.videoPlayBtn,
                        { backgroundColor: RECORDED_FEATURED.accent },
                      ]}
                    >
                      <Ionicons
                        name="play"
                        size={22}
                        color="#FFFFFF"
                        style={styles.videoPlayIcon}
                      />
                    </View>
                  </TouchableOpacity>
                  
                </View>

                <View style={styles.videoScrim}>
                  <Text style={styles.videoTitle} numberOfLines={1}>
                    {RECORDED_FEATURED.title}
                  </Text>
                  <View style={styles.videoTeacherRow}>
                    <View
                      style={[
                        styles.videoTeacherAvatarWrap,
                        { borderColor: RECORDED_FEATURED.accent },
                      ]}
                    >
                      <Image
                        source={RECORDED_FEATURED.teacherPhoto}
                        style={styles.videoTeacherAvatar}
                      />
                    </View>
                    <Text style={styles.videoMeta}>
                      {`${RECORDED_FEATURED.teacherName} · ${RECORDED_FEATURED.date}`}
                    </Text>
                  </View>
                  <View style={styles.videoProgressRow}>
                    <View style={styles.videoProgressBar}>
                      <View
                        style={[
                          styles.videoProgressFill,
                          {
                            width: `${RECORDED_FEATURED.progress}%`,
                            backgroundColor: RECORDED_FEATURED.accent,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.videoProgressText}>
                      {`${RECORDED_FEATURED.progress}%`}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.resumeBtn,
                        { backgroundColor: RECORDED_FEATURED.accent },
                      ]}
                      activeOpacity={0.9}
                      accessibilityRole="button"
                      accessibilityLabel={`Reprendre ${RECORDED_FEATURED.title}`}
                      onPress={() => openPlayer(RECORDED_FEATURED.videoUrl)}
                    >
                      <Ionicons name="play" size={12} color="#FFFFFF" />
                      <Text style={styles.resumeBtnText}>Reprendre</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.sectionRow, styles.recordedHeader]}>
              <View style={styles.sectionTitleWrap}>
                <Text style={styles.sectionTitle}>Séances enregistrées</Text>
                <Text style={styles.sectionCaption}>
                  Revoyez vos cours quand vous voulez
                </Text>
              </View>
              <View style={styles.recordedCount}>
                <Ionicons name="albums-outline" size={12} color="#0E7C86" />
                <Text style={styles.recordedCountText}>
                  {RECORDED_SESSIONS.length}
                </Text>
              </View>
            </View>

            {RECORDED_TEACHERS.map((teacher) => {
              const sessions = RECORDED_SESSIONS.filter(
                (s) => s.teacherId === teacher.id,
              );
              if (sessions.length === 0) return null;
              const page = recordedPages[teacher.id] ?? 0;

              return (
                <React.Fragment key={teacher.id}>
                  {/* Teacher section header */}
                  <View style={styles.recordedTeacherRow}>
                    <View
                      style={[
                        styles.recordedTeacherAvatarWrap,
                        { borderColor: teacher.accent },
                      ]}
                    >
                      <Image
                        source={teacher.photo}
                        style={styles.recordedTeacherAvatar}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.recordedTeacherName}
                        numberOfLines={1}
                      >
                        {teacher.name}
                      </Text>
                      <View style={styles.recordedTeacherSubjectRow}>
                        <View
                          style={[
                            styles.recordedTeacherSubjectDot,
                            { backgroundColor: teacher.accent },
                          ]}
                        />
                        <Text style={styles.recordedTeacherSubject}>
                          {teacher.subject}
                        </Text>
                        <Text style={styles.recordedTeacherCount}>
                          · {sessions.length} séances
                        </Text>
                      </View>
                    </View>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recordedSwiperContent}
                    snapToInterval={RECORDED_SNAP}
                    decelerationRate="fast"
                    onMomentumScrollEnd={onRecordedScrollEnd(teacher.id)}
                  >
                    {sessions.map((s) => {
                      const watched = s.progress >= 100;
                      const fresh = s.progress === 0;
                      const stateLabel = watched
                        ? "Vu"
                        : fresh
                          ? "Nouveau"
                          : "En cours";
                      const stateColor = watched
                        ? "#44B556"
                        : fresh
                          ? "#F97316"
                          : s.accent;

                      return (
                      <TouchableOpacity
                        key={s.id}
                        style={styles.recordedVideoCard}
                        activeOpacity={0.92}
                        accessibilityRole="button"
                        accessibilityLabel={`Revoir ${s.subject} — ${s.date}`}
                        onPress={() => openPlayer(s.videoUrl)}
                      >
                        <View style={styles.recordedVideoCoverWrap}>
                          <Image
                            source={s.cover}
                            style={styles.recordedVideoCover}
                            resizeMode="cover"
                          />
                          <LinearGradient
                            colors={["rgba(9,29,54,0.05)", "rgba(9,29,54,0.72)"]}
                            start={{ x: 0, y: 0.3 }}
                            end={{ x: 0, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                          <View style={styles.recordedVideoPlay}>
                            <TouchableOpacity
                              style={[
                                styles.recordedVideoPlayBtn,
                                { backgroundColor: s.accent },
                              ]}
                              activeOpacity={0.85}
                              accessibilityRole="button"
                              accessibilityLabel={`Revoir ${s.subject}`}
                              onPress={() => openPlayer(s.videoUrl)}
                            >
                              <Ionicons
                                name="play"
                                size={18}
                                color="#FFFFFF"
                                style={styles.recordedVideoPlayIcon}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.recordedVideoDuration}>
                            <Ionicons name="time-outline" size={11} color="#FFFFFF" />
                            <Text style={styles.recordedVideoDurationText}>
                              {s.duration}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.recordedState,
                              { backgroundColor: `${stateColor}E6` },
                            ]}
                          >
                            <Text style={styles.recordedStateText}>
                              {stateLabel}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.recordedVideoBody}>
                          <View style={styles.recordedVideoTopRow}>
                            <View
                              style={[
                                styles.recordedVideoAvatarWrap,
                                { borderColor: s.accent },
                              ]}
                            >
                              <Image
                                source={s.photo}
                                style={styles.recordedVideoAvatar}
                              />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={styles.recordedVideoSubject}
                                numberOfLines={1}
                              >
                                {s.subject}
                              </Text>
                              <Text
                                style={styles.recordedVideoTeacher}
                                numberOfLines={1}
                              >
                                {s.teacherName}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.recordedVideoMetaRow}>
                            <Ionicons
                              name="calendar-outline"
                              size={11}
                              color="#9CA3AF"
                            />
                            <Text style={styles.recordedVideoMetaText}>{s.date}</Text>
                            <View style={styles.recordedVideoMetaDivider} />
                            <Ionicons
                              name="time-outline"
                              size={11}
                              color="#9CA3AF"
                            />
                            <Text style={styles.recordedVideoMetaText}>{s.time}</Text>
                          </View>

                          <View style={styles.recordedVideoProgressRow}>
                            <View style={styles.recordedVideoProgressBar}>
                              <View
                                style={[
                                  styles.recordedVideoProgressFill,
                                  {
                                    width: `${s.progress}%`,
                                    backgroundColor: s.accent,
                                  },
                                ]}
                              />
                            </View>
                            <Text style={styles.recordedVideoProgressText}>
                              {s.progress}%
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <View style={styles.recordedDots}>
                    {sessions.map((s, i) => (
                      <View
                        key={s.id}
                        style={[
                          styles.recordedDot,
                          i === page && {
                            width: 20,
                            backgroundColor: teacher.accent,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}
      </ScrollView>
      )}

      {/* ── Recording player modal ── */}
      <Modal
        visible={playerVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closePlayer}
      >
        <View style={styles.playerOverlay}>
          <View style={[styles.playerHeader, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.playerCloseBtn}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Fermer la vidéo"
              onPress={closePlayer}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {playerUrl ? (
            <View style={styles.playerVideoWrap}>
              <Video
                key={playerKey}
                ref={playerRef}
                source={{ uri: playerUrl }}
                style={styles.playerVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping={false}
                volume={1.0}
                onLoadStart={() => {
                  setPlayerLoading(true);
                  setPlayerError(false);
                }}
                onLoad={() => setPlayerLoading(false)}
                onError={() => {
                  setPlayerLoading(false);
                  setPlayerError(true);
                }}
              />
              {playerLoading && (
                <View style={styles.playerLoading}>
                  <ActivityIndicator size="large" color="#22BEC8" />
                  <Text style={styles.playerLoadingText}>Chargement…</Text>
                </View>
              )}
              {playerError && (
                <View style={styles.playerError}>
                  <Ionicons
                    name="cloud-offline-outline"
                    size={36}
                    color="#EF4444"
                  />
                  <Text style={styles.playerErrorText}>
                    Impossible de lire la vidéo
                  </Text>
                  <TouchableOpacity
                    style={styles.playerRetryBtn}
                    activeOpacity={0.85}
                    onPress={retryPlayer}
                  >
                    <Text style={styles.playerRetryText}>Réessayer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const shadowHeader = {
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EEF3F8" },
  scroll: { paddingHorizontal: GUTTER, paddingBottom: 48 },

  // ── Header (mirrors HomeScreen) ─────────────────────────────────
  headerShell: { paddingHorizontal: 0 },
  headerGradient: {
    paddingHorizontal: 16,
    paddingBottom: 38,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 80,
    overflow: "hidden",
    ...shadowHeader,
  },
  headerGlowA: {
    position: "absolute",
    width: 260, height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(34,190,200,0.18)",
    top: -110,
  },
  headerGlowB: {
    position: "absolute",
    width: 280, height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -140,
  },
  header: {

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hello: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
  levelUp: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 1 },
  bellBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  // ── Planner card (month nav + day strip) ─────────────────────────
  plannerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 14,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#122A4E",
    lineHeight: 25,
    textTransform: "capitalize",
  },
  monthYear: { fontSize: 12, fontWeight: "600", color: "#8A94A6", marginTop: 1 },
  monthNav: { flexDirection: "row", alignItems: "center", gap: 6 },
  todayChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E9F9FA",
    marginRight: 2,
  },
  todayChipText: { fontSize: 11.5, fontWeight: "800", color: "#0E7C86" },
  navArrow: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#F5F8FC",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarStrip: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  dayCell: {
    width: 46,
    paddingVertical: 9,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  dayCellSelected: {
    backgroundColor: "transparent",
    shadowColor: "#12A9B4",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  dayCellToday: { borderColor: "#9BE4EA", backgroundColor: "#FFFFFF" },
  dayCellLabel: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#9AA6B8",
    letterSpacing: 0.6,
  },
  dayCellLabelOn: { color: "rgba(255,255,255,0.9)" },
  dayCellNum: {
    fontSize: 15,
    fontWeight: "800",
    color: "#122A4E",
    marginTop: 3,
  },
  dayCellNumOn: { color: "#FFFFFF" },
  dayCellNumToday: { color: "#0E7C86" },
  dayCellDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    marginTop: 5,
    backgroundColor: "transparent",
  },
  dayCellDotOn: { backgroundColor: "#FFFFFF" },
  dayCellDotToday: { backgroundColor: "#22BEC8" },
  mapCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  mapTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  mapAvatarShell: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  mapAvatarImg: { width: 56, height: 56, borderRadius: 18, resizeMode: "cover" },
  mapTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937" },
  briefRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  briefText: { fontSize: 12, color: "#6B7280" },
  timelineRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  timelineLabel: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  timelineBar: { flex: 1, height: 5, borderRadius: 3, backgroundColor: "#E5E7EB" },
  timelineFill: { width: "28%", height: "100%", borderRadius: 3, backgroundColor: "#7C4DCC" },
  timelineTime: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  mapBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  explainText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 1 },
  avatarsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  stackAvatar: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, borderColor: "#FFFFFF",
    backgroundColor: "#E5E7EB",
  },
  stackMore: { alignItems: "center", justifyContent: "center", backgroundColor: "#7C4DCC" },
  stackMoreText: { fontSize: 10, fontWeight: "800", color: "#FFFFFF" },
  copyBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 14, height: 34, borderRadius: 17,
    backgroundColor: "#F3EEFF",
  },
  copyText: { fontSize: 13, fontWeight: "700", color: "#7C4DCC" },

  // ── Subject pill ─────────────────────────────────────────────────
  cardSubjectPillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    marginBottom: 6,
  },
  cardSubjectPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardSubjectPillText: {
    fontSize: 12,
    fontWeight: "800",
  },

  // ── Group session card ───────────────────────────────────────────
  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
     
  },
  sessionPhotoWrap: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5E7EB",
    position: "relative",
    borderRadius: 20,
   
  },
  sessionPhoto: { width: "100%", height: "100%", resizeMode: "cover" , borderRadius: 10, },
  coverScrim: {
    position: "absolute" as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(17,24,39,0.72)",
  },
  ratingBadgeText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  ratingBadgeCount: { fontSize: 10, fontWeight: "600", color: "rgba(255,255,255,0.75)" },
  timeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(124,77,204,0.85)",
  },
  timeBadgeText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  sessionBody: { padding: 12 },
  sessionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  groupPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#EAFBFC",
  },
  groupPillText: { fontSize: 11.5, fontWeight: "800", color: "#0E7C86" },
  sessionFreq: { fontSize: 10.5, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.4 },
  dayPillsRow: { flexDirection: "row", gap: 6, marginBottom: 12 },
  dayPill: {
    flex: 1,
    height: 26,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dayPillActive: { backgroundColor: "#EAFBFC" },
  dayPillOff: { backgroundColor: "#F3F4F6" },
  dayPillText: { fontSize: 12, fontWeight: "800" },
  dayPillTextActive: { color: "#22BEC8" },
  dayPillTextOff: { color: "#C4C9D2" },
  reserveRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  reserveAvatar: {
    width: 24, height: 24, borderRadius: 11,
    borderWidth: 2, borderColor: "#FFFFFF",
    backgroundColor: "#E5E7EB",
  },
  reserveMore: { alignItems: "center", justifyContent: "center", backgroundColor: "#22BEC8" },
  reserveMoreText: { fontSize: 8, fontWeight: "800", color: "#FFFFFF" },
  reserveText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  placesBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#EEF0F4",
    overflow: "hidden",
    marginBottom: 4,
  },
  placesFill: { height: "100%", borderRadius: 2, backgroundColor: "#22BEC8" },
  placesCaption: { fontSize: 10, fontWeight: "700", color: "#9CA3AF", marginBottom: 10 },
  sessionBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceBlock: { flex: 1 },
  priceFrom: { fontSize: 11, fontStyle: "italic", color: "#9CA3AF", marginBottom: 1 },
  priceValueRow: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  priceValue: { fontSize: 20, fontWeight: "900", color: "#1F2937", lineHeight: 26 },
  priceUnit: { fontSize: 12, fontWeight: "700", color: "#1F2937", marginBottom: 2 },
  placesRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  placesDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F97316" },
  placesText: { fontSize: 11, fontWeight: "700", color: "#F97316" },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#111827",
  },
  detailsBtnText: { fontSize: 12.5, fontWeight: "800", color: "#FFFFFF" },

  // ── Section headers ──────────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  sectionTitleWrap: { flex: 1 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#122A4E" },
  sectionCaption: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#8A94A6",
    marginTop: 2,
  },

  // ── Subject chips ─────────────────────────────────────────────────
  chipsRow: { flexDirection: "row", gap: 8, paddingRight: 20, marginBottom: 18 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EDF5",
  },
  chipActiveNeutral: { backgroundColor: "#122A4E", borderColor: "#122A4E" },
  chipDot: { width: 7, height: 7, borderRadius: 999 },
  chipText: { fontSize: 12.5, fontWeight: "700", color: "#5A6577" },
  chipTextActiveNeutral: { color: "#FFFFFF", fontWeight: "800" },

  // ── Featured card titles ──────────────────────────────────────────
  featuredTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    marginTop: 6,
  },
  featuredTitleBar: { width: 4, height: 34, borderRadius: 999 },
  featuredTitleText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#122A4E",
    letterSpacing: 0.2,
  },
  featuredTitleSub: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8A94A6",
    marginTop: 2,
  },
  featuredPricePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  featuredPriceText: { fontSize: 12, fontWeight: "800" },

  filterBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, height: 36, borderRadius: 999,
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7EDF5",
  },
  filterBtnOn: { backgroundColor: "#122A4E", borderColor: "#122A4E" },
  filterBtnText: { fontSize: 12.5, fontWeight: "700", color: "#1F2937" },
  filterBtnTextOn: { color: "#FFFFFF" },
  filterBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22BEC8",
  },
  filterBadgeText: { fontSize: 10, fontWeight: "800", color: "#FFFFFF" },

  // ── "Les plus demandées" rail ─────────────────────────────────────
  railHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  railTitle: { fontSize: 13.5, fontWeight: "800", color: "#122A4E" },
  sessionsSwiperContent: { gap: 14, paddingRight: 20, paddingBottom: 6 },
  railCard: {
    width: RAIL_CARD_W,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#0D2A52",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  railCoverWrap: { width: "100%", height: 124, backgroundColor: "#DCE5EF" },
  railCover: { width: "100%", height: "100%", resizeMode: "cover" },
  railSubjectPill: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  railSubjectText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  railRating: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(17,24,39,0.7)",
  },
  railRatingText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  railCoverFooter: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  railCoverFooterText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },
  railBody: { padding: 12 },
  railMetaRow: { flexDirection: "row", gap: 6, marginBottom: 10 },
  railMetaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EAFBFC",
  },
  railMetaText: { fontSize: 10.5, fontWeight: "800", color: "#0E7C86" },
  railPlaces: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#F97316",
    marginBottom: 10,
  },
  railBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  railPriceRow: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  railPrice: { fontSize: 18, fontWeight: "900", color: "#122A4E" },
  railPriceUnit: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A94A6",
    marginBottom: 2,
  },
  railGoBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Empty state ───────────────────────────────────────────────────
  emptyBlock: {
    alignItems: "center",
    paddingVertical: 34,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 18,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9F9FA",
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 14.5, fontWeight: "800", color: "#122A4E" },
  emptyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A94A6",
    marginTop: 4,
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 14,
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#122A4E",
  },
  emptyBtnText: { fontSize: 12.5, fontWeight: "800", color: "#FFFFFF" },

  // ── View switch (Réserver ↔ Agenda ↔ Replays) ────────────────────
  segWrap: {
    paddingHorizontal: GUTTER,
    zIndex: 5,
  },
  segControl: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    padding: TAB_PAD,
    marginTop: -24,
    marginBottom: 6,
    shadowColor: "#0D2A52",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  switchTab: {
    height: 42,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  switchLabel: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  // ── Featured video card ──────────────────────────────────────────
  videoCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: "#0B1E38",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  videoCoverWrap: {
    width: "100%",
    height: 220,
    backgroundColor: "#0B1E38",
  },
  videoCover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoTopRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  videoSubjectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  videoSubjectText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  videoDurationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(9,29,54,0.55)",
  },
  videoDurationText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  videoPlayCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  videoPlayWrap: {
    width: 74,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlayHalo: {
    position: "absolute",
    width: 74,
    height: 74,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.65)",
  },
  videoPlayBtn: {
    width: 58,
    height: 58,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  videoPlayIcon: {
    marginLeft: 3,
  },
  videoPlayHint: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.95)",
    backgroundColor: "rgba(9,29,54,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  videoScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 34,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  videoMeta: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.82)",
  },
  videoTeacherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  videoTeacherAvatarWrap: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  videoTeacherAvatar: {
    width: 16,
    height: 16,
    borderRadius: 999,
    resizeMode: "cover",
  },
  videoProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  videoProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
    overflow: "hidden",
  },
  videoProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  videoProgressText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  resumeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginLeft: 2,
  },
  resumeBtnText: { fontSize: 11.5, fontWeight: "800", color: "#FFFFFF" },

  // ── Recorded sessions carousel ───────────────────────────────────
  recordedHeader: {
    marginTop: 0,
  },
  recordedCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minWidth: 26,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E9F9FA",
    justifyContent: "center",
  },
  recordedCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0E7C86",
  },
  recordedState: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  recordedStateText: { fontSize: 10, fontWeight: "800", color: "#FFFFFF" },
  recordedTeacherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  recordedTeacherAvatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 999,
    borderWidth: 2,
    padding: 2,
    backgroundColor: "#FFFFFF",
  },
  recordedTeacherAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    resizeMode: "cover",
  },
  recordedTeacherName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  recordedTeacherSubjectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  recordedTeacherSubjectDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  recordedTeacherSubject: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  recordedTeacherCount: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  recordedSwiperContent: {
    gap: 14,
    paddingRight: 8,
  },
  recordedVideoCard: {
    width: RECORDED_CARD_W,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  recordedVideoCoverWrap: {
    width: "100%",
    height: 132,
    backgroundColor: "#0B1E38",
  },
  recordedVideoCover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  recordedVideoPlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  recordedVideoPlayBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  recordedVideoPlayIcon: {
    marginLeft: 2,
  },
  recordedVideoDuration: {
    position: "absolute",
    right: 8,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(9,29,54,0.55)",
  },
  recordedVideoDurationText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  recordedVideoBody: {
    padding: 12,
  },
  recordedVideoTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recordedVideoAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  recordedVideoAvatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    resizeMode: "cover",
  },
  recordedVideoSubject: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#1F2937",
  },
  recordedVideoTeacher: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 1,
  },
  recordedVideoMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  recordedVideoMetaDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  recordedVideoMetaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    flexShrink: 1,
  },
  recordedVideoProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  recordedVideoProgressBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#EEF0F4",
    overflow: "hidden",
  },
  recordedVideoProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  recordedVideoProgressText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
  },
  recordedDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    marginBottom: 26,
  },
  recordedDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#D6DBE3",
  },

  // ── Recording player modal ───────────────────────────────────────
  playerOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,11,20,0.96)",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  playerCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  playerVideoWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playerVideo: {
    width: W,
    height: W * 0.56,
    backgroundColor: "#000",
  },
  playerLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  playerLoadingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  playerError: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  playerErrorText: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  playerRetryBtn: {
    marginTop: 6,
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#22BEC8",
    alignItems: "center",
    justifyContent: "center",
  },
  playerRetryText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // ── Filter sheet ─────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(9,20,38,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#DDE4EE",
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#122A4E" },
  modalSubtitle: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#8A94A6",
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5FA",
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#8A94A6",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  filterChipsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E7EDF5",
    backgroundColor: "#FFFFFF",
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 6, borderWidth: 2, borderColor: "#D1D5DB",
    alignItems: "center", justifyContent: "center",
  },
  filterCheckLabel: { fontSize: 13, fontWeight: "700", color: "#122A4E" },
  priceChips: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  priceChip: {
    paddingHorizontal: 16, height: 38, borderRadius: 999,
    backgroundColor: "#F5F8FC", alignItems: "center", justifyContent: "center",
  },
  priceChipActive: { backgroundColor: "#122A4E" },
  priceChipText: { fontSize: 13, fontWeight: "700", color: "#5A6577" },
  priceChipTextActive: { color: "#FFFFFF", fontWeight: "800" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 26 },
  resetBtn: {
    flexDirection: "row",
    gap: 6,
    flex: 1, height: 46, borderRadius: 16, backgroundColor: "#F5F8FC",
    alignItems: "center", justifyContent: "center",
  },
  resetBtnText: { fontSize: 13.5, fontWeight: "800", color: "#475569" },
  applyBtn: {
    flexDirection: "row",
    gap: 6,
    flex: 1.4, height: 46, borderRadius: 16, backgroundColor: "#122A4E",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#122A4E",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  applyBtnText: { fontSize: 13.5, fontWeight: "800", color: "#FFFFFF" },
});
