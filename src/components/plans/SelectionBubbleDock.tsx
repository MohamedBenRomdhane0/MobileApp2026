import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

import { CTA_GRADIENT } from "@screens/plans/PlansScreen.constants";
import type { PlansScreenStyles } from "@screens/plans/PlansScreen.styles";
import type { getPlansPalette } from "@screens/plans/PlansScreen.styles";
import { getLiquidBarReserved } from "@utils/helpers/liquidBar.helpers";

export type SelectionBubble = {
  id: string;
  kind: "teacher" | "book";
  label: string;
  source: ImageSourcePropType | null;
  fallback: string;
  onRemove: () => void;
};

interface Props {
  bubbles:      SelectionBubble[];
  totalLabel:   string;
  periodHint:   string;
  ctaLabel:     string;
  ctaEnabled:   boolean;
  helperText?:  string;
  shakeTick:    number;
  onSubscribe:  () => void;
  isRTL:        boolean;
  bottomInset:  number;
  styles:       PlansScreenStyles;
  palette:      ReturnType<typeof getPlansPalette>;
}

export function SelectionBubbleDock({
  bubbles,
  totalLabel,
  periodHint,
  ctaLabel,
  ctaEnabled,
  helperText,
  shakeTick,
  onSubscribe,
  isRTL,
  bottomInset,
  styles,
  palette,
}: Props) {
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (shakeTick === 0) return;
    shakeX.value = withSequence(
      withTiming(-10, { duration: 40 }),
      withTiming(10, { duration: 40 }),
      withTiming(-6, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  }, [shakeTick, shakeX]);

  const ctaShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(280)}
      exiting={FadeOutDown.duration(160)}
      style={[styles.dock, { bottom: getLiquidBarReserved(bottomInset) + 12 }]}
    >
      {bubbles.length > 0 ? (
        <View style={styles.dockBubbles}>
          {bubbles.map((bubble) => (
            <Animated.View
              key={bubble.id}
              entering={ZoomIn.springify().damping(16).stiffness(150)}
              exiting={ZoomOut.duration(120)}
              style={styles.dockBubble}
            >
              {bubble.source ? (
                <Image source={bubble.source} style={styles.dockBubbleAvatar} />
              ) : (
                <Text style={styles.dockBubbleFallback}>{bubble.fallback}</Text>
              )}

              <Text style={styles.dockBubbleLabel} numberOfLines={1}>
                {bubble.label}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={bubble.onRemove}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.dockBubbleRemove}
              >
                <Ionicons name="close" size={10} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      ) : null}

      <View style={styles.dockFooter}>
        <View style={styles.dockPrice}>
          <Text style={styles.dockPriceValue} numberOfLines={1}>
            {totalLabel}
          </Text>
          {!!periodHint && (
            <Text style={styles.dockPeriodHint} numberOfLines={1}>
              {periodHint}
            </Text>
          )}
        </View>

        <Animated.View style={[styles.dockCtaWrap, ctaShakeStyle]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onSubscribe}
            style={[styles.dockCta, !ctaEnabled && styles.ctaDisabled]}
          >
            <LinearGradient
              colors={[...CTA_GRADIENT]}
              style={styles.dockCtaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="sparkles" size={15} color="#FFFFFF" />
              <Text style={styles.dockCtaText}>{ctaLabel}</Text>
              <Ionicons
                name={isRTL ? "arrow-back" : "arrow-forward"}
                size={15}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {!!helperText && (
        <View style={styles.dockHelper}>
          <Ionicons
            name="information-circle-outline"
            size={13}
            color={palette.muted}
          />
          <Text style={styles.dockHelperText}>{helperText}</Text>
        </View>
      )}
    </Animated.View>
  );
}
