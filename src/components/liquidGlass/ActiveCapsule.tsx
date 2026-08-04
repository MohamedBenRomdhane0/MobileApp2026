import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { LIQUID } from "@styles/liquidTheme";

interface ActiveCapsuleProps {
  translateX: SharedValue<number>;
}

function ActiveCapsule({ translateX }: ActiveCapsuleProps) {
  const capsuleWidth = useSharedValue(56);
  const capsuleHeight = useSharedValue(44);

  React.useEffect(() => {
    capsuleWidth.value = withSpring(132, LIQUID.spring);
    capsuleHeight.value = withSpring(64, LIQUID.spring);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: capsuleWidth.value,
    height: capsuleHeight.value,
    transform: [{ translateX: translateX.value }],
    borderRadius: capsuleHeight.value / 2,
  }));

  return (
    <Animated.View style={[styles.capsule, animatedStyle]} pointerEvents="none">
      <View style={styles.capsuleInner} />
      <View style={styles.capsuleHighlight} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    position: "absolute",
    top: 7,
    height: 64,
    backgroundColor: "rgba(34,190,200,0.18)",
    borderWidth: 1,
    borderColor: "rgba(34,190,200,0.4)",
    shadowColor: LIQUID.cyanColor,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    elevation: 10,
  },
  capsuleInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    backgroundColor: "rgba(34,190,200,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  capsuleHighlight: {
    position: "absolute",
    top: 4,
    left: 12,
    right: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
});

export default ActiveCapsule;
