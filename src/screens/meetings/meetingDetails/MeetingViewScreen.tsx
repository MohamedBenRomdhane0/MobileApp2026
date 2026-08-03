import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { styles, COLORS } from "./MeetingViewScreen.styles";
import AiOrb from "./AiOrb";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import LanguageSwitcher from "@components/header/LanguageSwitcher";

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
const GANTT_ROWS = [
  {
    id: 1,
    label: "Ignite Curiosity",
    icon: "lightbulb-outline" as const,
    iconLib: "mci",
    barLeft: 0,
    barWidth: 0.4, // Mon → Tue
    barColor: "rgba(99,102,241,0.18)",
    barBorder: "rgba(99,102,241,0.35)",
    active: false,
    progress: null,
    avatar: null,
  },
  {
    id: 2,
    label: "Map the Path",
    icon: "map-outline" as const,
    iconLib: "ion",
    barLeft: 0.3,
    barWidth: 0.5, // Tue → Thu (crosses Wed / today)
    barColor: COLORS.orange,
    barBorder: COLORS.orange,
    active: true,
    progress: "13%",
    avatar: { color: "#8B5CF6" },
  },
  {
    id: 3,
    label: "Launch Your Journey",
    icon: "rocket-outline" as const,
    iconLib: "ion",
    barLeft: 0.6,
    barWidth: 0.4, // Thu → Fri
    barColor: "rgba(34,190,200,0.18)",
    barBorder: "rgba(34,190,200,0.35)",
    active: false,
    progress: null,
    avatar: null,
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const ACTIVE_DAY = "Wed";
// Wed is index 2 of 5 → its column center sits at 50% of the bar area.
// Every "today" marker (vertical line, progress badge, avatar) uses this
// single fraction so they stay aligned with the timeline.
const TODAY_FRAC = (DAYS.indexOf(ACTIVE_DAY) + 0.5) / DAYS.length;

// ── Main screen ───────────────────────────────────────────────────────────────
export default function MeetingViewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const headerData = useActiveChildHeaderData();
  const childPhotoUri = headerData?.avatarUrl ?? null;
  const childInitials = headerData?.initials ?? "أ";

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
            {/* Filter button */}
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.orbContainer}>
            {/* pulsing glow halo behind the orb */}
            <Animated.View
              style={[styles.orbPulseGlow, { opacity: glowOpacity, transform: [{ scale }] }]}
            />
            {/* the old SVG orb, slowly spinning + breathing */}
            <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
              <AiOrb size={150} />
            </Animated.View>
            {/* teacher photo fixed in the center */}
            <View style={styles.orbTeacher}>
              <Image source={TEACHER_PHOTO} style={styles.orbTeacherImg} resizeMode="cover" />
            </View>
          </View>

          <View style={styles.greetingBubble}>
            <Text style={styles.heroGreeting}>Hi! How can I help you?</Text>
          </View>

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

        {/* Prompts row */}
        <View style={styles.promptsRow}>
          <View style={styles.promptsLeft}>
            <Ionicons name="flash" size={14} color={COLORS.orange} />
            <Text style={styles.promptsText}>Ask admin for any problem</Text>
          </View>
          <Text style={styles.poweredText}>(micro or any tech issue)</Text>
        </View>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything.."
            placeholderTextColor={COLORS.muted}
            editable={false}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Pills */}
        <ScrollView
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
        </ScrollView>

       

        {/* Meeting details — group session summary */}
        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <View style={[styles.detailTitleDot, { backgroundColor: GROUP_SESSION_DETAIL.accent }]} />
            <Text style={styles.detailTitle}>Meeting Details</Text>
          </View>

          <View style={styles.detailCard}>
            {/* Subject + sessions + time pills */}
            <View style={styles.cardSubjectPillRow}>
              <View
                style={[
                  styles.cardSubjectPill,
                  { backgroundColor: `${GROUP_SESSION_DETAIL.accent}18`, borderColor: `${GROUP_SESSION_DETAIL.accent}35` },
                ]}
              >
                <Ionicons name="book-outline" size={12} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={[styles.cardSubjectPillText, { color: GROUP_SESSION_DETAIL.accent }]}>{GROUP_SESSION_DETAIL.subject}</Text>
              </View>
              <View
                style={[
                  styles.cardSubjectPill,
                  { backgroundColor: `${GROUP_SESSION_DETAIL.accent}12`, borderColor: `${GROUP_SESSION_DETAIL.accent}30` },
                ]}
              >
                <Ionicons name="calendar-outline" size={12} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={[styles.cardSubjectPillText, { color: GROUP_SESSION_DETAIL.accent }]}>{GROUP_SESSION_DETAIL.sessionsCount} séances/mois</Text>
              </View>
              <View
                style={[
                  styles.cardSubjectPill,
                  { backgroundColor: `${GROUP_SESSION_DETAIL.accent}12`, borderColor: `${GROUP_SESSION_DETAIL.accent}30` },
                ]}
              >
                <Ionicons name="time-outline" size={12} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={[styles.cardSubjectPillText, { color: GROUP_SESSION_DETAIL.accent }]}>{GROUP_SESSION_DETAIL.time}</Text>
              </View>
            </View>

            {/* Groups count + days per week */}
            <View style={styles.sessionTopRow}>
              <View style={styles.groupPill}>
                <Ionicons name="people" size={14} color={GROUP_SESSION_DETAIL.accent} />
                <Text style={styles.groupPillText}>{GROUP_SESSION_DETAIL.groupsCount} groupes</Text>
              </View>
              <Text style={styles.sessionFreq}>{GROUP_SESSION_DETAIL.daysPerWeek} jours/semaine</Text>
            </View>

            {/* Day pills */}
            <View style={styles.dayPillsRow}>
              {GROUP_SESSION_DETAIL.days.map((day, i) => (
                <View key={i} style={[styles.dayPill, day.active ? styles.dayPillActive : styles.dayPillOff]}>
                  <Text style={[styles.dayPillText, day.active ? styles.dayPillTextActive : styles.dayPillTextOff]}>{day.label}</Text>
                </View>
              ))}
            </View>

            {/* Reserved children */}
            <View style={styles.reserveRow}>
              <View style={styles.avatarStack}>
                {RESERVED_CHILDREN.map((src, i) => (
                  <Image key={i} source={src} style={[styles.reserveAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: RESERVED_CHILDREN.length - i }]} />
                ))}
              </View>
              <Text style={styles.reserveText}>{RESERVED_CHILDREN.length} enfants réservés</Text>
            </View>

            {/* Places progress */}
            <View style={styles.placesBar}>
              <View
                style={[
                  styles.placesFill,
                  { width: `${((GROUP_SESSION_DETAIL.placesTotal - GROUP_SESSION_DETAIL.placesLeft) / GROUP_SESSION_DETAIL.placesTotal) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.placesCaption}>
              {GROUP_SESSION_DETAIL.placesTotal - GROUP_SESSION_DETAIL.placesLeft}/{GROUP_SESSION_DETAIL.placesTotal} places réservées
            </Text>

            {/* Price */}
            <View style={styles.detailPriceRow}>
              <Text style={styles.detailPriceValue}>80 DT</Text>
              <Text style={styles.detailPriceUnit}>/mois</Text>
            </View>
          </View>
        </View>

         {/* Roadmap */}
        <View style={styles.roadmapSection}>
          <View style={styles.roadmapHeader}>
            <Text style={styles.roadmapTitle}>Roadmap</Text>
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

          {/* Gantt chart */}
          <View style={styles.ganttContainer}>
            {GANTT_ROWS.map((row) => (
              <View key={row.id} style={styles.ganttRow}>
                {/* Label col */}
                <View style={styles.ganttLabelCol}>
                  <View
                    style={[
                      styles.ganttDot,
                      row.active && { backgroundColor: COLORS.orange },
                    ]}
                  >
                    {row.iconLib === "ion" ? (
                      <Ionicons name={row.icon as any} size={14} color="#FFFFFF" />
                    ) : (
                      <MaterialCommunityIcons name={row.icon as any} size={14} color="#FFFFFF" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.ganttLabel,
                      row.active && { color: COLORS.orange, fontWeight: "800" },
                    ]}
                    numberOfLines={1}
                  >
                    {row.label}
                  </Text>
                </View>

                {/* Bar area */}
                <View style={styles.ganttBarArea}>
                  <View
                    style={[
                      styles.ganttBar,
                      {
                        left: `${row.barLeft * 100}%` as any,
                        width: `${row.barWidth * 100}%` as any,
                        backgroundColor: row.barColor,
                        borderWidth: row.active ? 0 : 1,
                        borderColor: row.barBorder,
                      },
                    ]}
                  >
                    {row.active && (
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>
                        {row.label}
                      </Text>
                    )}
                  </View>

                  {/* Progress badge — pinned to the "today" line */}
                  {row.progress && (
                    <View style={[styles.progressBadge, { left: `${TODAY_FRAC * 100}%` as any }]}>
                      <Text style={styles.progressText}>{row.progress}</Text>
                    </View>
                  )}

                  {/* Avatar on bar — sits on the "today" line */}
                  {row.avatar && (
                    <View
                      style={[
                        styles.ganttAvatar,
                        {
                          left: `${TODAY_FRAC * 100}%` as any,
                          marginLeft: -14,
                          backgroundColor: row.avatar.color,
                        },
                      ]}
                    />
                  )}
                </View>
              </View>
            ))}

            {/* Timeline */}
            <View style={styles.timeline}>
              {DAYS.map((day) => (
                <View key={day} style={styles.timelineDay}>
                  {day === ACTIVE_DAY && <View style={styles.timelineLine} />}
                  <Text
                    style={[
                      styles.timelineDayText,
                      day === ACTIVE_DAY && styles.timelineDayActive,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
