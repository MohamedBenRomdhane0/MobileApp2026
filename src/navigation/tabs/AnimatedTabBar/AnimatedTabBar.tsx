import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
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
  type SharedValue,
} from "react-native-reanimated";

import { PATHS } from "@config/constants/paths";
import type { TabsParamList } from "@config/types/navigation.types";
import { useAppTheme } from "@theme/ThemeProvider";

import BooksScreen from "@screens/books/BooksScreen";
import CoursesScreen from "@screens/courses/CoursesScreen";
import HomeScreen from "@screens/home/HomeScreen";
import MeetingsScreen from "@screens/meetings/MeetingsScreen";
import ReservedMeetingsScreen from "@screens/meetings/reservedMeetings/ReservedMeetingsScreen";
import PlansScreen from "@screens/plans/PlansScreen";
import SettingsScreen from "@screens/settings/SettingsScreen";
import StudyGuideScreen from "@screens/learning/StudyGuideScreen";
import MeetingViewScreen from "@screens/meetings/meetingDetails/MeetingViewScreen";
import StartLearningScreen from "@screens/learning/StartLearningScreen";
import ProgressTodayScreen from "@screens/learning/ProgressTodayScreen";
import EduHomeScreen from "@screens/learning/EduHomeScreen";
import StudyCraftScreen from "@screens/learning/StudyCraftScreen";
import AIOwlScreen from "@screens/learning/AIOwlScreen";
import LearnCalendarScreen from "@screens/learning/LearnCalendarScreen";

const Tab = createBottomTabNavigator<TabsParamList>();

const ICON_SIZE = 22;
const BAR_HEIGHT = 70;
/** Height of a tab pill; also the touch-target height. */
const TAB_HEIGHT = 46;
/** Width of an inactive, icon-only tab. */
const TAB_COLLAPSED_W = 54;
/** Horizontal padding inside the bar. */
const BAR_PAD_H = 14;
/** Widest an expanded pill is allowed to get. */
const TAB_ACTIVE_MAX_W = 168;
const SPRING = { damping: 18, stiffness: 190, mass: 0.9 } as const;

type TabDef = {
  name: keyof TabsParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { name: PATHS.TABS.SETTINGS as keyof TabsParamList, label: "Profil",  icon: "person-outline",     iconFocused: "person"      },
  // { name: PATHS.TABS.MEETINGS as keyof TabsParamList, label: "Live", icon: "videocam-outline",   iconFocused: "videocam"    },
  { name: PATHS.TABS.RESERVED_MEETINGS as keyof TabsParamList, label: "Séances", icon: "calendar-outline", iconFocused: "calendar" },
  { name: PATHS.TABS.HOME     as keyof TabsParamList, label: "Accueil", icon: "home-outline",       iconFocused: "home"        },
  // { name: PATHS.TABS.COURSES  as keyof TabsParamList, label: "Cours", icon: "library-outline",    iconFocused: "library"     },
  { name: PATHS.TABS.BOOKS    as keyof TabsParamList, label: "Livres",  icon: "book-outline",       iconFocused: "book"        },
  // { name: PATHS.TABS.STUDY_GUIDE    as keyof TabsParamList, label: "Guide", icon: "document-text-outline", iconFocused: "document-text" },
  // { name: PATHS.TABS.MEETING_VIEW   as keyof TabsParamList, label: "Replay", icon: "play-circle-outline",   iconFocused: "play-circle"   },
  // { name: PATHS.TABS.START_LEARNING as keyof TabsParamList, label: "Départ", icon: "rocket-outline",        iconFocused: "rocket"        },
  // { name: PATHS.TABS.PROGRESS_TODAY as keyof TabsParamList, label: "Progrès", icon: "trending-up-outline",  iconFocused: "trending-up"   },
  // { name: PATHS.TABS.EDU_HOME       as keyof TabsParamList, label: "Édu", icon: "school-outline",           iconFocused: "school"        },
  // { name: PATHS.TABS.STUDY_CRAFT    as keyof TabsParamList, label: "Atelier", icon: "construct-outline",    iconFocused: "construct"     },
  // { name: PATHS.TABS.AI_OWL         as keyof TabsParamList, label: "IA", icon: "bulb-outline",              iconFocused: "bulb"          },
  { name: PATHS.TABS.LEARN_CALENDAR as keyof TabsParamList, label: "Écoles", icon: "school-outline",        iconFocused: "school"        },
];

/**
 * One tab of the bar. Inactive tabs are icon-only; the active one expands
 * into a filled pill that reveals its label. Every tab derives its own
 * expansion from the shared spring position, so the pill appears to slide
 * sideways while the widths always add up to the bar.
 */
