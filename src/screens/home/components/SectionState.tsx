import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { SectionStateProps } from "@screens/home/HomeScreen.type";

const SKELETON_CARDS = [0, 1, 2, 3];
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/**
 * Shared loading / error / empty placeholder for every data-driven section,
 * so all three states look the same wherever they appear.
 */
export default function SectionState({
  styles,
  palette,
  status,
  message,
  onRetry,
}: SectionStateProps) {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (status !== "loading") return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 620,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 620,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse, status]);

  if (status === "loading") {
    return (
      <View style={styles.skeletonRow}>
        {SKELETON_CARDS.map((i) => (
          <Animated.View key={i} style={[styles.skeletonCard, { opacity: pulse }]} />
        ))}
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.stateWrap}>
        {onRetry ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onRetry}
            hitSlop={HIT_SLOP}
            style={styles.stateRetryBtn}
            accessibilityRole="button"
            accessibilityLabel={message}
          >
            <Ionicons name="refresh" size={14} color={palette.teal} />
            <Text style={styles.stateRetryText}>{message}</Text>
          </TouchableOpacity>
        ) : (
          !!message && <Text style={styles.stateText}>{message}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.stateWrap}>
      <Ionicons name="file-tray-outline" size={22} color={palette.muted} />
      {!!message && <Text style={styles.stateText}>{message}</Text>}
    </View>
  );
}
