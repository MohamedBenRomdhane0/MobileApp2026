import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  type SharedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { LIQUID } from "@styles/liquidTheme";

interface FloatingActionButtonProps {
  onPress: () => void;
  /** 0 = closed (cyan, grid icon), 1 = open (white glass, X icon). */
  progress: SharedValue<number>;
  isOpen: boolean;
}

const SIZE = LIQUID.fabSize;

/**
 * The center control. At rest it is a solid drop of cyan liquid that breathes;
 * when the quick-action menu opens it inverts into clear glass with a cross.
 */
function FloatingActionButton({
  onPress,
  progress,
  isOpen,
}: FloatingActionButtonProps) {
  const press = useSharedValue(1);
  const ripple = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [breathe]);

  const handlePressIn = () => {
    press.value = withSpring(LIQUID.fabPressScale, {
      damping: 15,
      stiffness: 460,
      mass: 0.7,
    });
    ripple.value = 0;
    ripple.value = withTiming(1, {
      duration: 480,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    // Overshoot on release so the drop feels elastic.
    press.value = withSpring(1, { damping: 9, stiffness: 240, mass: 0.7 });
  };

  const shellStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: press.value * interpolate(breathe.value, [0, 1], [1, 1.025]) },
    ],
    shadowOpacity: interpolate(
      breathe.value,
      [0, 1],
      [0.34, 0.5]
    ),
    shadowRadius: interpolate(breathe.value, [0, 1], [14, 20]),
  }));

  const cyanFillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));

  const glassFillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ripple.value, [0, 0.25, 1], [0, 0.42, 0]),
    transform: [{ scale: interpolate(ripple.value, [0, 1], [0.4, 1.9]) }],
  }));

  // The two icons cross-rotate through each other.
  const openIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.45], [1, 0], "clamp"),
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 90])}deg` },
      { scale: interpolate(progress.value, [0, 1], [1, 0.5]) },
    ],
  }));

  const closeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1], "clamp"),
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [-90, 0])}deg` },
      { scale: interpolate(progress.value, [0, 1], [0.5, 1]) },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.04]) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      accessibilityLabel={isOpen ? "Fermer le menu rapide" : "Ouvrir le menu rapide"}
    >
      <Animated.View style={[styles.shell, shellStyle]}>
        {/* Soft halo — gives the drop depth even where elevation can't draw */}
        <View style={styles.haloOuter} pointerEvents="none" />
        <View style={styles.haloInner} pointerEvents="none" />

        <View style={styles.clip}>
          {/* Glass state (menu open) */}
          <Animated.View style={[StyleSheet.absoluteFill, glassFillStyle]}>
            <BlurView
              intensity={60}
              tint="light"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.glassTint} />
          </Animated.View>

          {/* Cyan liquid state (menu closed) */}
          <Animated.View style={[StyleSheet.absoluteFill, cyanFillStyle]}>
            <LinearGradient
              colors={["#9f3fdf", LIQUID.cyanColor, LIQUID.cyanDeep]}
              locations={[0, 0.5, 1]}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Specular cap — sells the "drop of liquid" read */}
          <LinearGradient
            colors={["rgba(255,255,255,0.62)", "rgba(255,255,255,0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gloss}
            pointerEvents="none"
          />

          {/* Touch ripple */}
          <Animated.View style={[styles.ripple, rippleStyle]} pointerEvents="none" />
        </View>

        {/* Rim light */}
        <Animated.View style={[styles.ring, ringStyle]} pointerEvents="none" />

        {/* Icons */}
        <Animated.View style={[styles.icon, openIconStyle]} pointerEvents="none">
          <Ionicons name="apps" size={25} color="#FFFFFF" />
        </Animated.View>
        <Animated.View style={[styles.icon, closeIconStyle]} pointerEvents="none">
          <Ionicons name="close" size={29} color={LIQUID.cyanDeep} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: LIQUID.cyanDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: "transparent",
  },
  haloOuter: {
    position: "absolute",
    top: -10,
    bottom: -10,
    left: -10,
    right: -10,
    borderRadius: SIZE / 2 + 10,
    backgroundColor: "rgba(34,190,200,0.12)",
  },
  haloInner: {
    position: "absolute",
    top: -5,
    bottom: -5,
    left: -5,
    right: -5,
    borderRadius: SIZE / 2 + 5,
    backgroundColor: "rgba(34,190,200,0.16)",
  },
  clip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SIZE / 2,
    overflow: "hidden",
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.68)",
  },
  gloss: {
    position: "absolute",
    top: 4,
    left: 12,
    right: 12,
    height: SIZE * 0.4,
    borderRadius: SIZE / 2,
  },
  ripple: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SIZE / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.55)",
  },
  icon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(FloatingActionButton);
