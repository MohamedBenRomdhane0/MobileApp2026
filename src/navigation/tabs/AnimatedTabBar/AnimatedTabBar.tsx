import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import LiquidGlassTabBar from "@components/liquidGlass/LiquidGlassTabBar";

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

const Tab = createBottomTabNavigator();

function LiquidTabBar(props: BottomTabBarProps) {
  return <LiquidGlassTabBar {...props} />;
}

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(p) => <LiquidTabBar {...p} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Books" component={BooksScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Meetings" component={MeetingsScreen} />
      <Tab.Screen name="ReservedMeetings" component={ReservedMeetingsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Plans" component={PlansScreen} />
      <Tab.Screen name="StudyGuide" component={StudyGuideScreen} />
      <Tab.Screen name="MeetingView" component={MeetingViewScreen} />
      <Tab.Screen name="StartLearning" component={StartLearningScreen} />
      <Tab.Screen name="ProgressToday" component={ProgressTodayScreen} />
      <Tab.Screen name="EduHome" component={EduHomeScreen} />
      <Tab.Screen name="StudyCraft" component={StudyCraftScreen} />
      <Tab.Screen name="AIOwl" component={AIOwlScreen} />
      <Tab.Screen name="LearnCalendar" component={LearnCalendarScreen} />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
