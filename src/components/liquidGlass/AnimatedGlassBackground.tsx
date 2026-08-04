import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LIQUID } from "@styles/liquidTheme";

function AnimatedGlassBackground({ style }: { style?: object }) {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withTiming(1, { duration: 3000, easing: (t) => t });
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => {
    const tx = interpolate(shimmer.value, [0, 1], [-200, 200]);
    return { transform: [{ translateX: tx }] };
  });

  return (
    <Animated.View style={[styles.container, style]}>
      {/* Base blur layer */}
      <BlurView intensity={LIQUID.backdropBlur} tint="light" style={StyleSheet.absoluteFill} />

      {/* Layer 1: Cyan base tint */}
      <View style={styles.cyanBase} pointerEvents="none" />

      {/* Layer 2: White glass base */}
      <View style={styles.glassBase} pointerEvents="none" />

      {/* Layer 3: Specular highlight edge */}
      <View style={styles.highlightEdge} pointerEvents="none" />

      {/* Layer 4: Moving shimmer (specular reflection) */}
      <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none">
        <View style={styles.shimmerInner} />
      </Animated.View>

      {/* Layer 5: Top glossy edge */}
      <View style={styles.glossyEdge} pointerEvents="none" />

      {/* Layer 6: Subtle noise texture overlay */}
      <View style={styles.noiseOverlay} pointerEvents="none" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: LIQUID.borderRadius,
    overflow: "hidden",
  },
  cyanBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LIQUID.cyanBase,
    borderRadius: LIQUID.borderRadius,
  },
  glassBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LIQUID.glassBase,
    borderRadius: LIQUID.borderRadius,
  },
  highlightEdge: {
    position: "absolute",
    top: 0,
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: LIQUID.glassEdge,
    borderRadius: 1,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 140,
    alignItems: "center",
  },
  shimmerInner: {
    width: 80,
    flex: 1,
    backgroundColor: LIQUID.glassHighlight,
    borderRadius: 999,
    opacity: 0.3,
  },
  glossyEdge: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 1,
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.01)",
    borderRadius: LIQUID.borderRadius,
  },
});

export default AnimatedGlassBackground;