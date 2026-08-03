import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, type CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { styles, COLORS } from "./MeetingViewScreen.styles";
import AiOrb from "./AiOrb";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import LanguageSwitcher from "@components/header/LanguageSwitcher";
import { PATHS } from "@config/constants/paths";
import type {
  RootStackParamList,
  TabsParamList,
} from "@config/types/navigation.types";

const TEACHER_PHOTO = require("@assets/teachers/ismail.png");

// Children already reserved in the group session (shown as overlapping avatars)
const RESERVED_CHILDREN = [
  require("../../../../assets/kids/boys/boy1.png"),
  require("../../../../assets/kids/girls/girl1.jpg"),
  require("../../../../assets/kids/boys/boy2.jpg"),
];

// Group-session detail used to render the "meeting details" card.
type GroupSessionDetail = {
  subject: string;
  accent: string;
  time: string;
  sessionsCount: number;
  groupsCount: number;
  daysPerWeek: number;
  placesLeft: number;
  placesTotal: number;
  days: { label: string; active: boolean }[];
};

const GROUP_SESSION_DETAIL: GroupSessionDetail = {
  subject: "Anglais",
  accent: "#22BEC8",
  time: "18:30 – 20:00",
  sessionsCount: 8,
  groupsCount: 4,
  daysPerWeek: 2,
  placesLeft: 5,
  placesTotal: 20,
  days: [
    { label: "L", active: true }, { label: "M", active: false },
    { label: "M", active: true }, { label: "J", active: false },
    { label: "V", active: false }, { label: "D", active: true },
  ],
};

// Remaining séances in the parent's subscription, per billing period,
// with the minimum price for that period.
const ABONNEMENT = {
  month: { label: "Mois", remaining: 6, price: 80, unit: "mois" },
  year: { label: "Année", remaining: 72, price: 780, unit: "an" },
} as const;

type AbonnementPeriod = keyof typeof ABONNEMENT;

// Quick topics shown when the "ask admin" input is tapped (dropdown).
const QUICK_ASKS = [
  "Problème de micro",
  "Problème de connexion",
  "Session manquante",
  "Modifier mon abonnement",
  "Autre question",
];

// Decorative stars scattered over the hero background (percent positions)
const STARS = [
  { top: "12%", left: "18%", size: 3 },
  { top: "20%", left: "72%", size: 2 },
  { top: "30%", left: "40%", size: 2.5 },
  { top: "16%", left: "55%", size: 2 },
  { top: "44%", left: "22%", size: 2 },
  { top: "50%", left: "80%", size: 3 },
  { top: "62%", left: "34%", size: 2 },
  { top: "38%", left: "88%", size: 2.5 },
  { top: "26%", left: "30%", size: 2 },
  { top: "58%", left: "60%", size: 2 },
];
// Weekly calendar data for the Roadmap card: one column per day,
// with the teacher's material when a session is scheduled.
type WeekDay = {
  label: string;
  full: string;
  date: number;
  material: string | null;
  accent: string;
  active: boolean;
  today: boolean;
};

const WEEK_TEACHER = {
  name: "Mrs. Ismail",
  subject: "Anglais",
  photo: TEACHER_PHOTO,
};

const WEEK_CALENDAR_DAYS: WeekDay[] = [
  { label: "L", full: "Lun", date: 17, material: "Anglais", accent: "#22BEC8", active: true, today: false },
  { label: "M", full: "Mar", date: 18, material: null, accent: "#22BEC8", active: false, today: false },
  { label: "M", full: "Mer", date: 19, material: "Anglais", accent: "#22BEC8", active: true, today: true },
  { label: "J", full: "Jeu", date: 20, material: null, accent: "#22BEC8", active: false, today: false },
  { label: "V", full: "Ven", date: 21, material: "Math", accent: "#F97316", active: true, today: false },
  { label: "S", full: "Sam", date: 22, material: null, accent: "#22BEC8", active: false, today: false },
  { label: "D", full: "Dim", date: 23, material: "Anglais", accent: "#22BEC8", active: true, today: false },
];

const WEEK_STATS = {
  sessions: WEEK_CALENDAR_DAYS.filter((d) => d.active).length,
  subjects: new Set(WEEK_CALENDAR_DAYS.filter((d) => d.material).map((d) => d.material)).size,
  progress: "13%",
  nextDay: WEEK_CALENDAR_DAYS.find((d) => d.today)?.full ?? WEEK_CALENDAR_DAYS.find((d) => d.active)?.full ?? "-",
};

