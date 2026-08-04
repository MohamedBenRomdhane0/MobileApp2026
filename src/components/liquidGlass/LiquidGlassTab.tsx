import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { LIQUID } from "@styles/liquidTheme";

interface LiquidGlassTabProps {
  item: (typeof LIQUID.tabs)[number];
  index: number;
  isActive: boolean;
  onPress: () => void;
}

function LiquidGlassTab({
  item,
  index,
  isActive,
  onPress,
}: LiquidGlassTabProps) {
  const press = useSharedValue(1);
  const iconScale = useSharedValue(isActive ? LIQUID.activeIconScale : 1);
  const labelOpacity = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    iconScale.value = withSpring(
      isActive ? LIQUID.activeIconScale : 1,
      LIQUID.spring
    );
    labelOpacity.value = withSpring(isActive ? 1 : 0, LIQUID.spring);
  }, [isActive, iconScale, labelOpacity]);

  const handlePressIn = () => {
    press.value = withSpring(LIQUID.pressScale, {
      damping: 18,
      stiffness: 320,
      mass: 0.9,
      overshootClamping: false,
      energyThreshold: 0.01,
    });
  };

  const handlePressOut = () => {
    press.value = withSpring(1, LIQUID.spring);
  };

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: interpolate(
      iconScale.value,
      [1, LIQUID.activeIconScale],
      [LIQUID.inactiveOpacity, 1]
    ),
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [
      {
        translateY: interpolate(labelOpacity.value, [0, 1], [4, 0]),
      },
    ],
  }));

  // Requested color: rgba(9,17,33,0.62) for inactive
  const INACTIVE_COLOR = "rgba(9,17,33,0.62)";
  const ACTIVE_COLOR = LIQUID.cyanColor;

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
      <Animated.View
        style={[styles.iconWrap, { transform: [{ scale: press.value }] }]}
      >
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons
            name={isActive ? item.iconFocused : item.icon}
            size={26}
            color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        </Animated.View>
      </Animated.View>

      <Animated.Text style={[styles.label, labelAnimatedStyle]} numberOfLines={1}>
        {item.label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(9,17,33,0.85)",
    letterSpacing: 0.2,
  },
});

export default LiquidGlassTab;