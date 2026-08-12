import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { LIQUID } from "@styles/liquidTheme";

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

interface LiquidGlassTabProps {
  item: (typeof LIQUID.tabs)[number];
  isActive: boolean;
  onPress: () => void;
}

function LiquidGlassTab({ item, isActive, onPress }: LiquidGlassTabProps) {
  const press = useSharedValue(1);
  const active = useSharedValue(isActive ? 1 : 0);
  const pop = useSharedValue(0);
  const mounted = useSharedValue(false);

  useEffect(() => {
    active.value = withSpring(isActive ? 1 : 0, LIQUID.spring);
    if (isActive && mounted.value) {
      // A small vertical hop when this tab becomes the active one.
      pop.value = withSequence(
        withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) }),
        withSpring(0, { damping: 12, stiffness: 260, mass: 0.7 })
      );
    }
    mounted.value = true;
  }, [isActive, active, pop, mounted]);

  const handlePressIn = () => {
    press.value = withSpring(LIQUID.pressScale, {
      damping: 16,
      stiffness: 420,
      mass: 0.7,
    });
  };

  const handlePressOut = () => {
    press.value = withSpring(1, { damping: 11, stiffness: 260, mass: 0.7 });
  };

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: press.value },
      { translateY: interpolate(pop.value, [0, 1], [0, -5]) },
    ],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(active.value, [0, 1], [1, LIQUID.activeIconScale]) },
    ],
    opacity: interpolate(active.value, [0, 1], [LIQUID.inactiveOpacity, 1]),
  }));

  const iconColorProps = useAnimatedStyle(() => ({
    color: interpolateColor(
      active.value,
      [0, 1],
      [LIQUID.inactiveColor, LIQUID.cyanColor]
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      active.value,
      [0, 1],
      [LIQUID.inactiveColor, LIQUID.cyanColor]
    ),
    opacity: interpolate(active.value, [0, 1], [0.72, 1]),
    transform: [{ scale: interpolate(active.value, [0, 1], [0.94, 1]) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={item.label}
    >
      <Animated.View style={[styles.inner, wrapStyle]}>
        <Animated.View style={iconStyle}>
          <AnimatedIcon
            name={isActive ? item.iconFocused : item.icon}
            size={23}
            style={iconColorProps}
          />
        </Animated.View>

        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {item.label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});

export default React.memo(LiquidGlassTab);
