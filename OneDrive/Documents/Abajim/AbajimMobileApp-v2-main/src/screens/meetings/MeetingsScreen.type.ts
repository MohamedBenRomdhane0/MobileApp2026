import type { Ionicons } from "@expo/vector-icons";
import type { MeetingListItemUI } from "@redux/apis/meetings/meetingApi.type";

export type GradientColors = readonly [string, string, ...string[]];

export type MeetingCategoryKey =
  | "all"
  | "math"
  | "arabic"
  | "french"
  | "science"
  | "social"
  | "english";

export type MeetingSectionKey = "liveNow" | "allTeachers";

export type MeetingCategoryItem = {
  key: MeetingCategoryKey;
  label: string;
};

export type MeetingSubjectOption = {
  key: Exclude<MeetingCategoryKey, "all">;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  shortCode: string;
};

export type SubjectThemeItem = {
  accent: string;
  softBg: string;
  gradient: GradientColors;
};

export type MeetingResolvedSubject = {
  key: Exclude<MeetingCategoryKey, "all">;
  labelKey: string;
};

export type MeetingsScreenMeetingItem = MeetingListItemUI;
