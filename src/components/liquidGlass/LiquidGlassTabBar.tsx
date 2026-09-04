import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  BackHandler,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LIQUID } from "@styles/liquidTheme";
import { getLiquidBarBottomOffset } from "@utils/helpers/liquidBar.helpers";
import AnimatedGlassBackground from "./AnimatedGlassBackground";
import LiquidGlassTab from "./LiquidGlassTab";
import ActiveCapsule from "./ActiveCapsule";
import FloatingActionButton from "./FloatingActionButton";
import QuickActionMenu from "./QuickActionMenu";

interface LiquidGlassTabBarProps {
  state: { index: number; routes: Array<{ key: string; name: string }> };
  navigation: { navigate: (name: string) => void };
}

const TABS = LIQUID.tabs;

function LiquidGlassTabBar({ state, navigation }: LiquidGlassTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useSharedValue(0);
  const indicatorX = useSharedValue(0);
  const stretch = useSharedValue(0);
  const didPosition = useRef(false);

  const barWidth = Math.min(screenW * LIQUID.barWidthRatio, LIQUID.barMaxWidth);
  const bottomOffset = getLiquidBarBottomOffset(insets.bottom);
  const menuWidth = Math.min(barWidth * LIQUID.menuWidthRatio, LIQUID.menuMaxWidth)-10;

  /** Resolve the active tab by route name — the navigator holds more screens than the bar shows. */
  const activeIndex = useMemo(() => {
    const routeName = state.routes[state.index]?.name;
    return TABS.findIndex((t) => t.name === routeName);
  }, [state.index, state.routes]);

  /**
   * Slot geometry: two tabs, the reserved FAB gap, then two more tabs.
   * `centers` are measured from the left edge of the bar.
   */
  const geo = useMemo(() => {
    const usable = barWidth - LIQUID.hPadding * 2 - LIQUID.fabSlot;
    const slotW = usable / TABS.length;
    const half = TABS.length / 2;
    const centers = TABS.map(
      (_, i) =>
        LIQUID.hPadding +
        (i < half ? 0 : LIQUID.fabSlot) +
        i * slotW +
        slotW / 2
    );
    return {
      slotW,
      centers,
      pillW: Math.min(slotW - 4, LIQUID.indicatorMaxWidth),
    };
  }, [barWidth]);

  // Slide the liquid capsule to the active tab, with a stretch mid-flight.
  useEffect(() => {
    if (activeIndex < 0) return;
    const target = geo.centers[activeIndex] - geo.pillW / 2;

    if (!didPosition.current) {
      indicatorX.value = target;
      didPosition.current = true;
      return;
    }

    indicatorX.value = withSpring(target, LIQUID.spring);
    stretch.value = withSequence(
      withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 280, easing: Easing.inOut(Easing.quad) })
    );
  }, [activeIndex, geo, indicatorX, stretch]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menu.value = withSpring(0, LIQUID.closeSpring);
  }, [menu]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((wasOpen) => {
      const next = !wasOpen;
      Haptics.impactAsync(
        next
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );
      menu.value = withSpring(
        next ? 1 : 0,
        next ? LIQUID.openSpring : LIQUID.closeSpring
      );
      return next;
    });
  }, [menu]);

  const handleTabPress = useCallback(
    (routeName: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (menuOpen) closeMenu();
      navigation.navigate(routeName);
    },
    [menuOpen, closeMenu, navigation]
  );

  const handleQuickAction = useCallback(
    (routeName: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      closeMenu();
      navigation.navigate(routeName);
    },
    [closeMenu, navigation]
  );

  // Hardware back closes the menu before it pops the navigator.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      closeMenu();
      return true;
    });
    return () => sub.remove();
  }, [menuOpen, closeMenu]);

  // Close the menu whenever navigation lands somewhere else.
  useEffect(() => {
    if (menuOpen) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index]);

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: menu.value,
  }));

  // The bar dips and dims slightly while the bubble is out — depth cue.
  const barStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(menu.value, [0, 1], [1, 0.985]) },
      { translateY: interpolate(menu.value, [0, 1], [0, 2]) },
    ],
  }));

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* Scrim — tap anywhere to dismiss */}
      <Animated.View
        style={[StyleSheet.absoluteFill, scrimStyle]}
        pointerEvents={menuOpen ? "auto" : "none"}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeMenu}
          accessibilityRole="button"
          accessibilityLabel="Fermer le menu rapide"
        >
          <BlurView intensity={18} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.scrimTint} />
        </Pressable>
      </Animated.View>

      <View style={[styles.dock, { bottom: bottomOffset }]} pointerEvents="box-none">
        {/* Quick-action bubble, anchored just above the FAB */}
        <View style={styles.menuAnchor} pointerEvents="box-none">
          <QuickActionMenu
            progress={menu}
            width={menuWidth}
            open={menuOpen}
            onSelect={handleQuickAction}
          />
        </View>

        {/* The bar */}
        <Animated.View
          style={[styles.barShadow, { width: barWidth }, barStyle]}
          pointerEvents="box-none"
        >
          {/* Ambient glow so the bar reads as floating on every platform */}
          <View style={styles.barGlowOuter} pointerEvents="none" />
          <View style={styles.barGlowInner} pointerEvents="none" />

          <View style={styles.barClip}>
            <AnimatedGlassBackground width={barWidth} />

            {activeIndex >= 0 && (
              <ActiveCapsule
                translateX={indicatorX}
                stretch={stretch}
                width={geo.pillW}
              />
            )}

            <View style={styles.tabsRow}>
              {TABS.map((item, i) => (
                <React.Fragment key={item.name}>
                  {i === TABS.length / 2 && <View style={styles.fabGap} />}
                  <LiquidGlassTab
                    item={item}
                    isActive={activeIndex === i}
                    onPress={() => handleTabPress(item.name)}
                  />
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Outer rim, drawn above the clip so it stays crisp */}
          <View style={styles.barRim} pointerEvents="none" />
        </Animated.View>

        {/* Center control */}
        <View style={styles.fabAnchor} pointerEvents="box-none">
          <FloatingActionButton
            onPress={toggleMenu}
            progress={menu}
            isOpen={menuOpen}
          />
        </View>
      </View>
    </View>
  );
}

