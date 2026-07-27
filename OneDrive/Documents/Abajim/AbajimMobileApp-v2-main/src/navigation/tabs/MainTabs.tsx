import React, { useCallback, useEffect, useMemo } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { PATHS } from "@config/constants/paths";
import type { TabsParamList } from "@config/types/navigation.types";
import { useAppTheme } from "@theme/ThemeProvider";

import HomeScreen from "@screens/home/HomeScreen";
import BooksScreen from "@screens/books/BooksScreen";
import CoursesScreen from "@screens/courses/CoursesScreen";
import SettingsScreen from "@screens/settings/SettingsScreen";
import MeetingsScreen from "@screens/meetings/MeetingsScreen";
import PlansScreen from "@screens/plans/PlansScreen";

const Tab = createBottomTabNavigator<TabsParamList>();

// ---------- Responsive sizing constants ----------
const TAB_BAR_RATIO = 0.94;
const TAB_BAR_MAX_WIDTH = 480;
const TAB_BAR_MIN_WIDTH = 300;
const FAB_RATIO = 0.16;
const FAB_MIN = 56;
const FAB_MAX = 72;
const ICON_RATIO = 0.058;
const ICON_MIN = 22;
const ICON_MAX = 28;
const PAD_X = 12;
const PAD_Y = 12;

