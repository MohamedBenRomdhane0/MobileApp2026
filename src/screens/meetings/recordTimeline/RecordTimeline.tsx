import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedReanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from "react-native-reanimated";

import type { RootStackParamList } from "@config/types/navigation.types";

import {
  WEEKS,
  WAVEFORM_BARS,
  TEACHER_AVATAR,
  TEACHER_NAME,
  SESSION_DATE,
} from "./RecordTimeline.constants";
import { COLORS, RADIUS } from "../recordMeetingSilver/marineTheme";
import { LIQUID } from "@styles/liquidTheme";
import AnimatedGlassBackground from "@components/liquidGlass/AnimatedGlassBackground";
import ActiveCapsule from "@components/liquidGlass/ActiveCapsule";
import LiquidGlassTab from "@components/liquidGlass/LiquidGlassTab";

const { width: SCREEN_W } = Dimensions.get("window");

const VIDEO_H = 320;
const FILMSTRIP_H = 90;
const THUMB_SEEK = 30;
const DAYS_PER_WEEK = 7;
const WEEKS_PER_MONTH = 4;
const MONTHS = ["Juin", "Juil", "Août"];
const RULER_COUNT = MONTHS.length * WEEKS_PER_MONTH * DAYS_PER_WEEK;

interface RulerDay {
  day: number;
  monthIdx: number;
  weekInMonth: number;
  dayInWeek: number;
  label: string | null;
  monthLabel: string | null;
  isToday: boolean;
}

const RULER_DAYS: RulerDay[] = [];
let globalDay = 0;
MONTHS.forEach((month, mIdx) => {
  for (let w = 0; w < WEEKS_PER_MONTH; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const dayNum = globalDay + 1;
      const isWeekStart = d === 0;
      const isMonthStart = w === 0 && d === 0;
      RULER_DAYS.push({
        day: dayNum,
        monthIdx: mIdx,
        weekInMonth: w,
        dayInWeek: d,
        label: isWeekStart ? `W${w + 1}` : null,
        monthLabel: isMonthStart ? month : null,
        isToday: mIdx === 2 && w === 2 && d === 3,
      });
      globalDay++;
    }
  }
});

const thumbCache = new Map<string, string>();

