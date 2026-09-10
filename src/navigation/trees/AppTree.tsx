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
import AudioPlayerScreen from "@screens/audio/AudioPlayerScreen";
import DocsViewerScreen from "@screens/docs/DocsViewerScreen";
import TeacherProfileScreen from "@screens/teacher/TeacherProfileScreen";
import AllTeachersScreen from "@screens/teachers/AllTeachers/AllTeachersScreen";
import MaterialHubScreen from "@screens/materialHub/MaterialHubScreen";
import FavoriteCoursesScreen from "@screens/courses/FavoriteCoursesScreen";
import CourseChaptersScreen from "@screens/courses/courseChapters/CourseChaptersScreen";
import MeetingDetailsScreen from "@screens/meetings/meetingDetails/MeetingdetailsScreen";
import ReservedMeetingsScreen from "@screens/meetings/reservedMeetings/ReservedMeetingsScreen";
import JoinSessionScreen from "@screens/meetings/joinSession/JoinSessionScreen";
import PlansScreen from "@screens/plans/PlansScreen";
import CheckoutScreen from "@screens/plans/CheckoutScreen/CheckoutScreen";
import PlanUIScreen from "@screens/plans/PlanUIScreen";
import PlanProPricingSectionScreen from "@screens/plans/PlanProPricingSectionScreen";
import PlanUnlockScreen from "@screens/plans/PlanUnlockScreen";
import DetailPlanMettingScreen from "@screens/plans/DetailPlanMettingScreen";
import TrailersScreen from "@screens/trailers/TrailersScreen";
import CustomizeAvatarScreen from "@screens/child/customizeAvatar/CustomizeAvatarScreen";
import TopupScreen from "@screens/wallet/TopupScreen/TopupScreen";
import RecordMeetingSilverScreen from "@screens/meetings/recordMeetingSilver/RecordMeetingSilver";
import RecordTimelineScreen from "@screens/meetings/recordTimeline/RecordTimeline";
import RequireAuth from "@components/guards/RequireAuth";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthProtected = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth>{children}</RequireAuth>
);

export default function AppTree() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PATHS.APP.TABS} component={MainTabs} />
      <Stack.Screen
        name={PATHS.APP.PROFILE_PARENT}
        component={() => (
          <AuthProtected>
            <ParentInfoScreen />
          </AuthProtected>
        )}
      />
      <Stack.Screen
        name={PATHS.APP.KIDS_LIST}
        component={() => (
          <AuthProtected>
            <KidsListScreen />
          </AuthProtected>
        )}
      />
      <Stack.Screen
        name={PATHS.APP.ADD_KIDS}
        component={() => (
          <AuthProtected>
            <AddKidsScreen />
          </AuthProtected>
        )}
      />
      <Stack.Screen name={PATHS.APP.BOOKS_FILE} component={BookScreenFile} />
      <Stack.Screen name={PATHS.APP.VIDEO} component={VideoScreen} />
      <Stack.Screen name={PATHS.APP.AUDIO} component={AudioPlayerScreen} />
      <Stack.Screen name={PATHS.APP.DOCS} component={DocsViewerScreen} />
      <Stack.Screen
        name={PATHS.APP.TEACHER_PROFILE}
        component={TeacherProfileScreen}
      />
      <Stack.Screen
        name={PATHS.APP.ALL_TEACHERS}
        component={AllTeachersScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name={PATHS.APP.MATERIAL_HUB}
        component={MaterialHubScreen}
      />
      <Stack.Screen
        name={PATHS.APP.FAVORITE_COURSES}
        component={() => (
          <AuthProtected>
            <FavoriteCoursesScreen />
          </AuthProtected>
        )}
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
        component={() => (
          <AuthProtected>
            <ReservedMeetingsScreen />
          </AuthProtected>
        )}
      />
      <Stack.Screen
        name={PATHS.APP.JOIN_SESSION}
        component={() => (
          <AuthProtected>
            <JoinSessionScreen />
          </AuthProtected>
        )}
      />
      <Stack.Screen name={PATHS.APP.PLANS} component={PlansScreen} />
      <Stack.Screen
        name={PATHS.APP.PLANS_CHECKOUT}
        component={() => (
          <AuthProtected>
            <CheckoutScreen />
          </AuthProtected>
        )}
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name={PATHS.APP.PLAN_UI}
        component={PlanUIScreen}
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name={PATHS.APP.PLAN_PRO_PRICING}
        component={() => (
          <AuthProtected>
            <PlanProPricingSectionScreen />
          </AuthProtected>
        )}
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name={PATHS.APP.PLAN_UNLOCK}
        component={() => (
          <AuthProtected>
            <PlanUnlockScreen />
          </AuthProtected>
        )}
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name={PATHS.APP.DETAIL_PLAN_MEETING}
        component={DetailPlanMettingScreen}
      />
      <Stack.Screen name={PATHS.APP.TRAILERS} component={TrailersScreen} />
      <Stack.Screen
        name={PATHS.APP.CUSTOMIZE_AVATAR}
        component={() => (
          <AuthProtected>
            <CustomizeAvatarScreen />
          </AuthProtected>
        )}
      />
      <Stack.Screen
        name={PATHS.APP.TOPUP}
        component={() => (
          <AuthProtected>
            <TopupScreen />
          </AuthProtected>
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PATHS.APP.RECORD_MEETING_SILVER}
        component={() => (
          <AuthProtected>
            <RecordMeetingSilverScreen />
          </AuthProtected>
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PATHS.APP.RECORD_TIMELINE}
        component={() => (
          <AuthProtected>
            <RecordTimelineScreen />
          </AuthProtected>
        )}
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
    </Stack.Navigator>
  );
}
