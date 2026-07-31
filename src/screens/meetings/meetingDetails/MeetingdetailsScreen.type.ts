import type { MeetingStatusEnum } from "@config/enums/MeetingStatus.enum";

export type MeetingDetailsRouteParams = {
  meetingId: number | string;
};

export type ScheduleLine = {
  day: string;
  time: string;
  duration: string;
};

export type TeacherBadge = {
  emoji: string;
  label: string;
};

export type TeacherReviewItem = {
  rating: number;
  authorLabel?: string | null;
  comment: string;
};

export type TeacherMediaItem = {
  tag?: string;
  file_path?: string | null;
  thumbnail?: string | null;
  full_url?: string | null;
  fullUrl?: string | null;
  url?: string | null;
  teacherId?: number | string | null;
};

export type MeetingDetailsMeeting = {
  id?: number;
  name?: string | null;
  description?: string | null;

  materialName?: string | null;
  materialId?: number | string | null;
  material_id?: number | string | null;

  levelName?: string | null;
  levelId?: number | string | null;
  level_id?: number | string | null;

  teacherName?: string | null;
  teacherId?: number | string | null;
  teacher_id?: number | string | null;

  finalPrice?: number | null;
  price?: number | null;
  discount?: number | null;

  totalSessions?: number | null;
  total_sessions?: number | null;
  maxStudents?: number | null;
  max_students?: number | null;

  isPrivate?: boolean | number | string | null;
  is_private?: boolean | number | string | null;

  nextSessionAt?: string | null;
  groupsCount?: number | null;
  upcomingSessionsCount?: number | null;

  scheduleLines?: ScheduleLine[];
  mode?: string | null;
  city?: string | null;
  rating?: number | null;
  ratingAverage?: number | null;
  status?: MeetingStatusEnum | string | null;
};

export type MeetingDetailsTeacher = {
  id?: number;
  fullName?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  avatar?: string | null;
  media?: TeacherMediaItem[] | null;

  ratingAverage?: number | null;
  subject?: string | null;
  studentsCount?: number | null;
  reviewsCount?: number | null;
  followersCount?: number | null;
  yearsExperience?: number | null;
  aboutText?: string | null;

  badges?: TeacherBadge[];
  reviewItems?: TeacherReviewItem[];
};