function FilmstripThumb({ uri, index, isActive, onPress }: { uri: string; index: number; isActive: boolean; onPress: () => void }) {
  const [thumbUri, setThumbUri] = useState<string | null>(thumbCache.get(uri) ?? null);
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.95)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;
  const borderWidthAnim = useRef(new Animated.Value(isActive ? 2 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: isActive ? 1 : 0.95, useNativeDriver: true, friction: 8 }),
      Animated.timing(opacityAnim, { toValue: isActive ? 1 : 0.6, duration: 200, useNativeDriver: true }),
    ]).start();
    Animated.timing(borderWidthAnim, { toValue: isActive ? 2 : 0, duration: 200, useNativeDriver: false }).start();
  }, [isActive]);

  useEffect(() => {
    if (thumbCache.has(uri)) return;
    let cancelled = false;
    const timeout = setTimeout(() => {
      VideoThumbnails.getThumbnailAsync(uri, { time: THUMB_SEEK * 1000 })
        .then((result) => {
          if (!cancelled) {
            thumbCache.set(uri, result.uri);
            setThumbUri(result.uri);
          }
        })
        .catch(() => {});
    }, index * 300);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [uri, index]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{ height: FILMSTRIP_H, flex: 1 }}
    >
      <Animated.View
        style={{
          flex: 1,
          overflow: "hidden",
          borderRadius: RADIUS.lg,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            borderRadius: RADIUS.lg,
            borderWidth: borderWidthAnim,
            borderColor: COLORS.primary,
            overflow: "hidden",
          }}
        >
          {thumbUri ? (
            <Image source={{ uri: thumbUri }} style={{ height: "100%", width: "100%" }} resizeMode="cover" />
          ) : (
            <View style={{ height: "100%", width: "100%", backgroundColor: COLORS.muted, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function RecordTimeline() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const rulerRef = useRef<ScrollView>(null);
  const [weekIdx, setWeekIdx] = useState(10);
  const [clipIdx, setClipIdx] = useState(0);
  const [activeDay, setActiveDay] = useState("18/08");
  const [colWidth, setColWidth] = useState(8);

  const toolIndicatorX = useSharedValue(0);
  const toolStretch = useSharedValue(0);
  const [toolActiveIdx, setToolActiveIdx] = useState(0);
  const toolDidPosition = useRef(false);

  useEffect(() => {
    const w = 14;
    setColWidth(w);
    const todayCol = 10 * DAYS_PER_WEEK + 3;
    const offset = todayCol * w - SCREEN_W / 2;
    setTimeout(() => {
      rulerRef.current?.scrollTo({ x: Math.max(0, offset), animated: false });
    }, 50);
  }, []);

  const TOOL_TABS = [
    { name: "Settings" as const, icon: "person-outline" as const, iconFocused: "person" as const, label: "Profil" as const },
    { name: "Home" as const, icon: "home-outline" as const, iconFocused: "home" as const, label: "Accueil" as const },
    { name: "Books" as const, icon: "book-outline" as const, iconFocused: "book" as const, label: "Livres" as const },
    { name: "LearnCalendar" as const, icon: "calendar-outline" as const, iconFocused: "calendar" as const, label: "Live" as const },
  ];

  const toolBarWidth = Math.min(SCREEN_W * LIQUID.barWidthRatio, LIQUID.barMaxWidth) - 32;
  const toolUsable = toolBarWidth - LIQUID.hPadding * 2 - LIQUID.fabSlot;
  const toolSlotW = toolUsable / TOOL_TABS.length;
  const toolHalf = TOOL_TABS.length / 2;
  const toolCenters = TOOL_TABS.map(
    (_, i) =>
      LIQUID.hPadding +
      (i < toolHalf ? 0 : LIQUID.fabSlot) +
      i * toolSlotW +
      toolSlotW / 2
  );
  const toolPillW = Math.min(toolSlotW - 4, LIQUID.indicatorMaxWidth);

  useEffect(() => {
    const target = toolCenters[toolActiveIdx] - toolPillW / 2;
    if (!toolDidPosition.current) {
      toolIndicatorX.value = target;
      toolDidPosition.current = true;
      return;
    }
    toolIndicatorX.value = withSpring(target, LIQUID.spring);
    toolStretch.value = withSequence(
      withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 280, easing: Easing.inOut(Easing.quad) })
    );
  }, [toolActiveIdx]);

  const handleToolPress = (idx: number) => {
    setToolActiveIdx(idx);
    const routeName = TOOL_TABS[idx].name;
    navigation.navigate(routeName as any);
  };

  const week = WEEKS[weekIdx];
  const clip = week.videos[clipIdx] || week.videos[0];

  const player = useVideoPlayer(WEEKS[0].videos[0].uri, (p) => {
    p.loop = false;
    p.muted = false;
    p.volume = 1.0;
    p.currentTime = THUMB_SEEK;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [posterUri, setPosterUri] = useState<string | null>(null);
  const loadedUri = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    VideoThumbnails.getThumbnailAsync(clip.uri, { time: THUMB_SEEK * 1000 })
      .then((res) => { if (!cancelled) setPosterUri(res.uri); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [clip.uri]);

  useEffect(() => {
    const onPlay = player.addListener("playingChange", (e) =>
      setIsPlaying(e.isPlaying),
    );
    const onTime = player.addListener("timeUpdate", (e) =>
      setPosition(e.currentTime),
    );
    const onStatus = player.addListener("statusChange", (e) => {
      if (e.status === "readyToPlay") {
        setIsLoading(false);
        setDuration(player.duration);
      }
      if (e.status === "loading") setIsLoading(true);
    });
    return () => {
      onPlay.remove();
      onTime.remove();
      onStatus.remove();
    };
  }, [player]);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      player.pause();
    } else {
      if (loadedUri.current !== clip.uri) {
        setIsLoading(true);
        await player.replaceAsync(clip.uri);
        loadedUri.current = clip.uri;
      }
      player.play();
    }
  }, [player, isPlaying, clip.uri]);

  const selectClip = useCallback(
    (i: number) => {
      setClipIdx(i);
    },
    [],
  );

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const onRulerScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const x = e.nativeEvent.contentOffset.x;
    const center = x + SCREEN_W / 2;
    const colIdx = Math.round(center / colWidth);
    const clamped = Math.max(0, Math.min(RULER_COUNT - 1, colIdx));
    const rd = RULER_DAYS[clamped];
    const dayNum = clamped + 1;
    const dateStr = `${rd.dayInWeek + 1}/${["Juin", "Juil", "Août"].indexOf(rd.monthLabel ?? MONTHS[rd.monthIdx]) >= 0 ? (6 + rd.monthIdx) : 8}`;
    setActiveDay(rd.monthLabel ?? `${rd.dayInWeek + 1}/${6 + rd.monthIdx}`);
    const newWeek = Math.min(MONTHS.length * WEEKS_PER_MONTH - 1, Math.max(0, Math.floor(clamped / DAYS_PER_WEEK)));
    const monthIdx = Math.floor(newWeek / WEEKS_PER_MONTH);
    const weekInMonth = newWeek % WEEKS_PER_MONTH;
    if (monthIdx !== weekIdx) {
      setWeekIdx(monthIdx);
      setClipIdx(0);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ── Video player ──────────────────────────────────────────── */}
      <View style={{ height: VIDEO_H, width: "100%" }}>
        {posterUri ? (
          <Image
            source={{ uri: posterUri }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.muted }} />
        )}
        {isPlaying && (
          <VideoView
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            player={player}
            fullscreenOptions={{ enable: false }}
            allowsPictureInPicture={false}
            contentFit="cover"
          />
        )}
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "transparent", COLORS.background]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
        {isLoading && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: (insets.top || 44) + 8 }}>
          <TouchableOpacity
            style={{ height: 44, width: 44, borderRadius: 22, backgroundColor: LIQUID.glassBase, borderWidth: 1, borderColor: LIQUID.border, alignItems: "center", justifyContent: "center" }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={18} color={LIQUID.cyanColor} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, borderRadius: LIQUID.borderRadius, backgroundColor: LIQUID.glassBase, borderWidth: 1, borderColor: LIQUID.border, paddingHorizontal: 16, paddingVertical: 10 }}>
            <Ionicons name="resize" size={16} color={LIQUID.cyanColor} />
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#fff" }}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </View>

          <TouchableOpacity style={{ height: 44, width: 44, borderRadius: 22, backgroundColor: LIQUID.glassBase, borderWidth: 1, borderColor: LIQUID.border, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="folder-open" size={18} color={LIQUID.cyanColor} />
          </TouchableOpacity>
        </View>

        <View style={{ position: "absolute", left: 0, right: 0, bottom: 16, alignItems: "center" }}>
          <TouchableOpacity
            style={{ height: LIQUID.fabSize, width: LIQUID.fabSize, borderRadius: LIQUID.fabSize / 2, backgroundColor: LIQUID.cyanColor, alignItems: "center", justifyContent: "center", marginBottom: 10, shadowColor: LIQUID.cyanColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}
            onPress={togglePlay}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: "600", color: COLORS.white, textAlign: "center", lineHeight: 34 }}>
            {clip.title}
          </Text>
          <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
            {week.dateRange}
          </Text>
        </View>
      </View>

      {/* ── Month badge ─────────────────────────────────────────────── */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.secondary, borderRadius: RADIUS.full, paddingHorizontal: 20, paddingVertical: 8 }}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
          <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.foreground }}>
            {week.dateRange}
          </Text>
        </View>
      </View>

      {/* ── Timeline area with full-height white line ─────────────── */}
      <View style={{ flex: 1, position: "relative" }}>

        {/* Scrollable ruler */}
        <View style={{ marginTop: 8, height: 56, overflow: "hidden", paddingHorizontal: 16 }}>
          <ScrollView
            ref={rulerRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onRulerScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              {RULER_DAYS.map((rd, i) => {
                const isLabel = rd.label !== null || rd.monthLabel !== null;
                const isCurrent = rd.isToday;
                return (
                  <View key={i} style={{ width: isLabel ? colWidth * 2.5 : colWidth, alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                    {rd.monthLabel ? (
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.5}
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: COLORS.primary,
                          writingDirection: "ltr",
                        }}
                      >
                        {rd.monthLabel}
                      </Text>
                    ) : rd.label ? (
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.6}
                        style={{
                          fontSize: isCurrent ? 15 : 14,
                          color: isCurrent ? COLORS.foreground : COLORS.mutedForeground,
                          writingDirection: "ltr",
                          fontWeight: isCurrent ? "600" : "400",
                          ...(isCurrent
                            ? {
                                backgroundColor: COLORS.secondary,
                                borderRadius: RADIUS.full,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                overflow: "hidden" as const,
                              }
                            : {}),
                        }}
                      >
                        {isCurrent ? "Today" : rd.label}
                      </Text>
                    ) : null}
                    <View
                      style={{
                        width: 1,
                        borderRadius: 1,
                        height: isLabel ? 14 : 8,
                        backgroundColor: isLabel ? COLORS.mutedForeground : "rgba(163,178,185,0.4)",
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Fixed center playhead */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: SCREEN_W / 2 - 2,
              top: 35,
              bottom: 0,
              width: 4,
              borderRadius: 1,
              backgroundColor: COLORS.white,
              zIndex: 10,
            }}
          />

          {/* Active day label below playhead */}
          <View
            pointerEvents="none"
            style={{ position: "absolute", bottom: -20, left: 0, right: 0, alignItems: "center" }}
          >
            <View style={{ backgroundColor: COLORS.secondary, borderRadius: RADIUS.full, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text numberOfLines={1} style={{ fontSize: 9, fontWeight: "600", color: COLORS.foreground, writingDirection: "ltr" }}>
                {activeDay}
              </Text>
            </View>
          </View>
        </View>

        {/* Track chips */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: RADIUS.lg, backgroundColor: COLORS.secondary, paddingHorizontal: 14, paddingVertical: 14 }}>
              <Image source={TEACHER_AVATAR} style={{ height: 48, width: 48, borderRadius: 24 }} />
              <Text style={{ fontSize: 12, lineHeight: 16, color: COLORS.foreground }}>{TEACHER_NAME}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: RADIUS.lg, backgroundColor: COLORS.muted, paddingHorizontal: 14, paddingVertical: 14 }}>
              <View style={{ height: 36, width: 36, borderRadius: 18, backgroundColor: COLORS.secondary, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="calendar" size={16} color={COLORS.foreground} />
              </View>
              <Text style={{ fontSize: 12, lineHeight: 16, color: COLORS.foreground }}>{SESSION_DATE}</Text>
            </View>
          </View>
        </View>

        {/* Filmstrip */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {week.videos.map((v, i) => (
              <FilmstripThumb
                key={v.id}
                uri={v.uri}
                index={i}
                isActive={i === clipIdx}
                onPress={() => selectClip(i)}
              />
            ))}
          </View>
        </View>

        {/* Meeting list */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.foreground, marginBottom: 8 }}>
            {week.label} — {week.dateRange}
          </Text>
          <View style={{ gap: 6 }}>
            {week.videos.map((v, i) => (
              <TouchableOpacity
                key={v.id}
                onPress={() => selectClip(i)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: RADIUS.lg,
                  backgroundColor: i === clipIdx ? COLORS.secondary : COLORS.muted,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: i === clipIdx ? 1.5 : 0,
                  borderColor: i === clipIdx ? COLORS.primary : "transparent",
                }}
              >
                <Image source={{ uri: posterUri ?? undefined }} style={{ height: 40, width: 40, borderRadius: 8 }} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: "600", color: COLORS.foreground }}>
                    {v.title.replace("\n", " ")}
                  </Text>
                  <Text style={{ fontSize: 11, color: COLORS.mutedForeground, marginTop: 2 }}>
                    {v.date}
                  </Text>
                </View>
                <Ionicons
                  name={i === clipIdx ? "play-circle" : "play-circle-outline"}
                  size={22}
                  color={i === clipIdx ? COLORS.primary : COLORS.mutedForeground}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Full-height white playhead line */}
        
      </View>

      {/* ── Waveform ──────────────────────────────────────────────── */}
      {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 12, borderRadius: RADIUS.lg, backgroundColor: COLORS.secondary, paddingHorizontal: 12, paddingVertical: 10, marginHorizontal: 16, marginTop: 258 }}>
        <View style={{ height: 36, width: 36, borderRadius: 18, backgroundColor: COLORS.muted, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="musical-notes" size={16} color={COLORS.foreground} />
        </View>
        <View style={{ height: 46, flex: 1, flexDirection: "row", alignItems: "center", gap: 2 }}>
          {Array.from({ length: WAVEFORM_BARS }).map((_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 1.7)) * 12;
            return <View key={i} style={{ flex: 1, borderRadius: 2, backgroundColor: "rgba(163,178,185,0.7)", height: h }} />;
          })}
        </View>
      </View> */}

      {/* ── White playhead line (full screen) ─────────────────────── */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: SCREEN_W / 2 - 1,
          top: VIDEO_H + 95,
          bottom:250,
          width: 2,
          borderRadius: 1,
          backgroundColor: COLORS.white,
          zIndex: 10,
        }}
      />

      {/* ── Liquid Glass Bottom Bar ──────────────────────────────── */}
      <View style={{ paddingHorizontal: 16, paddingBottom: (insets.bottom || 20) + 8 }}>
        <View style={{ height: LIQUID.barHeight, borderRadius: LIQUID.borderRadius, shadowColor: LIQUID.shadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.9, shadowRadius: 22, elevation: 14 }}>
          <View style={{ flex: 1, borderRadius: LIQUID.borderRadius, overflow: "hidden" }}>
            <AnimatedGlassBackground width={toolBarWidth} />
            <ActiveCapsule translateX={toolIndicatorX} stretch={toolStretch} width={toolPillW} />
            <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: LIQUID.hPadding }}>
              {TOOL_TABS.map((item, i) => (
                <React.Fragment key={item.label}>
                  {i === 2 && (
                    <View style={{ width: LIQUID.fabSlot, alignItems: "center", justifyContent: "center" }}>
                      <Pressable
                        onPress={togglePlay}
                        style={({ pressed }) => ({
                          height: LIQUID.fabSize,
                          width: LIQUID.fabSize,
                          borderRadius: LIQUID.fabSize / 2,
                          backgroundColor: LIQUID.cyanColor,
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: -LIQUID.fabLift,
                          transform: [{ scale: pressed ? LIQUID.fabPressScale : 1 }],
                          shadowColor: LIQUID.cyanColor,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.5,
                          shadowRadius: 14,
                          elevation: 10,
                        })}
                      >
                        <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="#fff" />
                      </Pressable>
                    </View>
                  )}
                  <LiquidGlassTab
                    item={item as unknown as (typeof LIQUID.tabs)[number]}
                    isActive={toolActiveIdx === i}
                    onPress={() => handleToolPress(i)}
                  />
                </React.Fragment>
              ))}
            </View>
          </View>
          <View style={{ position: "absolute", bottom: 0, left: 24, right: 24, height: 1, backgroundColor: "rgba(14,155,168,0.16)" }} />
        </View>
      </View>
    </View>
  );
}
