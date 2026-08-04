import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LIQUID } from "@styles/liquidTheme";

interface FloatingActionButtonProps {
  onPress: () => void;
}

function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const press = useSharedValue(1);
  const ripple = useSharedValue(0);
  const glow = useSharedValue(0);
  const halfCircleScale = useSharedValue(0);
  const halfCircleOpacity = useSharedValue(0);

  const handlePressIn = () => {
    "worklet";
    press.value = withSpring(LIQUID.fabPressScale, {
      damping: 18,
      stiffness: 320,
      mass: 0.9,
      overshootClamping: false,
      energyThreshold: 0.01,
    });
    ripple.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) }, () => {
      ripple.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) });
    });
    glow.value = withSpring(1, LIQUID.spring);
    halfCircleScale.value = withSpring(1, LIQUID.spring);
    halfCircleOpacity.value = withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) });
  };

  const handlePressOut = () => {
    "worklet";
    press.value = withSpring(1, LIQUID.spring);
    glow.value = withSpring(0, LIQUID.spring);
    halfCircleScale.value = withSpring(0, { ...LIQUID.spring, damping: 20 });
    halfCircleOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) });
  };

  const handlePress = () => {
    "worklet";
    runOnJS(onPress)();
  };

  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ripple.value, [0, 0.5, 1], [0, 0.3, 0]),
    transform: [{ scale: interpolate(ripple.value, [0, 1], [0, 2]) }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glow.value, [0, 1], [0, 0.5]),
    shadowRadius: interpolate(glow.value, [0, 1], [16, 32]),
  }));

  const halfCircleStyle = useAnimatedStyle(() => ({
    opacity: halfCircleOpacity.value,
    transform: [{ scale: halfCircleScale.value }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.fab}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="button"
      accessibilityLabel="Ajouter"
    >
      <Animated.View
        style={[
          styles.fabInner,
          pressAnimatedStyle,
          glowStyle,
        ]}
      >
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
        {/* Cyan accent border */}
        <View style={styles.fabBorder} pointerEvents="none" />

        {/* Demi-cercle (half-circle) animation on click */}
        <Animated.View style={[styles.halfCircle, halfCircleStyle]} pointerEvents="none">
          <View style={styles.halfCircleInner} />
        </Animated.View>

        {/* Ripple effect */}
        <Animated.View style={[styles.ripple, rippleStyle]} pointerEvents="none" />
        {/* Glow ring */}
        <Animated.View style={[styles.glowRing, glowStyle]} pointerEvents="none" />
        {/* Icon */}
        <Ionicons name="calendar-outline" size={26} color="#FFFFFF" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    zIndex: 10,
    transform: [{ translateY: -LIQUID.fabOverlap }],
  },
  fabInner: {
    width: LIQUID.fabSize,
    height: LIQUID.fabSize,
    borderRadius: LIQUID.fabSize / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  halfCircle: {
    position: "absolute",
    bottom: -(LIQUID.fabSize / 2) + 2,
    left: 0,
    right: 0,
    alignItems: "center",
    transformOrigin: "bottom center",
  },
  halfCircleInner: {
    width: LIQUID.fabSize * 1.5,
    height: LIQUID.fabSize * 0.75,
    borderBottomLeftRadius: (LIQUID.fabSize * 1.5) / 2,
    borderBottomRightRadius: (LIQUID.fabSize * 1.5) / 2,
    backgroundColor: LIQUID.cyanColor,
  },
  ripple: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: LIQUID.fabSize / 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  glowRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: LIQUID.fabSize / 2,
    borderWidth: 2,
    borderColor: LIQUID.cyanColor,
    shadowColor: LIQUID.cyanColor,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  fabBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: LIQUID.fabSize / 2,
    borderWidth: 1.5,
    borderColor: LIQUID.border,
    pointerEvents: "none",
  },
});

export default FloatingActionButton;
