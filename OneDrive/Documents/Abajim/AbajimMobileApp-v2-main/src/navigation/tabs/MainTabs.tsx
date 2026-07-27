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
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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
  label: string;
};

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // ---------- Responsive sizing ----------
  const tabBarWidth = useMemo(
    () =>
      Math.max(
        TAB_BAR_MIN_WIDTH,
        Math.min(screenWidth * TAB_BAR_RATIO, TAB_BAR_MAX_WIDTH)
      ),
    [screenWidth]
  );
  const fabSize = useMemo(
    () =>
      Math.max(
        FAB_MIN,
        Math.min(screenWidth * FAB_RATIO, FAB_MAX)
      ),
    [screenWidth]
  );
  const itemWidth = useMemo(
    () => (tabBarWidth - 2 * PAD_X - fabSize) / 4,
    [tabBarWidth, fabSize]
  );
  const iconSize = useMemo(
    () =>
      Math.max(
        ICON_MIN,
        Math.min(screenWidth * ICON_RATIO, ICON_MAX)
      ),
    [screenWidth]
  );
  const bottomOffset = useMemo(
    () =>
      Math.max(
        insets.bottom + 10,
        Platform.OS === "ios" ? 24 : 12
      ),
    [insets.bottom]
  );

  const styles = useMemo(
    () =>
      makeStyles({
        tabBarWidth,
        fabSize,
        itemWidth,
        iconSize,
        isDark,
        bottomOffset,
      }),
    [tabBarWidth, fabSize, itemWidth, iconSize, isDark, bottomOffset]
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
    });
  };
  const onPressOutFab = () => {
    fabScale.value = withSpring(1, {
      damping: 18,
      stiffness: 320,
    });
  };

    const items: TabItem[] = useMemo(
      () => [
        {
          name: PATHS.TABS.SETTINGS as keyof TabsParamList,
          iconFocused: "person",
          icon: "person-outline",
          label: "Profile",
        },
        {
          name: PATHS.TABS.MEETINGS as keyof TabsParamList,
          iconFocused: "videocam",
          icon: "videocam-outline",
          label: "Meet",
        },
        {
          name: PATHS.TABS.HOME as keyof TabsParamList,
          iconFocused: "home",
          icon: "home-outline",
          isCenter: true,
          label: "Home",
        },
        {
          name: PATHS.TABS.COURSES as keyof TabsParamList,
          iconFocused: "library",
          icon: "library-outline",
          label: "Learn",
        },
        {
          name: PATHS.TABS.BOOKS as keyof TabsParamList,
          iconFocused: "book",
          icon: "book-outline",
          label: "Books",
        },
      ],
      []
    );

   // ---------- Animated indicator pill position ----------
   const indicatorPos = useSharedValue(0);
   const indicatorWidth = useSharedValue(itemWidth);
   const glowPos = useSharedValue(0);
   const glowWidth = useSharedValue(itemWidth);

   useEffect(() => {
     const activeIndex = items.findIndex((it) => !it.isCenter && isFocused(it.name));
     const targetX = activeIndex * (itemWidth + 0);
     indicatorPos.value = withSpring(targetX, {
       damping: 22,
       stiffness: 300,
       mass: 0.7,
       overshootClamping: false,
     });
     indicatorWidth.value = withSpring(itemWidth, {
       damping: 22,
       stiffness: 300,
       mass: 0.7,
     });
     glowPos.value = withSpring(targetX, {
       damping: 18,
       stiffness: 260,
       mass: 1.2,
       overshootClamping: false,
     });
     glowWidth.value = withSpring(itemWidth * 1.6, {
       damping: 18,
       stiffness: 260,
       mass: 1.2,
     });
   }, [current, itemWidth, items]);

   const indicatorStyle = useAnimatedStyle(() => ({
     width: indicatorWidth.value,
     transform: [{ translateX: indicatorPos.value }],
   }));

   const glowStyle = useAnimatedStyle(() => ({
     width: glowWidth.value,
     transform: [{ translateX: glowPos.value }],
   }));

   return (
     <View style={styles.tabBarContainer}>
       <View style={styles.tabBar}>
         {/* Glow halo behind active tab */}
         <Animated.View style={[styles.glow, glowStyle]} />
         {/* Sliding indicator pill */}
         <Animated.View style={[styles.indicator, indicatorStyle]} />
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
                 label={it.label}
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

// ---------- Crossfade + scale + bounce icon + label ----------
function CrossfadeIcon({
  isFocused,
  iconFocused,
  icon,
  activeColor,
  inactiveColor,
  size,
  label,
}: {
  isFocused: boolean;
  iconFocused: keyof typeof Ionicons.glyphMap;
  icon: keyof typeof Ionicons.glyphMap;
  activeColor: string;
  inactiveColor: string;
  size: number;
  label: string;
}) {
  const labelStyle = useMemo(
    () =>
      StyleSheet.create({
        label: {
          fontSize: 9,
          fontWeight: "600",
          marginTop: 2,
          letterSpacing: 0.3,
        },
      }),
    []
  );

  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, {
      damping: 18,
      stiffness: 320,
      mass: 0.9,
      overshootClamping: false,
    });
  }, [isFocused, progress]);

  const iconScale = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.7, 1.1]) }],
  }));
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

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 1], [0, 0.35, 0.55]),
  }));

  const labelOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.5, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [6, 0]) },
    ],
  }));

  const box = size + 26;

  return (
    <View
      style={{
        width: box,
        height: box,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow behind focused icon */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          glowStyle,
          {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: box / 2,
            backgroundColor: activeColor,
          },
        ]}
      />
      
      {/* Unfocused icon */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          unfocusedStyle,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons name={icon} size={size} color={inactiveColor} />
      </Animated.View>
      
      {/* Focused icon with scale bounce */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          focusedStyle,
          iconScale,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons name={iconFocused} size={size} color={activeColor} />
      </Animated.View>

      {/* Animated label */}
      <Animated.Text
        numberOfLines={1}
        style={[
          labelStyle.label,
          { color: isFocused ? activeColor : inactiveColor },
          labelOpacity,
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
}

type MakeStylesArgs = {
  tabBarWidth: number;
  fabSize: number;
  itemWidth: number;
  iconSize: number;
  isDark: boolean;
  bottomOffset: number;
};

function makeStyles({
  tabBarWidth,
  fabSize,
  itemWidth,
  iconSize,
  isDark,
  bottomOffset,
}: MakeStylesArgs) {
  const tabSurface = isDark ? "rgba(11,18,32,0.95)" : "rgba(255,255,255,0.97)";
  const fabSurface = isDark ? "#0F172A" : "#FFFFFF";
  const shadowOpacity = isDark ? 0.55 : 0.16;

  return StyleSheet.create({
    tabBarContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: bottomOffset,
      alignItems: "center",
    },

    tabBar: {
      flexDirection: "row",
      backgroundColor: tabSurface,
      borderRadius: fabSize / 1.4,
      paddingHorizontal: PAD_X,
      paddingVertical: PAD_Y,
      width: tabBarWidth,
      height: fabSize + PAD_Y * 2 + 16,
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? "rgba(148,163,184,0.18)" : "transparent",
      shadowColor: "#000",
      shadowOpacity,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 14,
      overflow: "hidden",
    },

    indicator: {
      position: "absolute",
      top: PAD_Y + 2,
      bottom: PAD_Y + 2,
      borderRadius: (fabSize + PAD_Y * 2 - 4) / 2,
      backgroundColor: isDark ? "rgba(34,190,200,0.22)" : "rgba(34,190,200,0.16)",
      shadowColor: isDark ? undefined : "#22bcb8",
      shadowOpacity: isDark ? 0 : 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },

    glow: {
      position: "absolute",
      top: PAD_Y - 2,
      bottom: PAD_Y - 2,
      borderRadius: (fabSize + PAD_Y * 2) / 2,
      backgroundColor: isDark ? "rgba(34,190,200,0.08)" : "rgba(34,190,200,0.06)",
    },

    label: {
      fontSize: 9,
      fontWeight: "600",
      marginTop: 2,
      letterSpacing: 0.3,
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
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 14,
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
