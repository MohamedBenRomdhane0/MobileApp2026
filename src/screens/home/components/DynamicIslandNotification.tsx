import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LIQUID } from "@styles/liquidTheme";

import type { DynamicIslandNotificationProps } from "../HomeScreen.type";

const PILL_W = 320;
const PILL_H = 50;
const EXPANDED_H = 150;
const AUTO_DISMISS_MS = 4000;
const DEFAULT_INTERVAL_MS = 60_000;

export default function DynamicIslandNotification({
  visible: externalVisible,
  teacherPhoto,
  liveLabel,
  teacherName,
  meetingTitle,
  meetingTime,
  joinLabel,
  timestamp,
  onPress,
  onDismiss,
  topInset,
  autoShowIntervalMs,
}: DynamicIslandNotificationProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAuto = Boolean(autoShowIntervalMs);
  const visible = externalVisible || internalVisible;

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 250,
        delay: 80,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setInternalVisible(false);
      onDismiss();
    });
  }, [expandAnim, scaleAnim, onDismiss]);

  /* ── Auto-show cycle ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!isAuto) return;
    const interval = autoShowIntervalMs ?? DEFAULT_INTERVAL_MS;

    intervalTimerRef.current = setInterval(() => {
      setInternalVisible(true);
    }, interval);

    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [isAuto, autoShowIntervalMs]);

  /* ── Animate in/out ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!visible) {
      scaleAnim.setValue(0);
      expandAnim.setValue(0);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      return;
    }

    scaleAnim.setValue(0);
    expandAnim.setValue(0);

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 12,
      useNativeDriver: false,
    }).start(() => {
      Animated.spring(expandAnim, {
        toValue: 1,
        tension: 100,
        friction: 14,
        useNativeDriver: false,
      }).start();
    });

    dismissTimerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [visible, scaleAnim, expandAnim, dismiss]);

  if (!visible) return null;

  const top = topInset + 6;
  const pillWidth = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [44, PILL_W],
  });
  const pillHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [PILL_H, EXPANDED_H],
  });
  const pillRadius = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [999, 28],
  });
  const pillContentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 1, 0],
  });
  const expandedContentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        alignSelf: "center",
        top,
        width: pillWidth,
        height: pillHeight,
        borderRadius: pillRadius,
        backgroundColor: "rgba(34,190,200,0.14)",
        borderWidth: 1,
        borderColor: LIQUID.border,
        overflow: "hidden",
        zIndex: 999,
        shadowColor: LIQUID.shadow,
        shadowOpacity: 0.5,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
      }}
    >
      {/* Glass base layer */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: LIQUID.glassBase,
        }}
      />
      {/* Glass highlight — frosted top */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          borderRadius: 28,
          backgroundColor: LIQUID.glassHighlight,
          opacity: 0.18,
        }}
      />

      {/* ── Collapsed pill ───────────────────────────────────────────── */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: PILL_H,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          gap: 10,
          opacity: pillContentOpacity,
        }}
      >
        <Image
          source={teacherPhoto}
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: LIQUID.border,
          }}
        />
        <Text
          style={{ flex: 1, color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}
          numberOfLines={1}
        >
          {teacherName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 10,
            height: 26,
            borderRadius: 999,
            backgroundColor: "rgba(239,68,68,0.22)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.18)",
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              backgroundColor: "#EF4444",
            }}
          />
          <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}>
            {liveLabel}
          </Text>
        </View>
      </Animated.View>

      {/* ── Expanded card ────────────────────────────────────────────── */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: expandedContentOpacity,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onPress}
          style={{ flex: 1 }}
        >
          {/* Top row: photo + info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 14,
              gap: 14,
            }}
          >
            <Image
              source={teacherPhoto}
              style={{
            width: 60,
            height: 60,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: LIQUID.border,
              }}
            />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 11,
                  fontWeight: "800",
                  letterSpacing: 0.8,
                }}
              >
                {liveLabel.toUpperCase()}
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 17,
                  fontWeight: "900",
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {teacherName}
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 13,
                  fontWeight: "600",
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {meetingTitle}
              </Text>
            </View>
          </View>

          {/* Bottom row: timestamp + join */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingBottom: 14,
              marginTop: 6,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: 11,
                fontWeight: "600",
              }}
            >
              {timestamp}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 16,
                height: 36,
                borderRadius: 999,
                backgroundColor: "#E11D48",
              }}
            >
              <Ionicons name="videocam" size={13} color="#FFFFFF" />
              <Text
                style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "800" }}
              >
                {joinLabel}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