// ── Main screen ───────────────────────────────────────────────────────────────
export default function MeetingViewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<
    CompositeNavigationProp<
      NativeStackNavigationProp<RootStackParamList>,
      BottomTabNavigationProp<TabsParamList>
    >
  >();
  const headerData = useActiveChildHeaderData();
  const childPhotoUri = headerData?.avatarUrl ?? null;
  const childInitials = headerData?.initials ?? "أ";
  const [period, setPeriod] = useState<AbonnementPeriod>("month");
  const [askOpen, setAskOpen] = useState(false);
  const [askValue, setAskValue] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const askAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(askAnim, {
      toValue: askOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [askOpen, askAnim]);

  // ── Live orb animation: slow spin + gentle breathing pulse ──────────────────
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spin, pulse]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.07],
  });
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <LinearGradient
        colors={["#153A6B", "#1D3B65", "#091D36"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Session</Text>
        <View style={styles.headerRight}>
          <LanguageSwitcher />
          <TouchableOpacity style={styles.headerMenuBtn}>
            <Ionicons name="menu" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card — starry gradient + glowing orb (code-built) */}
        <LinearGradient
          colors={["#9fd4e6", "#4c95e2", "#0b1a45"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.heroCard}
        >
          {/* stars */}
          {STARS.map((s, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: s.top as any,
                  left: s.left as any,
                  width: s.size,
                  height: s.size,
                  borderRadius: s.size / 2,
                },
              ]}
            />
          ))}

          <View style={styles.heroTopRow}>
            {/* Real child photo in the live session */}
            <View style={styles.childAvatarWrap}>
              {childPhotoUri ? (
                <Image
                  source={{ uri: childPhotoUri }}
                  style={styles.childAvatar}
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient
                  colors={[COLORS.orange, "#EC4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.childAvatar}
                >
                  <Text style={styles.childAvatarText}>{childInitials}</Text>
                </LinearGradient>
              )}
              {/* live dot */}
              <View style={styles.liveDot} />
            </View>
            {/* Filter + problem-ask buttons */}
            <View style={styles.heroTopActions}>
              <TouchableOpacity
                style={styles.askBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setSent(null);
                  setAskOpen((o) => !o);
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={15} color="#FFFFFF" />
                <Text style={styles.askBtnText}>Problème ?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.orbContainer}>
            {/* pulsing glow halo behind the orb */}
            <Animated.View
              style={[styles.orbPulseGlow, { opacity: glowOpacity, transform: [{ scale }] }]}
            />
            {/* the old SVG orb, slowly spinning + breathing */}
            <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
              <AiOrb size={110} />
            </Animated.View>
            {/* teacher photo fixed in the center */}
            <View style={styles.orbTeacher}>
              <Image source={TEACHER_PHOTO} style={styles.orbTeacherImg} resizeMode="cover" />
            </View>
          </View>

          <View style={styles.greetingBubble}>
            <Text style={styles.heroGreeting}>Votre séance en direct est prête !</Text>
          </View>

          {/* Join meeting button */}
          <TouchableOpacity
            style={styles.joinBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate(PATHS.APP.JOIN_SESSION)}
          >
            <View style={styles.joinBtnIcon}>
              <Ionicons name="play" size={13} color="#FFFFFF" />
            </View>
            <Text style={styles.joinBtnText}>Join the session</Text>
          </TouchableOpacity>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="camera-outline" size={22} color={COLORS.title} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.micBtn}>
              <Ionicons name="mic" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="videocam-outline" size={22} color={COLORS.title} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Ask-admin dropdown — opened from the hero "Problème ?" button */}
        {askOpen && (
          <Animated.View style={[styles.askDropdown, { opacity: askAnim }]}>
            <View style={styles.askHeader}>
              <Text style={styles.askHeaderTitle}>Comment pouvons-nous aider ?</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setAskOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            {QUICK_ASKS.map((q, i) => {
              const selected = askValue === q;
              return (
                <TouchableOpacity
                  key={q}
                  style={[
                    styles.askItem,
                    i < QUICK_ASKS.length - 1 && styles.askItemBorder,
                    selected && styles.askItemSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setAskValue(q)}
                >
                  <Ionicons
                    name={selected ? "checkbox" : "chatbubble-ellipses-outline"}
                    size={15}
                    color={selected ? COLORS.primary : COLORS.muted}
                  />
                  <Text style={[styles.askItemText, selected && styles.askItemTextSelected]}>{q}</Text>
                  {selected && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
                </TouchableOpacity>
              );
            })}
            <View style={styles.askFooter}>
              <TouchableOpacity
                style={[styles.askSendBtn, !askValue && styles.askSendBtnDisabled]}
                disabled={!askValue}
                activeOpacity={0.85}
                onPress={() => {
                  setSent(askValue);
                  setAskOpen(false);
                }}
              >
                <Ionicons name="paper-plane" size={15} color="#FFFFFF" />
                <Text style={styles.askSendBtnText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Sent confirmation — shown below the hero once a problem is sent */}
        {sent && (
          <View style={styles.sentCard}>
            <View style={styles.sentIcon}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.sentTextWrap}>
              <Text style={styles.sentTitle}>Problème envoyé</Text>
              <Text style={styles.sentSub}>{sent}</Text>
            </View>
          </View>
        )}

        {/* Meeting details — group session summary */}
        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <View style={[styles.detailTitleDot, { backgroundColor: GROUP_SESSION_DETAIL.accent }]} />
            <Text style={styles.detailTitle}>Meeting Details</Text>
          </View>

          <View style={styles.detailCard}>
            {/* Subject + sessions */}
            <View style={styles.subjHeader}>
              <View style={styles.subjTitleWrap}>
                <View style={[styles.detailTitleDot, { backgroundColor: GROUP_SESSION_DETAIL.accent }]} />
                <Text style={styles.subjTitle}>{GROUP_SESSION_DETAIL.subject}</Text>
              </View>
              <View
                style={[
                  styles.subjSessionsPill,
                  { backgroundColor: `${GROUP_SESSION_DETAIL.accent}14`, borderColor: `${GROUP_SESSION_DETAIL.accent}33` },
                ]}
              >
                <Ionicons name="calendar-outline" size={12} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={[styles.subjSessionsText, { color: GROUP_SESSION_DETAIL.accent }]}>
                  {GROUP_SESSION_DETAIL.sessionsCount} séances/mois
                </Text>
              </View>
            </View>

            {/* Meta: time • groups • days/week */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={styles.metaText}>{GROUP_SESSION_DETAIL.time}</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="people" size={14} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={styles.metaText}>{GROUP_SESSION_DETAIL.groupsCount} groupes</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="repeat" size={14} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={styles.metaText}>{GROUP_SESSION_DETAIL.daysPerWeek} j/semaine</Text>
              </View>
            </View>

            {/* Day pills */}
            <View style={styles.dayPillsRow}>
              {GROUP_SESSION_DETAIL.days.map((day, i) => (
                <View key={i} style={[styles.dayPill, day.active ? styles.dayPillActive : styles.dayPillOff]}>
                  <Text style={[styles.dayPillText, day.active ? styles.dayPillTextActive : styles.dayPillTextOff]}>{day.label}</Text>
                </View>
              ))}
            </View>

            {/* Reserved children + places */}
            <View style={styles.reservePlacesRow}>
              <View style={styles.reserveRow}>
                <View style={styles.avatarStack}>
                  {RESERVED_CHILDREN.map((src, i) => (
                    <Image key={i} source={src} style={[styles.reserveAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: RESERVED_CHILDREN.length - i }]} />
                  ))}
                </View>
                <Text style={styles.reserveText}>{RESERVED_CHILDREN.length} enfants</Text>
              </View>
              <View style={styles.placesBlock}>
                <Text style={styles.placesCaption}>
                  {GROUP_SESSION_DETAIL.placesTotal - GROUP_SESSION_DETAIL.placesLeft}/{GROUP_SESSION_DETAIL.placesTotal} places
                </Text>
                <View style={styles.placesBar}>
                  <View
                    style={[
                      styles.placesFill,
                      { width: `${((GROUP_SESSION_DETAIL.placesTotal - GROUP_SESSION_DETAIL.placesLeft) / GROUP_SESSION_DETAIL.placesTotal) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Remaining séances in the subscription (mois / année) */}
            <View style={styles.abonnementSection}>
              <View style={styles.abonnementRow}>
                <View style={styles.periodToggle}>
                  {(Object.keys(ABONNEMENT) as AbonnementPeriod[]).map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                      onPress={() => setPeriod(p)}
                    >
                      <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
                        {ABONNEMENT[p].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.abonnementStat}>
                  <Text style={styles.abonnementRemaining}>{ABONNEMENT[period].remaining}</Text>
                  <View>
                    <Text style={styles.abonnementRemainingLabel}>séances restantes</Text>
                    <Text style={styles.abonnementPrice}>
                      à partir de {ABONNEMENT[period].price} DT/{ABONNEMENT[period].unit}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Pills */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={styles.pillsRow}
        >
          <TouchableOpacity style={styles.pillActive}>
            <Text style={styles.pillActiveText}>Week Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillText}>Create New Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillText}>Apply Steps</Text>
          </TouchableOpacity>
        </ScrollView> */}

         {/* Roadmap */}
        <View style={styles.roadmapSection}>
          <View style={styles.roadmapHeader}>
            <View style={styles.roadmapTitleWrap}>
              <LinearGradient
                colors={["#22BEC8", "#128E96"]}
                style={styles.roadmapIcon}
              >
                <Ionicons name="map" size={15} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.roadmapTitle}>Roadmap</Text>
            </View>
            <View style={styles.roadmapTabs}>
              {["Day", "Week", "Month", "Year"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.roadmapTab, tab === "Week" && styles.roadmapTabActive]}
                >
                  <Text
                    style={[
                      styles.roadmapTabText,
                      tab === "Week" && styles.roadmapTabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gantt chart → weekly calendar (teacher + days + material) */}
          <View style={styles.calendarCard}>
            {/* Teacher row */}
            <View style={styles.calTeacherRow}>
              <View style={styles.calTeacherAvatar}>
                <Image source={WEEK_TEACHER.photo} style={styles.calTeacherImg} />
              </View>
              <View style={styles.calTeacherInfo}>
                <Text style={styles.calTeacherName}>{WEEK_TEACHER.name}</Text>
                <Text style={styles.calTeacherSub}>
                  {WEEK_TEACHER.subject} • {WEEK_STATS.sessions} séances/semaine
                </Text>
              </View>
              <View style={styles.calNextPill}>
                <Text style={styles.calNextPillText}>Prochaine {WEEK_STATS.nextDay}</Text>
              </View>
            </View>

            {/* Week grid */}
            <View style={styles.calWeekGrid}>
              {WEEK_CALENDAR_DAYS.map((d, i) => (
                <View key={i} style={styles.calDayCol}>
                  <Text style={styles.calDayLabel}>{d.label}</Text>
                  <View
                    style={[
                      styles.calDateWrap,
                      d.active && { backgroundColor: d.accent },
                      d.today && styles.calDateToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calDateText,
                        d.active && styles.calDateTextActive,
                        d.today && styles.calDateTextToday,
                      ]}
                    >
                      {d.date}
                    </Text>
                  </View>
                  {d.active && d.material ? (
                    <View
                      style={[
                        styles.calMatChip,
                        { backgroundColor: `${d.accent}14`, borderColor: `${d.accent}33` },
                      ]}
                    >
                      <View style={[styles.calMatDot, { backgroundColor: d.accent }]} />
                      <Text
                        style={[styles.calMatText, { color: d.accent }]}
                        numberOfLines={1}
                      >
                        {d.material}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.calMatEmpty} />
                  )}
                </View>
              ))}
            </View>

            {/* Week stats */}
            <View style={styles.calFooter}>
              <View style={styles.calStat}>
                <Text style={styles.calStatValue}>{WEEK_STATS.sessions}</Text>
                <Text style={styles.calStatLabel}>séances</Text>
              </View>
              <View style={styles.calDivider} />
              <View style={styles.calStat}>
                <Text style={styles.calStatValue}>{WEEK_STATS.subjects}</Text>
                <Text style={styles.calStatLabel}>matières</Text>
              </View>
              <View style={styles.calDivider} />
              <View style={styles.calStat}>
                <Text style={styles.calStatValue}>{WEEK_STATS.progress}</Text>
                <Text style={styles.calStatLabel}>progression</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
