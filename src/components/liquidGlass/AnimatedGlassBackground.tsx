import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withDelay,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { LIQUID } from "@styles/liquidTheme";

interface AnimatedGlassBackgroundProps {
  /** Width of the surface, used to size the travelling specular sweep. */
  width: number;
  radius?: number;
  style?: object;
}

const SWEEP_WIDTH = 130;

/**
 * The refraction stack that makes a surface read as real liquid glass:
 * backdrop blur -> tint -> body gradient -> travelling specular sweep ->
 * rim light. Every layer is non-interactive.
 */
function AnimatedGlassBackground({
  width,
  radius = LIQUID.borderRadius,
  style,
}: AnimatedGlassBackgroundProps) {
  const sweep = useSharedValue(0);

  React.useEffect(() => {
    sweep.value = 0;
    sweep.value = withRepeat(
      withDelay(
        1600,
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [sweep, width]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          sweep.value,
          [0, 1],
          [-SWEEP_WIDTH, width + SWEEP_WIDTH]
        ),
      },
      { rotate: "18deg" },
    ],
    opacity: interpolate(sweep.value, [0, 0.12, 0.85, 1], [0, 1, 1, 0]),
  }));

  return (
    <View style={[styles.container, { borderRadius: radius }, style]} pointerEvents="none">
      {/* 1. Backdrop refraction */}
      <BlurView
        intensity={LIQUID.backdropBlur}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Cyan tint — the liquid itself */}
      <View style={[styles.fill, { backgroundColor: LIQUID.cyanBase }]} />

      {/* 3. Body gradient: brighter at the top, denser at the bottom */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.34)",
          "rgba(255,255,255,0.12)",
          "rgba(34,190,200,0.10)",
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.fill}
      />

      {/* 4. Travelling specular sweep */}
      <Animated.View style={[styles.sweep, sweepStyle]}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.42)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* 5. Rim light along the top edge */}
      <LinearGradient
        colors={["rgba(255,255,255,0.85)", "rgba(255,255,255,0.10)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.rimTop}
      />

      {/* 6. Soft contact shade along the bottom edge */}
      <View style={styles.rimBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  sweep: {
    position: "absolute",
    top: -30,
    bottom: -30,
    left: 0,
    width: SWEEP_WIDTH,
  },
  rimTop: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 1.2,
  },
  rimBottom: {
    position: "absolute",
    bottom: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: "rgba(14,155,168,0.16)",
  },
});

export default React.memo(AnimatedGlassBackground);