const TabPill = React.memo(({
  tab, index, pos, activeWidth, primary, inactiveColor, onPress,
}: {
  tab: TabDef;
  index: number;
  pos: SharedValue<number>;
  activeWidth: number;
  primary: string;
  inactiveColor: string;
  onPress: () => void;
}) => {
  // 1 when this tab owns the pill, 0 when it's a plain icon, fractional mid-slide.
  const shellStyle = useAnimatedStyle(() => {
    const t = Math.max(0, 1 - Math.abs(pos.value - index));
    return { width: TAB_COLLAPSED_W + (activeWidth - TAB_COLLAPSED_W) * t };
  });

  const pillStyle = useAnimatedStyle(() => {
    const t = Math.max(0, 1 - Math.abs(pos.value - index));
    return {
      opacity: t,
      transform: [{ scale: interpolate(t, [0, 1], [0.9, 1], "clamp") }],
    };
  });

  const activeIconStyle = useAnimatedStyle(() => {
    const t = Math.max(0, 1 - Math.abs(pos.value - index));
    return {
      opacity: t,
      transform: [{ scale: interpolate(t, [0, 0.6, 1], [0.7, 1.16, 1], "clamp") }],
    };
  });

  const idleIconStyle = useAnimatedStyle(() => {
    const t = Math.max(0, 1 - Math.abs(pos.value - index));
    return {
      opacity: 1 - t,
      transform: [{ scale: interpolate(t, [0, 1], [1, 0.8], "clamp") }],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const t = Math.max(0, 1 - Math.abs(pos.value - index));
    return {
      opacity: interpolate(t, [0.35, 1], [0, 1], "clamp"),
      transform: [{ translateX: interpolate(t, [0, 1], [12, 0], "clamp") }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      onPress={onPress}
    >
      <Animated.View style={[styles.tabShell, shellStyle]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            { backgroundColor: primary, shadowColor: primary },
            pillStyle,
          ]}
        />

        <View style={styles.iconBox}>
          <Animated.View style={[styles.iconLayer, idleIconStyle]}>
            <Ionicons name={tab.icon} size={ICON_SIZE} color={inactiveColor} />
          </Animated.View>
          <Animated.View style={[styles.iconLayer, activeIconStyle]}>
            <Ionicons name={tab.iconFocused} size={ICON_SIZE} color="#FFFFFF" />
          </Animated.View>
        </View>

        <Animated.Text numberOfLines={1} style={[styles.tabLabel, labelStyle]}>
          {tab.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

// ─── main tab bar ─────────────────────────────────────────────────────────────
const PillTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();
  const { width: W } = useWindowDimensions();

  const primary  = colors.primary;
  const barBg    = isDark ? "#0B1220" : "#FFFFFF";
  const inactive = isDark ? "rgba(148,163,184,0.8)" : "rgba(100,112,130,0.9)";

  // Map active route name → visual TABS index (independent of registration order)
  const activeRouteName = state.routes[state.index]?.name ?? "";
  const activeTabIndex  = Math.max(0, TABS.findIndex((t) => t.name === activeRouteName));

  /** The expanded pill takes whatever the collapsed tabs leave behind. */
  const activeWidth = Math.min(
    TAB_ACTIVE_MAX_W,
    W - BAR_PAD_H * 2 - TAB_COLLAPSED_W * (TABS.length - 1),
  );

  // Animated tab position — springs from the old index to the new one.
  const pos = useSharedValue(activeTabIndex);

  useEffect(() => {
    pos.value = withSpring(activeTabIndex, SPRING);
  }, [activeTabIndex, pos]);

  const goTo = useCallback(
    (name: keyof TabsParamList) => navigation.navigate(name as never),
    [navigation],
  );

  return (
    <View style={{ height: BAR_HEIGHT + insets.bottom }}>
      <View
        style={[
          styles.bar,
          {
            height: BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: barBg,
            borderTopColor: isDark ? "rgba(148,163,184,0.14)" : "rgba(18,42,78,0.06)",
            shadowOpacity: isDark ? 0.5 : 0.12,
          },
        ]}
      >
        <View style={styles.row}>
          {TABS.map((tab, i) => (
            <TabPill
              key={String(tab.name)}
              tab={tab}
              index={i}
              pos={pos}
              activeWidth={activeWidth}
              primary={primary}
              inactiveColor={inactive}
              onPress={() => goTo(tab.name)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: BAR_PAD_H,
    justifyContent: "center",
    shadowColor: "#000",
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: BAR_HEIGHT - 18,
  },
  tabShell: {
    height: TAB_HEIGHT,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  iconBox: {
    width: ICON_SIZE + 6,
    height: ICON_SIZE + 6,
    alignItems: "center",
    justifyContent: "center",
  },
  iconLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});

// ─── navigator ────────────────────────────────────────────────────────────────
const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName={PATHS.TABS.HOME}
    tabBar={(props) => <PillTabBar {...props} />}
    screenOptions={{ headerShown: false, lazy: true, tabBarHideOnKeyboard: true }}
  >
    <Tab.Screen name={PATHS.TABS.BOOKS}       component={BooksScreen}       />
    <Tab.Screen name={PATHS.TABS.COURSES}     component={CoursesScreen}     />
    <Tab.Screen name={PATHS.TABS.MEETINGS}    component={MeetingsScreen}    />
    <Tab.Screen
      name={PATHS.TABS.RESERVED_MEETINGS}
      component={ReservedMeetingsScreen}
    />
    <Tab.Screen name={PATHS.TABS.SETTINGS}    component={SettingsScreen}    />
    <Tab.Screen name={PATHS.TABS.PLANS}       component={PlansScreen}       />
    <Tab.Screen name={PATHS.TABS.STUDY_GUIDE}    component={StudyGuideScreen}    />
    <Tab.Screen name={PATHS.TABS.MEETING_VIEW}   component={MeetingViewScreen}   />
    <Tab.Screen name={PATHS.TABS.START_LEARNING} component={StartLearningScreen} />
    <Tab.Screen name={PATHS.TABS.PROGRESS_TODAY} component={ProgressTodayScreen} />
    <Tab.Screen name={PATHS.TABS.EDU_HOME}       component={EduHomeScreen}       />
    <Tab.Screen name={PATHS.TABS.STUDY_CRAFT}    component={StudyCraftScreen}    />
    <Tab.Screen name={PATHS.TABS.AI_OWL}         component={AIOwlScreen}         />
    <Tab.Screen name={PATHS.TABS.LEARN_CALENDAR} component={LearnCalendarScreen} />
    <Tab.Screen
      name={PATHS.TABS.HOME}
      component={HomeScreen}
      options={{ tabBarButton: () => null }}
    />
  </Tab.Navigator>
);

export default MainTabNavigator;