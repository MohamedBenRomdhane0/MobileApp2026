import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

import MainTabs from "@navigation/tabs/AnimatedTabBar";
import ParentInfoScreen from "@screens/parent/ParentInfoScreen/ParentInfoScreen";
import KidsListScreen from "@screens/parent/KidsList/KidsListScreen";
import AddKidsScreen from "@screens/child/AddKidsScreen";
import BookScreenFile from "@screens/books/bookFiles/BookScreenFile";
import VideoScreen from "@screens/videos/VideoScreen";
import TeacherProfileScreen from "@screens/teacher/TeacherProfileScreen";
import MaterialHubScreen from "@screens/materialHub/MaterialHubScreen";
import FavoriteCoursesScreen from "@screens/courses/FavoriteCoursesScreen";
import CourseChaptersScreen from "@screens/courses/courseChapters/CourseChaptersScreen";
import MeetingDetailsScreen from "@screens/meetings/meetingDetails/MeetingdetailsScreen";
import ReservedMeetingsScreen from "@screens/meetings/reservedMeetings/ReservedMeetingsScreen";
import JoinSessionScreen from "@screens/meetings/joinSession/JoinSessionScreen";
import PlansScreen from "@screens/plans/PlansScreen";
import DetailPlanMettingScreen from "@screens/plans/DetailPlanMettingScreen";
import TrailersScreen from "@screens/trailers/TrailersScreen";
import CustomizeAvatarScreen from "@screens/child/customizeAvatar/CustomizeAvatarScreen";
import TopupScreen from "@screens/wallet/TopupScreen/TopupScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppTree() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PATHS.APP.TABS} component={MainTabs} />
      <Stack.Screen
        name={PATHS.APP.PROFILE_PARENT}
        component={ParentInfoScreen}
      />
      <Stack.Screen name={PATHS.APP.KIDS_LIST} component={KidsListScreen} />
      <Stack.Screen name={PATHS.APP.ADD_KIDS} component={AddKidsScreen} />
      <Stack.Screen name={PATHS.APP.BOOKS_FILE} component={BookScreenFile} />
      <Stack.Screen name={PATHS.APP.VIDEO} component={VideoScreen} />
      <Stack.Screen
        name={PATHS.APP.TEACHER_PROFILE}
        component={TeacherProfileScreen}
      />
      <Stack.Screen
        name={PATHS.APP.MATERIAL_HUB}
        component={MaterialHubScreen}
      />
      <Stack.Screen
        name={PATHS.APP.FAVORITE_COURSES}
        component={FavoriteCoursesScreen}
      />
      <Stack.Screen
        name={PATHS.APP.COURSE_CHAPTERS}
        component={CourseChaptersScreen}
      />
      <Stack.Screen
        name={PATHS.APP.MEETING_DETAILS}
        component={MeetingDetailsScreen}
      />
      <Stack.Screen
        name={PATHS.APP.RESERVED_MEETINGS}
        component={ReservedMeetingsScreen}
      />
      <Stack.Screen
        name={PATHS.APP.JOIN_SESSION}
        component={JoinSessionScreen}
      />
      <Stack.Screen name={PATHS.APP.PLANS} component={PlansScreen} />
      <Stack.Screen
        name={PATHS.APP.DETAIL_PLAN_MEETING}
        component={DetailPlanMettingScreen}
      />
      <Stack.Screen name={PATHS.APP.TRAILERS} component={TrailersScreen} />
      <Stack.Screen
        name={PATHS.APP.CUSTOMIZE_AVATAR}
        component={CustomizeAvatarScreen}
      />
      <Stack.Screen
        name={PATHS.APP.TOPUP}
        component={TopupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}