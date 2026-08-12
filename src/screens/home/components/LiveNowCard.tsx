import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import type { LiveNowCardProps } from "@screens/home/HomeScreen.type";

const PULSE_DURATION = 1200;

/**
 * Navy "live now" card with a pulsing dot and a join CTA — promoted above
 * the books so the time-sensitive block is never hidden below the fold.
 */
export default function LiveNowCard({
  styles,
  palette,
  isRTL,
  title,
  meta,
  liveLabel,
  joinLabel,
  onJoin,
}: LiveNowCardProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [pulse]);

  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <View style={styles.liveCard}>
      <View style={styles.liveGlow} pointerEvents="none" />
      <View style={styles.liveRail} pointerEvents="none" />

      <View style={styles.liveTopRow}>
        <View style={styles.liveInfo}>
          <Text style={styles.liveTitle} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.liveMetaRow}>
            <Ionicons
              name="people-outline"
              size={12}
              color="rgba(255,255,255,0.6)"
            />
            <Text style={styles.liveMeta} numberOfLines={1}>
              {meta}
            </Text>
          </View>
        </View>

        <View style={styles.liveBadge}>
          <View>
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: palette.live,
                  opacity: glowOpacity,
                  transform: [{ scale: glowScale }],
                },
              ]}
            />
            <View style={styles.liveDot} />
          </View>
          <Text style={styles.liveBadgeText}>{liveLabel}</Text>
        </View>
      </View>

      <View style={styles.liveBottomRow}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.liveJoinBtn}
          onPress={onJoin}
          accessibilityRole="button"
          accessibilityLabel={joinLabel}
        >
          <LinearGradient
            colors={HOME_TOKENS.liveJoinGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.liveJoinInner}
          >
            <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={14} color="#FFFFFF" />
            <Text style={styles.liveJoinText}>{joinLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
