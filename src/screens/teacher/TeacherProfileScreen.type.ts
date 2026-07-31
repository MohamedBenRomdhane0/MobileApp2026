import type {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";

export type RouteParams = {
  teacherId?: number | string;
};

export type TeacherProfileRouteMap = {
  TeacherProfile: RouteParams;
};

export type Nav = NavigationProp<ParamListBase>;

export type TeacherLevelUI = {
  id: number;
  name: string;
  nameAr: string | null;
  nameFr?: string | null;
  nameEn?: string | null;
};

export type TeacherPerformanceVM = {
  topStudentsCount?: number | null;
  regionalSuccessRate?: number | null;
  improvementRate?: number | null;
};

export type ReviewItem = {
  id: string;
  rating: number;
  authorLabel: string;
  levelLabel: string;
  comment: string;
};

export type LessonItem = {
  id: string;
  title: string;
  viewsText: string;
  durationText: string;
  index: number;
};

export type PlanScheduleTimeItem = {
  id: string;
  dayLabel: string;
  timeText: string;
};

export type PlanScheduleGroupItem = {
  id: string;
  groupCode: string;
  summaryText: string;
  occupancyText: string;
  occupancyProgress: number;
  isHighlighted: boolean;
  isSelected: boolean;
  times: PlanScheduleTimeItem[];
};

export type PlanItem = {
  id: string;
  title: string;
  summaryText: string;
  priceText: string;
  unitPriceText: string;
  autoBookingText: string;
  isFeatured: boolean;
  scheduleGroups: PlanScheduleGroupItem[];
};

export type MeetingItem = {
  id: string;
  title: string;
  subtitle: string;
  statusText: string;
  seatsText: string;
  dayLabel: string;
  timeText: string;
  isSoon: boolean;
};

export type TeacherProfileVM = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  initials: string;

  // ─── Trailer ─────────────────────────────────────────────────────────────
  trailerUrl: string | null;
  trailerThumbnail: string | null;
  trailerMimeType: string | null;

  subject: string;

  isFollowed: boolean;
  followersCount: number;

  studentsCount: number;
  reviewsCount: number;
  ratingAverage: number | null;
  yearsExperience: number | null;

  levels: TeacherLevelUI[];
  levelsText: string;

  publishedLessonsCount: number;

  aboutText: string;
  bioText: string;
  educationText: string;
  experienceText: string;

  performance?: TeacherPerformanceVM | null;
  topStudentsCount?: number | null;
  regionalSuccessRate?: number | null;
  improvementRate?: number | null;

  reviewItems: ReviewItem[];
  lessonItems: LessonItem[];
  badges: Array<{
    emoji: string;
    label: string;
  }>;
};

export type FollowerVM = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  initials: string;
};
