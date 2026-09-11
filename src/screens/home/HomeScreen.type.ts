import type { ImageSourcePropType } from "react-native";
import type { Ionicons } from "@expo/vector-icons";
import type { AppColors } from "@theme/types";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import type { PlanUI } from "@redux/apis/plans/plansApi.type";

export type ThemeColors = AppColors;

export type IoniconName = keyof typeof Ionicons.glyphMap;

/** Styles produced by `createHomeStyles` — shared by every home block. */
export type HomeStyles = ReturnType<
  typeof import("./HomeScreen.styles").createHomeStyles
>;

/** Resolved home surface palette (light or dark). */
export type HomePalette = {
  canvas: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  sub: string;
  muted: string;
  hairline: string;
  teal: string;
  tealSoft: string;
  live: string;
  liveSoft: string;
  navy: string;
};

/** Props every home block receives so it can style itself consistently. */
export type HomeBlockBaseProps = {
  styles: HomeStyles;
  palette: HomePalette;
  isRTL: boolean;
};

export type HomeQuickAction = {
  id: "books" | "live" | "reserved" | "plans";
  labelKey: string;
  icon: IoniconName;
  tint: string;
  route: string;
};

export type SectionHeaderProps = HomeBlockBaseProps & {
  title: string;
  count?: number;
  seeAllLabel?: string;
  onSeeAll?: () => void;
  /** Icon shown in the tinted tile before the title. */
  icon?: IoniconName;
  /** Section hue for the tile, count pill and link chip. Defaults to teal. */
  accent?: string;
};

/** Which state a data-driven section is in. */
export type SectionStatus = "loading" | "error" | "empty";

export type SectionStateProps = HomeBlockBaseProps & {
  status: SectionStatus;
  message?: string;
  onRetry?: () => void;
};

export type HomeHeroProps = HomeBlockBaseProps & {
  childName: string;
  levelLabel: string;
  isDark: boolean;
  /** True once the user scrolls; restores the hero top inset. */
  scrolled?: boolean;
};

export type QuickActionsProps = HomeBlockBaseProps & {
  actions: HomeQuickAction[];
  onPressAction: (action: HomeQuickAction) => void;
};

/** A book the child already started, with the label to resume it. */
export type HomeResume = {
  book: BookListItemUI;
  lessonTitle: string;
  progress: number;
};

export type ContinueCardProps = HomeBlockBaseProps & {
  resume: HomeResume;
  title: string;
  ctaLabel: string;
  progressLabel: string;
  onPress: () => void;
};

export type MaterialsRowProps = HomeBlockBaseProps & {
  materials: MaterialUI[];
  isDark: boolean;
  getLabel: (material: MaterialUI) => string;
  onPressMaterial: (material: MaterialUI) => void;
};

export type BooksRowProps = HomeBlockBaseProps & {
  books: BookListItemUI[];
  unnamedLabel: string;
  onPressBook: (bookId: number) => void;
  onLayoutReady?: (scrollToEnd: () => void) => void;
};

export type LiveNowCardProps = HomeBlockBaseProps & {
  title: string;
  meta: string;
  liveLabel: string;
  joinLabel: string;
  onJoin: () => void;
};

export type TeachersRowProps = HomeBlockBaseProps & {
  teachers: TeacherCard[];
  onPressTeacher: (teacherId: number) => void;
};

export type SubscribeBannerProps = HomeBlockBaseProps & {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPress: () => void;
};

/** Discovery-mode hero replacement shown to unauthenticated guests. */
export type DiscoveryModeCardProps = HomeBlockBaseProps & {
  isDark: boolean;
  titleLabel: string;
  subtitleLabel: string;
  ctaLabel: string;
  onPress: () => void;
};

/** Compact plan cards in a 2-column grid — monthly-priced mini tiles. */
export type MiniPlanCardsProps = HomeBlockBaseProps & {
  plans: PlanUI[];
  currencyLabel: string;
  perMonthLabel: string;
  annualLabel: string;
  startingFromLabel: string;
  popularLabel: string;
  ctaLabel: string;
  noPricingLabel?: string;
  onPress: () => void;
  onPlanPress?: (planId: number) => void;
};

export type TeacherCard = {
  id: number;
  fullName: string;
  subject: string;
  avatar?: ImageSourcePropType;
  avatarUrl?: string | null;
  rating?: number | null;
  isFollowed?: boolean;
  followersCount?: number;
};

export type MeetingCard = {
  id: string;
  teacherName: string;
  subjectLabel: string;
  dayLabel: string;
  timeLabel: string;
  nextDateLabel: string;
  price: string;
  oldPrice?: string;
  isReserved?: boolean;
  bgColor: string;
  headerColor: string;
  discountLabel?: string;
  avatar: ImageSourcePropType;
};

export type LevelVideoCard = {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  duration: string;
  thumbnail: ImageSourcePropType;
};

export type DailySnippet = {
  id: "adhkar" | "hadith" | "hikma";
  labelKey: string;
  icon: IoniconName;
  textKey: string;
  sourceKey?: string;
};

export type ReservedDay = {
  day: number;
  teacherPhoto: number | { uri: string };
  accent: string;
};

export type SummaryStat = {
  label: string;
  value: string | number;
  color: string;
};

export type SummaryLiveInfo = {
  subject: string;
  teacherName: string;
  participants: number;
  onJoin: () => void;
  joinLabel: string;
  liveLabel: string;
};

export type SummaryCardProps = HomeBlockBaseProps & {
  title: string;
  meta: string;
  teacherPhoto: number | { uri: string };
  liveLabel: string;
  joinLabel: string;
  isLive: boolean;
  startTimeLabel: string;
  nextSessionDate?: string;
  participants: number;
  hasReservedMeeting: boolean;
  reserveLabel?: string;
  onJoin: () => void;
  onReserve?: () => void;
};

export type ActivitiesCardProps = HomeBlockBaseProps & {
  title: string;
  subtitle: string;
  weekDays: string[];
  reservedDays: ReservedDay[];
  today: number;
  monthLabel?: string;
  targetDate?: Date;
  onMonthAdvance?: () => void;
  onSeeAll?: () => void;
};

export type DynamicIslandNotificationProps = {
  visible: boolean;
  teacherPhoto: number | { uri: string };
  liveLabel: string;
  teacherName: string;
  meetingTitle: string;
  meetingTime: string;
  joinLabel: string;
  timestamp: string;
  onPress: () => void;
  onDismiss: () => void;
  topInset: number;
  /** Auto-show interval in ms. When set, the pill cycles on/off automatically. */
  autoShowIntervalMs?: number;
};