/** Vertical distance from the bottom of the bar to the top of the FAB. */
const FAB_BOTTOM =
  LIQUID.barHeight / 2 - LIQUID.fabSize / 2 + LIQUID.fabLift;
const MENU_BOTTOM = FAB_BOTTOM + LIQUID.fabSize + LIQUID.menuGap;

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrimTint: [StyleSheet.absoluteFill, {
    backgroundColor: LIQUID.scrimColor,
  }] as unknown as import("react-native").ViewStyle,
  dock: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  barShadow: {
    height: LIQUID.barHeight,
    borderRadius: LIQUID.borderRadius,
    backgroundColor: "transparent",
    shadowColor: LIQUID.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 14,
  },
  barGlowOuter: {
    position: "absolute",
    top: 4,
    left: 10,
    right: 10,
    bottom: -8,
    borderRadius: LIQUID.borderRadius,
    backgroundColor: "rgba(12,58,74,0.07)",
  },
  barGlowInner: {
    position: "absolute",
    top: 2,
    left: 5,
    right: 5,
    bottom: -4,
    borderRadius: LIQUID.borderRadius,
    backgroundColor: "rgba(12,58,74,0.06)",
  },
  barClip: [StyleSheet.absoluteFill, {
    borderRadius: LIQUID.borderRadius,
    overflow: "hidden",
  }] as unknown as import("react-native").ViewStyle,
  barRim: [StyleSheet.absoluteFill, {
    borderRadius: LIQUID.borderRadius,
    borderWidth: 1.2,
    borderColor: LIQUID.border,
  }] as unknown as import("react-native").ViewStyle,
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: LIQUID.hPadding,
  },
  fabGap: {
    width: LIQUID.fabSlot,
  },
  fabAnchor: {
    position: "absolute",
    bottom: FAB_BOTTOM,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  menuAnchor: {
    position: "absolute",
    bottom: MENU_BOTTOM,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default LiquidGlassTabBar;
