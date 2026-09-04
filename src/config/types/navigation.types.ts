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
};
[PATHS.APP.ALL_TEACHERS]: undefined;
[PATHS.APP.PARENT_DASHBOARD]: undefined;
  [PATHS.APP.COURSE_CHAPTERS]: undefined;
  [PATHS.APP.FAVORITE_COURSES]: undefined;
  [PATHS.APP.PLANS]: undefined;
  [PATHS.APP.PLANS_CHECKOUT]: {
    planId: number;
    planTitle: string;
    periodLabel: string;
    price: number;
    currency?: string;
  };
  [PATHS.APP.PLAN_UI]: undefined;
  [PATHS.APP.PLAN_PRO_PRICING]: undefined;
  [PATHS.APP.PLAN_UNLOCK]: { packId?: "pack1" | "pack2" } | undefined;
  [PATHS.APP.DETAIL_PLAN_MEETING]: undefined;

  [PATHS.APP.START_LEARNING]: undefined;
  [PATHS.APP.PROGRESS_TODAY]: undefined;
  [PATHS.APP.EDU_HOME]: undefined;
  [PATHS.APP.STUDY_GUIDE]: undefined;
  [PATHS.APP.STUDY_CRAFT]: undefined;
  [PATHS.APP.AI_OWL]: undefined;
  [PATHS.APP.LEARN_CALENDAR]: undefined;

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

  [PATHS.APP.RESERVED_MEETINGS]: undefined;

  [PATHS.APP.JOIN_SESSION]: undefined;

  [PATHS.APP.VIDEO]: {
    bookId: number;
    iconId: number;
    videoId?: number;
    videoUri?: string;
    materialName?: string;
  };

  [PATHS.APP.AUDIO]: {
    bookId: number;
    iconId: number;
    materialName?: string;
  };

  [PATHS.APP.DOCS]: {
    bookId: number;
    iconId: number;
    materialName?: string;
  };

  [PATHS.APP.NOTIFICATIONS]: undefined;
  [PATHS.APP.MATERIAL_HUB]: { levelId?: number; materialId?: number; materialName?: string } | undefined;
  [PATHS.APP.CUSTOMIZE_AVATAR]: undefined;
  [PATHS.APP.TOPUP]: { amount: number };
  [PATHS.APP.RECORD_MEETING_SILVER]: undefined;
  [PATHS.APP.RECORD_TIMELINE]: undefined;
};

export type TabsParamList = {
  [PATHS.TABS.BOOKS]: undefined;
  [PATHS.TABS.COURSES]: undefined;
  [PATHS.TABS.MEETINGS]: undefined;
  [PATHS.TABS.RESERVED_MEETINGS]: undefined;
  [PATHS.TABS.SETTINGS]: undefined;
  [PATHS.TABS.HOME]: undefined;
  [PATHS.TABS.PLANS]: undefined;
  [PATHS.TABS.SUBSCRIPTION]: { plan: any } | undefined;
  [PATHS.TABS.STUDY_GUIDE]: undefined;
  [PATHS.TABS.MEETING_VIEW]: undefined;
  [PATHS.TABS.START_LEARNING]: undefined;
  [PATHS.TABS.PROGRESS_TODAY]: undefined;
  [PATHS.TABS.EDU_HOME]: undefined;
  [PATHS.TABS.STUDY_CRAFT]: undefined;
  [PATHS.TABS.AI_OWL]: undefined;
  [PATHS.TABS.LEARN_CALENDAR]: undefined;
};