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

const ICON_SIZE = 24;
const BAR_HEIGHT = 64;
const BUBBLE_SIZE = 52;
const NOTCH_DEPTH = 26;
const SPRING = { damping: 20, stiffness: 260, mass: 0.8 } as const;

type TabDef = {
  name: keyof TabsParamList;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { name: PATHS.TABS.SETTINGS as keyof TabsParamList, icon: "person-outline",     iconFocused: "person"      },
  { name: PATHS.TABS.MEETINGS as keyof TabsParamList, icon: "videocam-outline",   iconFocused: "videocam"    },
  { name: PATHS.TABS.RESERVED_MEETINGS as keyof TabsParamList, icon: "calendar-outline", iconFocused: "calendar" },
  { name: PATHS.TABS.HOME     as keyof TabsParamList, icon: "home-outline",       iconFocused: "home"        },
  // { name: PATHS.TABS.COURSES  as keyof TabsParamList, icon: "library-outline",    iconFocused: "library"     },
  { name: PATHS.TABS.BOOKS    as keyof TabsParamList, icon: "book-outline",       iconFocused: "book"        },
  { name: PATHS.TABS.STUDY_GUIDE    as keyof TabsParamList, icon: "document-text-outline", iconFocused: "document-text" },
  { name: PATHS.TABS.MEETING_VIEW   as keyof TabsParamList, icon: "play-circle-outline",   iconFocused: "play-circle"   },
  // { name: PATHS.TABS.START_LEARNING as keyof TabsParamList, icon: "rocket-outline",        iconFocused: "rocket"        },
  // { name: PATHS.TABS.PROGRESS_TODAY as keyof TabsParamList, icon: "trending-up-outline",   iconFocused: "trending-up"   },
  // { name: PATHS.TABS.EDU_HOME       as keyof TabsParamList, icon: "school-outline",        iconFocused: "school"        },
  // { name: PATHS.TABS.STUDY_CRAFT    as keyof TabsParamList, icon: "construct-outline",     iconFocused: "construct"     },
  // { name: PATHS.TABS.AI_OWL         as keyof TabsParamList, icon: "bulb-outline",          iconFocused: "bulb"          },
  { name: PATHS.TABS.LEARN_CALENDAR as keyof TabsParamList, icon: "school-outline",        iconFocused: "school"        },
];

// ─── per-tab icon with scale/opacity animation ───────────────────────────────
const TabIcon = React.memo(({
  tab, focused, color, inactiveColor,
}: {
  tab: TabDef; focused: boolean; color: string; inactiveColor: string;
}) => {
  const prog = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    prog.value = withSpring(focused ? 1 : 0, { damping: 18, stiffness: 320 });
  }, [focused, prog]);

  const activeStyle = useAnimatedStyle(() => ({
    opacity: prog.value,
    transform: [{ scale: interpolate(prog.value, [0, 1], [0.6, 1.15], "clamp") }],
  }));
  const inactiveStyle = useAnimatedStyle(() => ({
    opacity: 1 - prog.value,
    transform: [{ scale: interpolate(prog.value, [0, 1], [1, 0.6], "clamp") }],
  }));

  return (
    <View style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }, inactiveStyle]}>
        <Ionicons name={tab.icon} size={ICON_SIZE} color={inactiveColor} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }, activeStyle]}>
        <Ionicons name={tab.iconFocused} size={ICON_SIZE} color={color} />
      </Animated.View>
    </View>
  );
});

// ─── main tab bar ─────────────────────────────────────────────────────────────
const NotchTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();
  const { width: W } = useWindowDimensions();

  const primary  = colors.primary;
  const barBg    = isDark ? "#0B1220" : "#FFFFFF";
  const inactive = isDark ? "rgba(148,163,184,0.7)" : "rgba(100,112,130,0.85)";

  // Map active route name → visual TABS index (independent of registration order)
  const activeRouteName = state.routes[state.index]?.name ?? "";
  const activeTabIndex  = Math.max(0, TABS.findIndex((t) => t.name === activeRouteName));

  const tabWidth = W / TABS.length;

  // measure each tab's center X via onLayout
  const [centers, setCenters] = useState<number[]>([]);
  const handleLayout = useCallback((i: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setCenters((prev) => { const n = [...prev]; n[i] = x + width / 2; return n; });
  }, []);

  // shared value: active tab center X — spring slides to new position
  const activeX = useSharedValue(tabWidth * activeTabIndex + tabWidth / 2);

  useEffect(() => {
    const cx = centers[activeTabIndex] ?? (tabWidth * activeTabIndex + tabWidth / 2);
    activeX.value = withSpring(cx, SPRING);
  }, [activeTabIndex, centers, activeX, tabWidth]);

  // bubble slides horizontally
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value - BUBBLE_SIZE / 2 }],
  }));

  // cradle (bar-colored circle) slides with bubble to create notch illusion
  const cradleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value - (BUBBLE_SIZE + 16) / 2 }],
  }));

  const totalHeight = BAR_HEIGHT + insets.bottom;

  return (
    <View style={{ height: totalHeight, backgroundColor: "transparent" }}>
      {/* bar */}
      <View style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        height: BAR_HEIGHT + insets.bottom,
        backgroundColor: barBg,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOpacity: isDark ? 0.5 : 0.12,
        shadowRadius: 16, shadowOffset: { width: 0, height: -4 },
        elevation: 12,
      }} />

      {/* sliding cradle — same color as bar, sits above bar to mask the notch */}
      <Animated.View pointerEvents="none" style={[{
        position: "absolute",
        top: NOTCH_DEPTH / 2,
        width: BUBBLE_SIZE + 16, height: BUBBLE_SIZE + 16,
        borderRadius: (BUBBLE_SIZE + 16) / 2,
        backgroundColor: barBg,
      }, cradleStyle]} />

      {/* sliding bubble */}
      <Animated.View style={[{
        position: "absolute",
        top: -(BUBBLE_SIZE / 2 - NOTCH_DEPTH / 2),
        width: BUBBLE_SIZE, height: BUBBLE_SIZE,
        borderRadius: BUBBLE_SIZE / 2,
        backgroundColor: primary,
        alignItems: "center", justifyContent: "center",
        shadowColor: primary, shadowOpacity: 0.5,
        shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
        elevation: 10,
      }, bubbleStyle]}>
        <Ionicons
          name={TABS[activeTabIndex].iconFocused}
          size={ICON_SIZE + 2}
          color="#FFFFFF"
        />
      </Animated.View>

      {/* tab touch targets */}
      <View style={{ flexDirection: "row", height: BAR_HEIGHT }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={String(tab.name)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            activeOpacity={0.8}
            onLayout={(e) => handleLayout(i, e)}
            onPress={() => navigation.navigate(tab.name as never)}
          >
            {i === activeTabIndex ? (
              <View style={{ width: 36, height: 36 }} />
            ) : (
              <TabIcon tab={tab} focused={false} color={primary} inactiveColor={inactive} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ─── navigator ────────────────────────────────────────────────────────────────
const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName={PATHS.TABS.HOME}
    tabBar={(props) => <NotchTabBar {...props} />}
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