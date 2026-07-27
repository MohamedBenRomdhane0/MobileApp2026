import { PATHS } from "@config/constants/paths";
import type { LevelEnum } from "@config/enums/Level.enum";

export type AddKidsRouteParams =
  | { mode: "create" }
  | {
      mode: "edit";
      childId: number;
      initialFullName?: string;
      initialGender?: "boy" | "girl" | "";
      initialLevelId?: LevelEnum | number;
    };

export type RootStackParamList = {
  [PATHS.AUTH.ROOT]: undefined;
  [PATHS.ONBOARDING.ROOT]: undefined;
  [PATHS.APP.ROOT]: undefined;

  [PATHS.AUTH.WELCOME]: undefined;
  [PATHS.AUTH.SIGN_IN]: undefined;
  [PATHS.AUTH.SIGN_UP]: undefined;
  [PATHS.AUTH.FORGET_PASSWORD]: undefined;
  [PATHS.AUTH.VERIFICATION]: undefined;
  [PATHS.AUTH.RESET_PASSWORD]: undefined;

  [PATHS.ONBOARDING.ADD_KIDS]: undefined;

  [PATHS.APP.TABS]: undefined;
  [PATHS.APP.SETTINGS]: undefined;
  [PATHS.APP.PROFILE_PARENT]: undefined;
  [PATHS.APP.KIDS_LIST]: undefined;
  [PATHS.APP.ADD_KIDS]: undefined;
[PATHS.APP.TEACHER_PROFILE]: {
  teacherId: number;
};  [PATHS.APP.PARENT_DASHBOARD]: undefined;
  [PATHS.APP.COURSE_CHAPTERS]: undefined;
  [PATHS.APP.FAVORITE_COURSES]: undefined;
  [PATHS.APP.PLANS]: undefined;

  [PATHS.APP.BOOKS_FILE]: {
  bookId: number;
  pageNumber?: number;
  focusIconId?: number;
  focusVideoId?: number;
  openFromResume?: boolean;
};
  [PATHS.APP.BOOKS]: undefined;
 [PATHS.APP.TRAILERS]: undefined;
  [PATHS.APP.MEETING_DETAILS]: {
    meetingId: number | string;
  };

  [PATHS.APP.VIDEO]: {
    bookId: number;
    iconId: number;
    videoId?: number;
    videoUri?: string;
    materialName?: string;
  };

  [PATHS.APP.NOTIFICATIONS]: undefined;
  [PATHS.APP.MATERIAL_HUB]: undefined;
};

export type TabsParamList = {
  [PATHS.TABS.BOOKS]: undefined;
  [PATHS.TABS.COURSES]: undefined;
  [PATHS.TABS.MEETINGS]: undefined;
  [PATHS.TABS.SETTINGS]: undefined;
  [PATHS.TABS.HOME]: undefined;
  [PATHS.TABS.PLANS]: undefined;
  [PATHS.TABS.SUBSCRIPTION]: { plan: any } | undefined;
};