import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";

export type TrailersScreenNav = NativeStackNavigationProp<RootStackParamList>;

export interface TrailerTeacherItem {
  /** deduplication key — meeting id (not teacher id, since same teacher may have many meetings) */
  meetingId:    number;
  teacherId:    number;
  teacherName:  string;
  subject:      string;
  rating:       number;
  price:        number;
  scheduleText: string;
  /** next session badge label e.g. "14:00 ث" */
  nextBadge:    string | null;
  /** live viewer count if available */
  viewerCount:  number | null;
  /** inline avatar from meeting payload */
  avatarUrl:    string | null;
  /** inline trailer from meeting payload — may be null until fetched */
  trailerUrl:   string | null;
  trailerThumbnail: string | null;
  /** subject filter material id */
  materialId:   number | null;
  materialName: string;
}

export type SelectedTeachers = Record<number, boolean>;
