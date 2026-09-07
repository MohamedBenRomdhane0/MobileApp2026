import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LanguageSwitcher from "@components/header/LanguageSwitcher";

import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import type { HomeStyles } from "@screens/home/HomeScreen.type";
import { GoldStreakPill } from "./HomeHero";

export type HomeStickyHeaderProps = {
  styles: HomeStyles;
  isDark: boolean;
  topInset: number;
  notificationsLabel: string;
  onNotifications?: () => void;
  onSearch?: () => void;
  onStreak?: () => void;
};

export default function HomeStickyHeader({
  styles,
  isDark,
  topInset,
  notificationsLabel,
  onNotifications,
  onSearch,
  onStreak,
}: HomeStickyHeaderProps) {
  const { t } = useTranslation();
  const gradientColors = isDark
    ? HOME_TOKENS.heroGradientDark
    : HOME_TOKENS.heroGradientLight;

  return (
    <LinearGradient
      colors={[gradientColors[0], gradientColors[1]]}
      start={{ x: 0.08, y: 0 }}
      end={{ x: 0.95, y: 1 }}
      style={[styles.stickyHeaderGradient, { paddingTop: Math.max(topInset, 14) }]}
    >
      <View style={styles.headerGlowA} pointerEvents="none" />
      <View style={styles.headerGlowB} pointerEvents="none" />
      <View style={styles.heroTopRow}>
        <ActiveChildHeaderAvatar />
        <GoldStreakPill
          label={t("home.streak_label")}
          onPress={onStreak}
          styles={styles}
        />
        <View style={styles.heroTopRight}>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={onSearch}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t("common.search")}
          >
            <Ionicons name="search" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <LanguageSwitcher />
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={onNotifications}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={notificationsLabel}
          >
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            <View style={styles.bellDot} pointerEvents="none" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
