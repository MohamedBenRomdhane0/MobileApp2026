import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import { useHomeCardEntrance } from "@hooks/useHomeCardMotion";
import type { SummaryCardProps } from "../HomeScreen.type";

const CARD_INDEX = 7;
const PULSE_DURATION = 1200;

export default function SummaryCard({
  title,
  meta,
  teacherPhoto,
  liveLabel,
  joinLabel,
  isLive,
  startTimeLabel,
  nextSessionDate,
  participants,
  hasReservedMeeting,
  reserveLabel,
  onJoin,
  onReserve,
  styles,
  palette,
  isRTL,
}: SummaryCardProps) {
  const { opacity, translateY } = useHomeCardEntrance(CARD_INDEX);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasReservedMeeting) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: PULSE_DURATION / 2,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: PULSE_DURATION / 2,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, hasReservedMeeting]);

  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  // ── No reserved meeting → Reserve CTA ──────────────────────────
  if (!hasReservedMeeting) {
    return (
      <Animated.View
        style={[
          styles.summaryCard,
          { opacity, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.liveGlow} pointerEvents="none" />
        <View style={styles.liveRail} pointerEvents="none" />

        <View style={styles.summaryTopRow}>
          <View style={[styles.summaryTeacherPhoto, { backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" }]}>
            <Ionicons name="calendar-outline" size={22} color="rgba(255,255,255,0.5)" />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {meta || title}
            </Text>
            <View style={styles.summaryMetaRow}>
              <Ionicons name="alert-circle-outline" size={11} color="rgba(255,255,255,0.5)" />
              <Text style={styles.summaryMeta} numberOfLines={1}>
                Aucune séance réservée
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.pendingBadge, { backgroundColor: "rgba(34,190,200,0.18)", borderColor: "rgba(34,190,200,0.35)" }]}>
          <Ionicons name="add-circle-outline" size={12} color="#5EEAD4" />
          <Text style={[styles.pendingBadgeText, { color: "#5EEAD4" }]}>
            {reserveLabel || "Réserver une séance"}
          </Text>
        </View>

        <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle}>{title}</Text>
        </View>

        <View style={styles.liveBottomRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.liveJoinBtn}
            onPress={onReserve}
            accessibilityRole="button"
            accessibilityLabel={reserveLabel || "Réserver"}
          >
            <View style={[styles.summaryJoinInner, { backgroundColor: "#12A9B4" }]}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
              <Text style={styles.liveJoinText}>{reserveLabel || "Réserver"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ── Has reserved meeting → Live / Pending ──────────────────────
  return (
    <Animated.View
      style={[
        styles.summaryCard,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.liveGlow} pointerEvents="none" />
      <View style={styles.liveRail} pointerEvents="none" />

      <View style={styles.summaryTopRow}>
        <Image source={teacherPhoto} style={styles.summaryTeacherPhoto} />
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle} numberOfLines={1}>
            {meta}
          </Text>
          <View style={styles.summaryMetaRow}>
            <Ionicons
              name="person-outline"
              size={11}
              color="rgba(255,255,255,0.6)"
            />
            <Text style={styles.summaryMeta} numberOfLines={1}>
              {participants} {participants === 1 ? "participant" : "participants"}
            </Text>
          </View>
        </View>
      </View>

      {isLive ? (
        <View style={styles.liveBadge}>
          <View>
            <Animated.View
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: palette.live,
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              }}
            />
            <View style={styles.liveDot} />
          </View>
          <Text style={styles.liveBadgeText}>{liveLabel}</Text>
        </View>
      ) : (
        <View style={styles.pendingBadge}>
          <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
          <Text style={styles.pendingBadgeText}>
            {nextSessionDate ? `${nextSessionDate} · ${startTimeLabel}` : startTimeLabel}
          </Text>
        </View>
      )}

      <View style={styles.summaryInfo}>
        <Text style={styles.summaryTitle}>{title}</Text>
      </View>

      <View style={styles.liveBottomRow}>
        {isLive ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.liveJoinBtn}
            onPress={onJoin}
            accessibilityRole="button"
            accessibilityLabel={joinLabel}
          >
            <View style={styles.summaryJoinInner}>
              <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={14} color="#FFFFFF" />
              <Text style={styles.liveJoinText}>{joinLabel}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.pendingTimeRow}>
            <Ionicons name="calendar-outline" size={13} color="#5EEAD4" />
            <Text style={styles.pendingTimeText}>
              {nextSessionDate ? `${nextSessionDate} · ${startTimeLabel}` : startTimeLabel}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
