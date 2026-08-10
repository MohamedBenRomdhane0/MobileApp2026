import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { DynamicIslandNotificationProps } from "../HomeScreen.type";

const PILL_W = 152;
const PILL_H = 38;
const AUTO_DISMISS_MS = 3500;

export default function DynamicIslandNotification({
  visible,
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
}: DynamicIslandNotificationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    ]).start(() => onDismiss());
  }, [expandAnim, scaleAnim, onDismiss]);

  useEffect(() => {
    if (!visible) {
      scaleAnim.setValue(0);
      expandAnim.setValue(0);
      if (timerRef.current) clearTimeout(timerRef.current);
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

    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, scaleAnim, expandAnim, dismiss]);

  if (!visible) return null;

  const top = topInset + 6;
  const pillWidth = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [38, PILL_W],
  });
  const pillHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [PILL_H, 110],
  });
  const pillRadius = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [999, 24],
  });
  const expandedOpacity = expandAnim;
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
        backgroundColor: "#0F1A2E",
        borderWidth: 1,
        borderColor: "rgba(34,190,200,0.20)",
        overflow: "hidden",
        zIndex: 999,
        shadowColor: "#000",
        shadowOpacity: 0.34,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      }}
    >
      {/* Collapsed pill content */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: PILL_H,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          gap: 8,
          opacity: pillContentOpacity,
        }}
      >
        <Image source={teacherPhoto} style={{ width: 28, height: 28, borderRadius: 999, borderWidth: 1.5, borderColor: "rgba(34,190,200,0.35)" }} />
        <Text
          style={{
            flex: 1,
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: "800",
          }}
          numberOfLines={1}
        >
          {teacherName}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, height: 22, borderRadius: 999, backgroundColor: "rgba(239,68,68,0.22)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" }}>
          <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "#EF4444" }} />
          <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>{liveLabel}</Text>
        </View>
      </Animated.View>

      {/* Expanded content */}
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
          activeOpacity={0.9}
          onPress={onPress}
          style={{ flex: 1 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingTop: 12, gap: 12 }}>
            <Image source={teacherPhoto} style={{ width: 48, height: 48, borderRadius: 999, borderWidth: 2, borderColor: "rgba(34,190,200,0.35)" }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#EF4444", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 }}>
                {liveLabel.toUpperCase()}
              </Text>
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginTop: 2 }} numberOfLines={1}>
                {teacherName}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.60)", fontSize: 12, fontWeight: "600", marginTop: 2 }} numberOfLines={1}>
                {meetingTitle}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingBottom: 12, marginTop: 4 }}>
            <Text style={{ color: "rgba(255,255,255,0.40)", fontSize: 10, fontWeight: "600" }}>
              {timestamp}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 14, height: 30, borderRadius: 999, backgroundColor: "#E11D48" }}>
              <Ionicons name="videocam" size={12} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800" }}>
                {joinLabel}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
