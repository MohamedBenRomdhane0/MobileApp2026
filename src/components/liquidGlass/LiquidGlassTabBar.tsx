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
import FloatingActionButton from "./FloatingActionButton";

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

        {/* Cyan accent border */}
        <View style={styles.cyanBorder} pointerEvents="none" />

        <View style={styles.tabsRow}>
           {tabs.map(
            (item: (typeof LIQUID.tabs)[number], i: number) => (
              <View key={item.name} style={styles.tabSlot}>
                {/* Blue ball indicator for active tab */}
                {activeIndex === i && <View style={styles.activeBall} />}
                <LiquidGlassTab
                  item={item}
                  index={i}
                  isActive={activeIndex === i}
                  onPress={() => handleTabPress(item.name)}
                />
              </View>
            )
          )}
        </View>
    </Animated.View>

      {/* Floating Action Button positioned at center, overlapping the bar */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, alignItems: "center" }}>
        <FloatingActionButton onPress={() => handleTabPress("Home")} />
      </View>
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
  cyanBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: LIQUID.borderRadius,
    borderWidth: 1.5,
    borderColor: LIQUID.border,
    pointerEvents: "none",
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  tabSlot: {
    flex: 1,
    alignItems: "center",
  },
  activeBall: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22BEC8",
    marginBottom: 4,
    shadowColor: "#22BEC8",
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

export default LiquidGlassTabBar;