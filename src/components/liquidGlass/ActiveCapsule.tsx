import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  interpolate,
  type SharedValue,
} from "react-native-reanimated";
import { LIQUID } from "@styles/liquidTheme";

interface ActiveCapsuleProps {
  /** Left offset of the capsule, already spring-animated by the parent. */
  translateX: SharedValue<number>;
  /** 0 at rest, 1 mid-travel — drives the liquid stretch/squash. */
  stretch: SharedValue<number>;
  width: number;
  height?: number;
}

/**
 * The blob of liquid that follows the active tab. It stretches along its
 * direction of travel and squashes vertically, the way a droplet would.
 */
function ActiveCapsule({
  translateX,
  stretch,
  width,
  height = LIQUID.indicatorHeight,
}: ActiveCapsuleProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: interpolate(stretch.value, [0, 1], [1, 1.3]) },
      { scaleY: interpolate(stretch.value, [0, 1], [1, 0.86]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.capsule,
        { width, height, borderRadius: height / 2, top: (LIQUID.barHeight - height) / 2 },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      {/* Diffuse halo (bar clips shadows, so the glow is drawn as layers) */}
      <View
        style={[
          styles.halo,
          { borderRadius: height / 2, backgroundColor: "rgba(34,190,200,0.10)" },
        ]}
      />
      <View
        style={[
          styles.haloInner,
          { borderRadius: height / 2, backgroundColor: "rgba(34,190,200,0.14)" },
        ]}
      />

      {/* Liquid body */}
      <LinearGradient
        colors={["rgba(34,190,200,0.34)", "rgba(34,190,200,0.16)"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: height / 2 }]}
      />

      {/* Rim */}
      <View
        style={[
          styles.rim,
          { borderRadius: height / 2, borderColor: "rgba(255,255,255,0.45)" },
        ]}
      />

      {/* Specular cap */}
      <LinearGradient
        colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gloss}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    position: "absolute",
    left: 0,
    overflow: "visible",
  },
  halo: {
    position: "absolute",
    top: -7,
    bottom: -7,
    left: -7,
    right: -7,
  },
  haloInner: {
    position: "absolute",
    top: -3,
    bottom: -3,
    left: -3,
    right: -3,
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  gloss: {
    position: "absolute",
    top: 3,
    left: 10,
    right: 10,
    height: 14,
    borderRadius: 8,
  },
});

export default React.memo(ActiveCapsule);
