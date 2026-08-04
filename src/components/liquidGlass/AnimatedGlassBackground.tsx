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
    shimmer.value = withTiming(1, { duration: 2000 });
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => {
    const tx = interpolate(shimmer.value, [0, 1], [-200, 200]);
    return {
      transform: [{ translateX: tx }],
    };
  });

  return (
    <Animated.View style={[styles.container, style]}>
      <BlurView intensity={LIQUID.backdropBlur} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.layer1} pointerEvents="none" />

      <View style={styles.layer2} pointerEvents="none" />

      <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none">
        <View style={styles.shimmerInner} />
      </Animated.View>

      <View style={styles.highlightEdge} pointerEvents="none" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: LIQUID.borderRadius,
    overflow: "hidden",
  },
  layer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LIQUID.bg,
    borderRadius: LIQUID.borderRadius,
  },
  layer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: LIQUID.borderRadius,
  },
  highlightEdge: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: LIQUID.highlight,
    borderRadius: 1,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 120,
    alignItems: "center",
  },
  shimmerInner: {
    width: 60,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
  },
});

export default AnimatedGlassBackground;
