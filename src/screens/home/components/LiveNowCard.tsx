import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

      <View style={styles.liveTopRow}>
        <View style={styles.liveInfo}>
          <Text style={styles.liveTitle} numberOfLines={1}>
            {title}
          </Text>
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
        <Text style={styles.liveMeta} numberOfLines={1}>
          {meta}
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.liveJoinBtn}
          onPress={onJoin}
          accessibilityRole="button"
          accessibilityLabel={joinLabel}
        >
          <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={14} color="#FFFFFF" />
          <Text style={styles.liveJoinText}>{joinLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
