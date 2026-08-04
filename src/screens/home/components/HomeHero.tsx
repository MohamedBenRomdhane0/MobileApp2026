import React from "react";
import { View, Text, TouchableOpacity, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LanguageSwitcher from "@components/header/LanguageSwitcher";
import { HOME_TOKENS, HERO_EMOJIS } from "@screens/home/HomeScreen.constants";
import {
  useHomeCardEntrance,
  useHomeCardPress,
} from "@hooks/useHomeCardMotion";
import type { HomeHeroProps } from "@screens/home/HomeScreen.type";

/** One circular glass reaction button with a press-scale animation. */
function EmojiButton({
  emoji,
  index,
  styles,
}: {
  emoji: string;
  index: number;
  styles: HomeHeroProps["styles"];
}) {
  const entrance = useHomeCardEntrance(index);
  const press = useHomeCardPress();

  return (
    <Animated.View
      style={{
        opacity: entrance.opacity,
        transform: [
          { translateY: entrance.translateY },
          { scale: press.scale },
        ],
      }}
    >
      <Pressable
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        accessibilityRole="button"
        hitSlop={4}
      >
        <BlurView intensity={16} tint="light" style={styles.emojiBtn}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Curved navy hero: top row (avatar, glass search, language, notifications),
 * a daily-streak pill, a right-aligned greeting (welcome-back + child name)
 * and a glass row of circular emoji reactions.
 */
export default function HomeHero({
  styles,
  isRTL,
  isDark,
  childName,
  levelLabel,
  topInset,
  notificationsLabel,
  onNotifications,
  onSearch,
  onStreak,
}: HomeHeroProps) {
  const { t } = useTranslation();
  const streakPress = useHomeCardPress();

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

        {/* Top row */}
        <View style={styles.heroTopRow}>
          <ActiveChildHeaderAvatar />
          {/* Daily streak pill — opens the wallet sheet on tap */}
          <Animated.View
            style={{ marginTop: 4, transform: [{ scale: streakPress.scale }] }}
          >
            <Pressable
              onPressIn={streakPress.onPressIn}
              onPressOut={streakPress.onPressOut}
              onPress={onStreak}
              accessibilityRole="button"
              accessibilityLabel={t("home.streak_label")}
              hitSlop={4}
            >
              <LinearGradient
                colors={HOME_TOKENS.streakGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.streakPill}
              >
                <Text style={styles.streakText}>{t("home.streak_label")}</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
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

       

        {/* Greeting section */}
        <View style={styles.greetingWrap}>
          <Text style={styles.greetingSub} numberOfLines={1}>
            {t("home.welcome_back")}
          </Text>
          <Text style={styles.greetingName} numberOfLines={1}>
            {childName || t("home.hello_default")}
          </Text>

          <View style={styles.levelChip}>
            <Ionicons name="school-outline" size={11} color="rgba(255,255,255,0.92)" />
            <Text style={styles.levelChipText} numberOfLines={1}>
              {levelLabel}
            </Text>
          </View>
        </View>

        {/* Emoji quick actions */}
        <BlurView intensity={18} tint="dark" style={styles.emojiGlass}>
          {HERO_EMOJIS.map((emoji, index) => (
            <EmojiButton key={emoji} emoji={emoji} index={index} styles={styles} />
          ))}
        </BlurView>
      </LinearGradient>
    </View>
  );
}
