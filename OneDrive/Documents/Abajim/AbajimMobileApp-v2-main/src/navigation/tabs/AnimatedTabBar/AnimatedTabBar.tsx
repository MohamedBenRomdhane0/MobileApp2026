import React, { useCallback, useEffect, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { PATHS } from "@config/constants/paths";
import type { TabsParamList } from "@config/types/navigation.types";
import { useAppTheme } from "@theme/ThemeProvider";

import BooksScreen from "@screens/books/BooksScreen";
import CoursesScreen from "@screens/courses/CoursesScreen";
import HomeScreen from "@screens/home/HomeScreen";
import MeetingsScreen from "@screens/meetings/MeetingsScreen";
import PlansScreen from "@screens/plans/PlansScreen";
import SettingsScreen from "@screens/settings/SettingsScreen";

const Tab = createBottomTabNavigator<TabsParamList>();

// --- Constants ---
const BAR_HEIGHT = 72;
const FAB_SIZE = 56;
const PADDING_HORIZONTAL = 16;
const ICON_SIZE = 24;
const SPRING_CONFIG = { damping: 22, stiffness: 280, mass: 0.8, overshootClamping: false };

// --- Types ---
type TabItem = {
  name: keyof TabsParamList;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  label: string;
  isCenter?: boolean;
};

interface AnimatedTabBarProps {
  state: BottomTabBarProps["state"];
  navigation: BottomTabBarProps["navigation"];
  tabs: TabItem[];
  activeColor?: string;
  inactiveColor?: string;
  barHeight?: number;
  iconSize?: number;
  showLabels?: boolean;
}

// --- Crossfade Icon Component ---
const CrossfadeIcon = ({
  isFocused: focused,
  iconFocused,
  icon,
  activeColor,
  inactiveColor,
}: {
  isFocused: boolean;
  iconFocused: keyof typeof Ionicons.glyphMap;
  icon: keyof typeof Ionicons.glyphMap;
  activeColor: string;
  inactiveColor: string;
}) => {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, { damping: 18, stiffness: 320, mass: 0.9 });
  }, [focused, progress]);

  const focusedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.65, 1.15], "clamp") },
    ],
  }));

  const unfocusedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 0.65], "clamp") },
    ],
  }));

  const box = 44;

  return (
    <Animated.View style={{ width: box, height: box, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          unfocusedStyle,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons name={icon} size={ICON_SIZE} color={inactiveColor} />
      </Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          focusedStyle,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons name={iconFocused} size={ICON_SIZE} color={activeColor} />
      </Animated.View>
    </Animated.View>
  );
};

// --- Main Tab Bar Component ---
const FloatingTabBar = ({
  state,
  navigation,
  activeColor,
  inactiveColor,
  showLabels = true,
}: AnimatedTabBarProps) => {
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const activeColorResolved = activeColor ?? colors.primary;
  const inactiveColorResolved = inactiveColor ?? (isDark ? "rgba(203,213,225,0.7)" : "rgba(110,118,138,0.95)");

  const current = state.routes[state.index]?.name as keyof TabsParamList | undefined;

  const handleNavigate = useCallback(
    (routeName: keyof TabsParamList) => navigation.navigate(routeName as never),
    [navigation]
  );

  const isFocused = useCallback(
    (routeName: keyof TabsParamList) => current === routeName,
    [current]
  );

  const items: TabItem[] = useMemo(
    () => [
      { name: PATHS.TABS.SETTINGS, iconFocused: "person", icon: "person-outline", label: "Profile" },
      { name: PATHS.TABS.MEETINGS, iconFocused: "videocam", icon: "videocam-outline", label: "Meet" },
      { name: PATHS.TABS.HOME, iconFocused: "home", icon: "home-outline", isCenter: true, label: "Home" },
      { name: PATHS.TABS.COURSES, iconFocused: "library", icon: "library-outline", label: "Learn" },
      { name: PATHS.TABS.BOOKS, iconFocused: "book", icon: "book-outline", label: "Books" },
    ],
    []
  );

  // FAB target switching
  let centerTarget: keyof TabsParamList = PATHS.TABS.HOME as keyof TabsParamList;
  let centerIcon: keyof typeof Ionicons.glyphMap = "home-outline";
  if (current === (PATHS.TABS.HOME as keyof TabsParamList)) {
    centerTarget = PATHS.TABS.PLANS as keyof TabsParamList;
    centerIcon = "pricetags-outline";
  } else if (current === (PATHS.TABS.PLANS as keyof TabsParamList)) {
    centerTarget = PATHS.TABS.HOME as keyof TabsParamList;
    centerIcon = "home-outline";
  }

  // FAB spring scale
  const fabScale = useSharedValue(1);
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));
  const onPressInFab = () => { fabScale.value = withSpring(0.9, { damping: 18, stiffness: 320 }); };
  const onPressOutFab = () => { fabScale.value = withSpring(1, { damping: 18, stiffness: 320 }); };

  // Indicator pill animation
  const indicatorPos = useSharedValue(0);
  const indicatorWidth = useSharedValue(50);
  const glowPos = useSharedValue(0);
  const glowWidth = useSharedValue(50);

  useEffect(() => {
    const nonCenter = items.filter((it) => !it.isCenter);
    const activeIndex = nonCenter.findIndex((it) => isFocused(it.name));
    if (activeIndex >= 0) {
      const targetX = activeIndex * 80 + 8;
      indicatorPos.value = withSpring(targetX, SPRING_CONFIG);
      indicatorWidth.value = withSpring(72, SPRING_CONFIG);
      glowPos.value = withSpring(targetX, { damping: 18, stiffness: 260, mass: 1.2, overshootClamping: false });
      glowWidth.value = withSpring(115, { damping: 18, stiffness: 260, mass: 1.2, overshootClamping: false });
    }
  }, [current, items, indicatorPos, indicatorWidth, glowPos, glowWidth, isFocused]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.value,
    transform: [{ translateX: indicatorPos.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    width: glowWidth.value,
    transform: [{ translateX: glowPos.value }],
  }));

  const tabBarWidth = Math.min(screenWidth * 0.94, 480);
  const fabSize = Math.min(Math.max(screenWidth * 0.16, 56), 72);
  const itemWidth = (tabBarWidth - 2 * PADDING_HORIZONTAL - fabSize) / 4;
  const bottomOffset = Math.max(insets.bottom + 10, 24);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: bottomOffset,
          alignItems: "center",
        },
        bar: {
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(11,18,32,0.95)" : "rgba(255,255,255,0.97)",
          borderRadius: fabSize / 1.4,
          paddingHorizontal: PADDING_HORIZONTAL,
          paddingVertical: 12,
          width: tabBarWidth,
          height: fabSize + 24,
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? "rgba(148,163,184,0.18)" : "transparent",
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.55 : 0.16,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 14,
        },
        glow: {
          position: "absolute",
          top: 8,
          bottom: 8,
          borderRadius: (fabSize + 24) / 2,
          backgroundColor: isDark ? "rgba(34,190,200,0.08)" : "rgba(34,190,200,0.06)",
        },
        indicator: {
          position: "absolute",
          top: 10,
          bottom: 10,
          borderRadius: (fabSize + 24 - 20) / 2,
          backgroundColor: isDark ? "rgba(34,190,200,0.22)" : "rgba(34,190,200,0.16)",
          shadowColor: isDark ? undefined : "#22bcb8",
          shadowOpacity: isDark ? 0 : 0.25,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        },
        tabItem: {
          width: itemWidth,
          height: fabSize,
          alignItems: "center",
          justifyContent: "center",
        },
        centerSlot: {
          width: fabSize,
          height: 1,
        },
        fabWrapper: {
          position: "absolute",
          top: 4 - fabSize / 2,
          alignItems: "center",
          justifyContent: "center",
        },
        fab: {
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: activeColorResolved,
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.65 : 0.3,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 12 },
          elevation: 14,
        },
      }),
    [fabSize, isDark, bottomOffset, itemWidth, tabBarWidth, activeColorResolved]
  );

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {items.map((it) => {
          if (it.isCenter) {
            return <View key="__center__" style={styles.centerSlot} />;
          }
          return (
            <TouchableOpacity
              key={String(it.name)}
              onPress={() => handleNavigate(it.name)}
              activeOpacity={0.85}
              style={styles.tabItem}
            >
              <CrossfadeIcon
                isFocused={isFocused(it.name)}
                iconFocused={it.iconFocused}
                icon={it.icon}
                activeColor={activeColorResolved}
                inactiveColor={inactiveColorResolved}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <Animated.View style={[styles.fabWrapper, fabAnimatedStyle]} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onPressInFab}
          onPressOut={onPressOutFab}
          onPress={() => handleNavigate(centerTarget)}
          style={styles.fab}
        >
          <Ionicons name={centerIcon} size={ICON_SIZE + 4} color={activeColorResolved} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// --- Main Tab Navigator ---
const MainTabNavigator: React.FC = () => {
  const defaultTabs: TabItem[] = [
    { name: PATHS.TABS.SETTINGS, iconFocused: "person", icon: "person-outline", label: "Profile" },
    { name: PATHS.TABS.MEETINGS, iconFocused: "videocam", icon: "videocam-outline", label: "Meet" },
    { name: PATHS.TABS.HOME, iconFocused: "home", icon: "home-outline", isCenter: true, label: "Home" },
    { name: PATHS.TABS.COURSES, iconFocused: "library", icon: "library-outline", label: "Learn" },
    { name: PATHS.TABS.BOOKS, iconFocused: "book", icon: "book-outline", label: "Books" },
  ];

  return (
    <Tab.Navigator
      initialRouteName={PATHS.TABS.HOME}
      tabBar={(props) => <FloatingTabBar {...props} tabs={defaultTabs} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name={PATHS.TABS.BOOKS} component={BooksScreen} />
      <Tab.Screen name={PATHS.TABS.COURSES} component={CoursesScreen} />
      <Tab.Screen name={PATHS.TABS.MEETINGS} component={MeetingsScreen} />
      <Tab.Screen name={PATHS.TABS.SETTINGS} component={SettingsScreen} />
      <Tab.Screen name={PATHS.TABS.PLANS} component={PlansScreen} />
      <Tab.Screen
        name={PATHS.TABS.HOME}
        component={HomeScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;