import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Easing, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LanguageSwitcher from "@components/header/LanguageSwitcher";
import {
  HOME_TOKENS,
  HERO_EMOJIS,
  HERO_EMOJI_MESSAGES,
  type HeroEmoji,
} from "@screens/home/HomeScreen.constants";
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
  selected,
  onPress,
}: {
  emoji: HeroEmoji;
  index: number;
  styles: HomeHeroProps["styles"];
  selected: boolean;
  onPress: () => void;
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
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        hitSlop={4}
      >
        <BlurView
          intensity={16}
          tint="light"
          style={[styles.emojiBtn, selected && styles.emojiBtnActive]}
        >
          <Text style={styles.emojiText}>{emoji}</Text>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

/** Metallic gold streak pill with a looping shine sweep and pulsing glow. */
function GoldStreakPill({
  label,
  onPress,
  styles,
}: {
  label: string;
  onPress?: () => void;
  styles: HomeHeroProps["styles"];
}) {
  const press = useHomeCardPress();
  const shine = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shineAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(1400),
        Animated.timing(shine, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shine, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    shineAnim.start();
    glowAnim.start();
    return () => {
      shineAnim.stop();
      glowAnim.stop();
    };
  }, [glow, shine]);

  const shineX = shine.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 180],
  });
  const glowRadius = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 18],
  });
  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.85],
  });

  return (
    <Animated.View
      style={{ marginTop: 4, transform: [{ scale: press.scale }] }}
    >
      <Pressable
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={4}
      >
        <Animated.View
          style={{
            borderRadius: 999,
            shadowColor: "#F6C445",
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: glowRadius,
            shadowOpacity: glowOpacity,
          }}
        >
          <LinearGradient
            colors={HOME_TOKENS.streakGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streakPill}
          >
            <Animated.View
              pointerEvents="none"
              style={[styles.streakShine, { transform: [{ translateX: shineX }] }]}
            >
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0)",
                  "rgba(255,255,255,0.5)",
                  "rgba(255,255,255,0)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
            <Text style={styles.streakText}>{label}</Text>
          </LinearGradient>
        </Animated.View>
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
  const [selectedEmoji, setSelectedEmoji] = useState<HeroEmoji | null>(null);
  const motivation = useHomeCardEntrance(0, 10);

  const onEmojiPress = useCallback((emoji: HeroEmoji) => {
    setSelectedEmoji((prev) => (prev === emoji ? null : emoji));
  }, []);

  const message = selectedEmoji ? HERO_EMOJI_MESSAGES[selectedEmoji] : null;

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

       

        {/* Greeting + emoji quick actions on one line */}
        <View style={styles.greetingLine}>
          <View style={styles.greetingWrap}>
            <Text style={styles.greetingSub} numberOfLines={1}>
              {t("home.welcome_back")}
            </Text>
            <View style={styles.greetingNameRow}>
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
          </View>

          <View style={styles.emojiRow}>
            {HERO_EMOJIS.map((emoji, index) => (
              <EmojiButton
                key={emoji}
                emoji={emoji}
                index={index}
                styles={styles}
                selected={selectedEmoji === emoji}
                onPress={() => onEmojiPress(emoji)}
              />
            ))}
          </View>
        </View>

        {/* Motivational message for the selected emoji */}
        {message && selectedEmoji ? (
          <Animated.View
            key={selectedEmoji}
            style={{
              opacity: motivation.opacity,
              transform: [{ translateY: motivation.translateY }],
            }}
          >
            <View style={styles.motivationCard}>
              <Text style={styles.motivationEmoji}>{selectedEmoji}</Text>
              <View style={styles.motivationBody}>
                <Text style={styles.motivationTitle}>
                  {t(message.titleKey)}
                </Text>
                <Text style={styles.motivationText}>{t(message.textKey)}</Text>
              </View>
            </View>
          </Animated.View>
        ) : null}
      </LinearGradient>
    </View>
  );
}
