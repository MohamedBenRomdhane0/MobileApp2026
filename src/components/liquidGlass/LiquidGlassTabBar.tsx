import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LIQUID } from "@styles/liquidTheme";
import AnimatedGlassBackground from "./AnimatedGlassBackground";
import LiquidGlassTab from "./LiquidGlassTab";

interface LiquidGlassTabBarProps {
  state: { index: number; routes: Array<{ key: string; name: string }> };
  navigation: { navigate: (name: string) => void };
}

function LiquidGlassTabBar({ state, navigation }: LiquidGlassTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  const barWidth = screenW * LIQUID.barWidthRatio;
  const bottomOffset = Math.max(insets.bottom + LIQUID.bottomSpacing, LIQUID.bottomSpacing);

  const activeIndex = state.index;

  const handleTabPress = (routeName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(routeName as never);
  };

  const tabs = useMemo(() => LIQUID.tabs, []);

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <Animated.View
        style={[
          styles.bar,
          { width: barWidth, marginHorizontal: (screenW - barWidth) / 2 },
        ]}
      >
        <AnimatedGlassBackground />

        <View style={styles.tabsRow}>
          {tabs.map(
            (item: (typeof LIQUID.tabs)[number], i: number) => (
              <LiquidGlassTab
                key={item.name}
                item={item}
                index={i}
                isActive={activeIndex === i}
                onPress={() => handleTabPress(item.name)}
              />
            )
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  bar: {
    height: LIQUID.barHeight,
    borderRadius: LIQUID.borderRadius,
    overflow: "hidden",
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
});

export default LiquidGlassTabBar;
