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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { styles, COLORS } from "./MeetingViewScreen.styles";
import AiOrb from "./AiOrb";

// ── Static data ───────────────────────────────────────────────────────────────
const AVATARS = [
  { id: 1, color: "#F97316" },
  { id: 2, color: "#8B5CF6" },
  { id: 3, color: "#EC4899" },
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={COLORS.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Session</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="menu" size={20} color={COLORS.title} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card — starry gradient + glowing orb (code-built) */}
        <LinearGradient
          colors={["#8E9BF0", "#8B7FE8", "#A78BE0"]}
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
            {/* Stacked avatars */}
            <View style={styles.avatarStack}>
              {AVATARS.map((a, i) => (
                <View
                  key={a.id}
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: a.color,
                      marginLeft: i === 0 ? 0 : -10,
                      zIndex: AVATARS.length - i,
                    },
                  ]}
                />
              ))}
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
            {/* the SVG orb, slowly spinning + breathing */}
            <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
              <AiOrb size={150} />
            </Animated.View>
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
