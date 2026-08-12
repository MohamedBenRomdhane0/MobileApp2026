import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import type { SubscribeBannerProps } from "@screens/home/HomeScreen.type";

/**
 * Teal gradient CTA pinned at the bottom of the feed — the monetization
 * hook, kept last so it never interrupts browsing content.
 */
export default function SubscribeBanner({
  styles,
  isRTL,
  title,
  subtitle,
  ctaLabel,
  onPress,
}: SubscribeBannerProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.subscribeOuter}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <LinearGradient
        colors={HOME_TOKENS.subscribeGradient}
        start={{ x: 1, y: 0.2 }}
        end={{ x: 0, y: 0.95 }}
        style={styles.subscribeBanner}
      >
        <View style={styles.subscribeBloom} pointerEvents="none" />
        <View style={styles.subscribeBloomAlt} pointerEvents="none" />

        <View style={styles.subscribeContent}>
          <View style={styles.subscribeTopRow}>
            <View style={styles.subscribeIconTile}>
              <Ionicons name="diamond" size={20} color="#FFFFFF" />
            </View>

            <View style={styles.subscribeTextBlock}>
              <Text style={styles.subscribeTitle} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.subscribeSub} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>
          </View>

          {/* Full-width CTA — the single primary action of the section. */}
          <View style={styles.subscribeBtn}>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.subscribeBtnText}>{ctaLabel}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
