import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Line } from "react-native-svg";

import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import type { DiscoveryModeCardProps } from "@screens/home/HomeScreen.type";

const CHART_COLOR_TEAL = "#22BEC8";
const CHART_COLOR_GOLD = "#F6C445";

/** One milestone bubble + caption, animating in with a staggered rise. */
function Milestone({
  index,
  milestone,
  styles,
}: {
  index: number;
  milestone: { pct: `${number}%`; label: string; stepLabel: string };
  styles: DiscoveryModeCardProps["styles"];
}) {
  const entrance = useHomeCardEntrance(index, 8);
  return (
    <Animated.View
      style={[
        styles.discoveryMilestone,
        {
          left: milestone.pct,
          opacity: entrance.opacity,
          transform: [{ translateY: entrance.translateY }],
        },
      ]}
    >
      <View style={styles.discoveryChartNode}>
        <Text style={styles.discoveryChartNodeText}>{milestone.label}</Text>
      </View>
      <Text style={styles.discoveryChartCaption} numberOfLines={2}>
        {milestone.stepLabel}
      </Text>
    </Animated.View>
  );
}

/**
 * Hero stand-in for discovery (unauthenticated) mode. One timeline:
 * 1 → 2 → 3 milestones climbing to a gold "saved" finish node that pulses.
 * Finishing the account saves the child's progress — that's the thesis.
 */
export default function DiscoveryModeCard({
  styles,
  isRTL,
  isDark,
  titleLabel,
  subtitleLabel,
  ctaLabel,
  onPress,
}: DiscoveryModeCardProps) {
  const { t } = useTranslation();
  const gradientColors = isDark
    ? HOME_TOKENS.heroGradientDark
    : HOME_TOKENS.heroGradientLight;

  const entrance = useHomeCardEntrance(0, 14);
  const press = useHomeCardPress();
  const finishEntrance = useHomeCardEntrance(3, 8);

  const pulse = useRef(new Animated.Value(0)).current;
  const tapBurst = useRef(new Animated.Value(0)).current;

  /* Extra pulse for the finish node when the timeline is tapped. */
  const onTimelinePress = () => {
    press.onPressIn();
    tapBurst.setValue(0);
    Animated.sequence([
      Animated.timing(tapBurst, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.delay(40),
      Animated.timing(tapBurst, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const goldGlow = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const goldOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });
  const tapScale = press.scale;
  const burstScale = tapBurst.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.9],
  });
  const burstOpacity = tapBurst.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 0],
  });

  /* Milestone positions along the line (percent from the start). */
  const milestones = [
    { pct: "10%", label: "1", stepLabel: t("home.discovery_step_1") },
    { pct: "38%", label: "2", stepLabel: t("home.discovery_step_2") },
    { pct: "66%", label: "3", stepLabel: t("home.discovery_step_3") },
  ] as const;

  return (
    <Animated.View
      style={[
        styles.discoveryCard,
        {
          opacity: entrance.opacity,
          transform: [{ translateY: entrance.translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.08, y: 0.05 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.discoveryShell}
      >
        <View style={styles.discoveryGlow} pointerEvents="none" />
        <View style={styles.discoveryGlowAlt} pointerEvents="none" />

        <View style={styles.discoveryContent}>
          <View style={styles.discoveryBadge}>
            <Ionicons name="sparkles" size={13} color={CHART_COLOR_TEAL} />
            <Text style={styles.discoveryBadgeText}>{titleLabel}</Text>
          </View>

          <Text style={styles.discoveryTitle}>{subtitleLabel}</Text>

          {/* Timeline: 1 → 2 → 3 → gold finish, one line. */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={onTimelinePress}
            onPressOut={press.onPressOut}
            style={styles.discoveryChartTouch}
            accessibilityRole="button"
            accessibilityLabel={t("home.discovery_steps_title")}
          >
            <Animated.View style={{ transform: [{ scale: tapScale }] }}>
              <View style={styles.discoveryChart}>
                <Svg width="100%" height="100%" viewBox="0 0 260 44">
                  <Defs>
                    <SvgLinearGradient id="discLine" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor={CHART_COLOR_TEAL} stopOpacity="0.9" />
                      <Stop offset="0.82" stopColor={CHART_COLOR_TEAL} stopOpacity="0.55" />
                      <Stop offset="1" stopColor={CHART_COLOR_GOLD} stopOpacity="0.9" />
                    </SvgLinearGradient>
                  </Defs>

                  {/* Track behind the visible line (soft). */}
                  <Line
                    x1="14"
                    y1="15"
                    x2="246"
                    y2="15"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Progress line, teal climbing to gold at the finish. */}
                  <Line
                    x1="14"
                    y1="15"
                    x2="246"
                    y2="15"
                    stroke="url(#discLine)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </Svg>

                {/* Numbered milestone bubbles sitting on the line, caption below. */}
                {milestones.map((m, index) => (
                  <Milestone
                    key={m.label}
                    index={index}
                    milestone={m}
                    styles={styles}
                  />
                ))}

                {/* Gold "saved" finish node at the line's end — pulsing glow + tap burst. */}
                <Animated.View
                  style={[
                    styles.discoveryFinishWrap,
                    {
                      left: "90%" as const,
                      opacity: finishEntrance.opacity,
                      transform: [{ translateY: finishEntrance.translateY }],
                    },
                  ]}
                >
                  <View style={styles.discoveryFinish}>
                    <Animated.View
                      style={{
                        position: "absolute",
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        backgroundColor: CHART_COLOR_GOLD,
                        opacity: goldOpacity,
                        transform: [{ scale: goldGlow }],
                      }}
                    />
                    <Animated.View
                      style={{
                        position: "absolute",
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        borderWidth: 2,
                        borderColor: CHART_COLOR_GOLD,
                        opacity: burstOpacity,
                        transform: [{ scale: burstScale }],
                      }}
                    />
                    <View style={styles.discoveryFinishInner}>
                      <Ionicons name="checkmark" size={15} color="#0F2E57" />
                    </View>
                  </View>
                  <Text style={styles.discoveryFinishCaption}>
                    {t("home.discovery_step_done")}
                  </Text>
                </Animated.View>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: press.scale }] }}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPressIn={press.onPressIn}
              onPressOut={press.onPressOut}
              onPress={onPress}
              style={styles.discoveryCtaOuter}
              accessibilityRole="button"
              accessibilityLabel={ctaLabel}
            >
              <LinearGradient
                colors={HOME_TOKENS.subscribeGradient}
                start={{ x: 1, y: 0.2 }}
                end={{ x: 0, y: 0.95 }}
                style={styles.discoveryCta}
              >
                <Text style={styles.discoveryCtaText} numberOfLines={2}>
                  {ctaLabel}
                </Text>
                <Ionicons
                  name={isRTL ? "arrow-back" : "arrow-forward"}
                  size={16}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}