type TabItem = {
  name: keyof TabsParamList;
  iconFocused: keyof typeof Ionicons.glyphMap;
  icon: keyof typeof Ionicons.glyphMap;
  isCenter?: boolean;
};

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // ---------- Responsive sizing ----------
  const tabBarWidth = Math.max(
    TAB_BAR_MIN_WIDTH,
    Math.min(screenWidth * TAB_BAR_RATIO, TAB_BAR_MAX_WIDTH)
  );
  const fabSize = Math.max(
    FAB_MIN,
    Math.min(screenWidth * FAB_RATIO, FAB_MAX)
  );
  const itemWidth = Math.max(
    40,
    (tabBarWidth - 2 * PAD_X - fabSize) / 4
  );
  const iconSize = Math.max(
    ICON_MIN,
    Math.min(screenWidth * ICON_RATIO, ICON_MAX)
  );

  const styles = useMemo(
    () =>
      makeStyles({
        tabBarWidth,
        fabSize,
        itemWidth,
        iconSize,
        isDark,
        insets,
      }),
    [tabBarWidth, fabSize, itemWidth, iconSize, isDark, insets]
  );

  const activeColor = colors.primary;
  const inactiveColor = isDark
    ? "rgba(203,213,225,0.70)"
    : "rgba(110,118,138,0.95)";

  const current = state.routes[state.index]?.name as
    | keyof TabsParamList
    | undefined;

  const handleNavigate = useCallback(
    (routeName: keyof TabsParamList) =>
      navigation.navigate(routeName as never),
    [navigation]
  );

  const isFocused = (routeName: keyof TabsParamList) =>
    current === routeName;

  // ---------- FAB target switching ----------
  const currentRouteName = current;
  let centerTarget: keyof TabsParamList = PATHS.TABS.HOME as keyof TabsParamList;
  let centerIcon: keyof typeof Ionicons.glyphMap = "home-outline";

  if (currentRouteName === (PATHS.TABS.HOME as keyof TabsParamList)) {
    centerTarget = PATHS.TABS.PLANS as keyof TabsParamList;
    centerIcon = "pricetags-outline";
  } else if (currentRouteName === (PATHS.TABS.PLANS as keyof TabsParamList)) {
    centerTarget = PATHS.TABS.HOME as keyof TabsParamList;
    centerIcon = "home-outline";
  }

  // ---------- FAB spring scale on press ----------
  const fabScale = useSharedValue(1);
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));
  const onPressInFab = () => {
    fabScale.value = withSpring(0.9, {
      damping: 18,
      stiffness: 320,
      mass: 0.6,
    });
  };
  const onPressOutFab = () => {
    fabScale.value = withSpring(1, {
      damping: 18,
      stiffness: 320,
      mass: 0.6,
    });
  };

  const items: TabItem[] = useMemo(
    () => [
      {
        name: PATHS.TABS.SETTINGS as keyof TabsParamList,
        iconFocused: "person",
        icon: "person-outline",
      },
      {
        name: PATHS.TABS.MEETINGS as keyof TabsParamList,
        iconFocused: "videocam",
        icon: "videocam-outline",
      },
      {
        name: PATHS.TABS.HOME as keyof TabsParamList,
        iconFocused: "home",
        icon: "home-outline",
        isCenter: true,
      },
      {
        name: PATHS.TABS.COURSES as keyof TabsParamList,
        iconFocused: "library",
        icon: "library-outline",
      },
      {
        name: PATHS.TABS.BOOKS as keyof TabsParamList,
        iconFocused: "book",
        icon: "book-outline",
      },
    ],
    []
  );

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {items.map((it) => {
          if (it.isCenter) {
            return (
              <View
                key="__center_slot__"
                style={styles.centerSlot}
              />
            );
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
                activeColor={activeColor}
                inactiveColor={inactiveColor}
                size={iconSize}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* FAB overlays the reserved center slot */}
      <Animated.View
        style={[styles.fabWrapper, fabAnimatedStyle]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onPressInFab}
          onPressOut={onPressOutFab}
          onPress={() => handleNavigate(centerTarget)}
          style={[styles.fab, { borderColor: activeColor }]}
        >
          <Ionicons
            name={centerIcon}
            size={iconSize + 4}
            color={activeColor}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ---------- Crossfade + scale icon between active/inactive ----------
function CrossfadeIcon({
  isFocused,
  iconFocused,
  icon,
  activeColor,
  inactiveColor,
  size,
}: {
  isFocused: boolean;
  iconFocused: keyof typeof Ionicons.glyphMap;
  icon: keyof typeof Ionicons.glyphMap;
  activeColor: string;
  inactiveColor: string;
  size: number;
}) {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFocused, progress]);

  const focusedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.65, 1]) },
    ],
  }));
  const unfocusedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 0.65]) },
    ],
  }));

  const box = size + 10;

  return (
    <View
      style={{
        width: box,
        height: box,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          unfocusedStyle,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons name={icon} size={size} color={inactiveColor} />
      </Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          focusedStyle,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons name={iconFocused} size={size} color={activeColor} />
      </Animated.View>
    </View>
  );
}

type MakeStylesArgs = {
  tabBarWidth: number;
  fabSize: number;
  itemWidth: number;
  iconSize: number;
  isDark: boolean;
  insets: { top: number; bottom: number; left: number; right: number };
};

function makeStyles({
  tabBarWidth,
  fabSize,
  itemWidth,
  iconSize,
  isDark,
  insets,
}: MakeStylesArgs) {
  const tabSurface = isDark ? "rgba(11,18,32,0.95)" : "rgba(255,255,255,0.97)";
  const fabSurface = isDark ? "#0F172A" : "#FFFFFF";
  const shadowOpacity = isDark ? 0.55 : 0.16;
  const bottomInset = Math.max(
    insets.bottom + 10,
    Platform.OS === "ios" ? 24 : 12
  );

  return StyleSheet.create({
    tabBarContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: bottomInset,
      alignItems: "center",
    },

    tabBar: {
      flexDirection: "row",
      backgroundColor: tabSurface,
      borderRadius: fabSize / 1.4,
      paddingHorizontal: PAD_X,
      paddingVertical: PAD_Y,
      width: tabBarWidth,
      height: fabSize + PAD_Y * 2,
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? "rgba(148,163,184,0.18)" : "transparent",
      shadowColor: "#000",
      shadowOpacity,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 14,
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
      backgroundColor: fabSurface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      shadowColor: "#000",
      shadowOpacity: isDark ? 0.65 : 0.3,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 16,
    },
  });
}

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName={PATHS.TABS.HOME}
      tabBar={(props) => <FloatingTabBar {...props} />}
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
