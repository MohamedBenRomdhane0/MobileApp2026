import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LanguageSwitcher from "@components/header/LanguageSwitcher";
import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import type { HomeHeroProps } from "@screens/home/HomeScreen.type";

/**
 * Curved navy hero: greeting + level chip on one side, language and
 * notifications on the other, with a glass stat strip underneath.
 */
export default function HomeHero({
  styles,
  isRTL,
  isDark,
  greeting,
  levelLabel,
  stats,
  topInset,
  notificationsLabel,
  onNotifications,
}: HomeHeroProps) {
  const { t } = useTranslation();

  const gradientColors = isDark
    ? HOME_TOKENS.heroGradientDark
    : HOME_TOKENS.heroGradientLight;

  return (
    <View style={styles.headerShell}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.08, y: 0.05 }}
        end={{ x: 0.95, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(topInset, 14) }]}
      >
        <View style={styles.headerGlowA} pointerEvents="none" />
        <View style={styles.headerGlowB} pointerEvents="none" />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ActiveChildHeaderAvatar />

            <View style={styles.headerTextWrap}>
              <Text style={styles.hello} numberOfLines={1}>
                {greeting}
              </Text>

              <View style={styles.levelChip}>
                <Ionicons name="school-outline" size={11} color="rgba(255,255,255,0.92)" />
                <Text style={styles.levelChipText} numberOfLines={1}>
                  {levelLabel}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
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

        {stats.length > 0 && (
          <View style={styles.statStrip}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.statTile}>
                <View style={styles.statTileTop}>
                  <Ionicons name={stat.icon} size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
                <Text style={styles.statLabel} numberOfLines={1}>
                  {t(stat.labelKey)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
