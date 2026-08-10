import { Ionicons } from "@expo/vector-icons";
import { PATHS } from "@config/constants/paths";
import type {
  DailySnippet,
  HomePalette,
  HomeQuickAction,
  LevelVideoCard,
  MeetingCard,
  TeacherCard,
  ThemeColors,
} from "./HomeScreen.type";

export const HOME_UI = {
  title: "home.title",
  hello: "home.hello",
  openFirstBook: "home.open_first_book",
  watchExtraVideo: "home.watch_extra_video",
  meetingsTitle: "home.meetings_title",
  meetingsSubtitle: "home.meetings_subtitle",
  videosTitle: "home.videos_title",
  teachersTitle: "home.teachers_title",
  teachersNote: "home.teachers_note",
  reserveNow: "home.reserve_now",
  enterMeeting: "home.enter_meeting",
  follow: "home.follow",
  followed: "home.followed",

  helloPresence: "home.hello_presence",
  subscribeTitle: "home.subscribe_title",
  subscribeSub: "home.subscribe_subtitle",
  subscribeCta: "home.subscribe_cta",
  schoolBooks: "home.school_books_title",
  liveMeetings: "home.live_meetings_title",
  join: "home.join",

  subjectsTitle: "home.subjects_title",
  availableTeachers: "home.available_teachers",
  continueTitle: "home.continue_title",
  continueCta: "home.continue_cta",
  progressLabel: "home.progress_label",
  noLiveNow: "home.no_live_now",
  booksEmpty: "book.empty_title",
} as const;

export const HOME_COMMON_UI = {
  seeAll: "common.see_all",
  open: "common.open",
  live: "common.live",
  tapToRetry: "common.tap_to_retry",
  notifications: "common.notifications",
} as const;

/**
 * Home palette — soft canvas, deep-navy ink and the app teal as the single
 * interactive accent (see `.claude/skills/frontend-design`). Mirrors the
 * agenda palette in `ReservedMeetingsScreen.styles.ts` so both M04 surfaces
 * read as one system.
 */
export function getHomePalette(colors: ThemeColors, isDark: boolean): HomePalette {
  return {
    canvas: isDark ? colors.bg : "#EEF3F8",
    surface: isDark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
    surfaceAlt: isDark ? "rgba(255,255,255,0.08)" : "#F5F8FC",
    ink: isDark ? colors.text : "#122A4E",
    sub: isDark ? colors.muted : "#64748B",
    muted: isDark ? "rgba(148,163,184,0.85)" : "#9AA6B8",
    hairline: isDark ? "rgba(148,163,184,0.18)" : "#EDF1F6",
    teal: "#22BEC8",
    tealSoft: isDark ? "rgba(34,190,200,0.16)" : "#E9F9FA",
    live: "#EF4444",
    liveSoft: isDark ? "rgba(239,68,68,0.18)" : "#FEE2E2",
    navy: isDark ? "#0F1A2E" : "#0F2E57",
  };
}

export const HOME_TOKENS = {
  subscribeGradient: ["#22BEC8", "#046b72"] as [string, string],
  heroGradientLight: ["#153A6B", "#1D3B65", "#091D36"] as [string, string, string],
  heroGradientDark: ["#0B1220", "#0B1B33", "#060B14"] as [string, string, string],
  /** Metallic gold gradient behind the daily streak pill. */
  streakGradient: ["#FFE9A8", "#F8D66D", "#D99A24"] as [string, string, string],
  /** Join CTA on the live card — warmer at the top, deeper at the bottom. */
  liveJoinGradient: ["#FB7185", "#E11D48"] as [string, string],
  /** Entrance + press motion, shared by every animated home card. */
  enterDuration: 420,
  enterStagger: 80,
  pressScale: 0.96,
} as const;

/**
 * Per-section accent hues. Each block on the feed carries its own color on
 * the header tile, count pill and "see all" chip, so a long scroll stays
 * navigable without extra chrome.
 */
export const HOME_SECTION_ACCENT = {
  subjects: "#22BEC8",
  books: "#7C5CFC",
  live: "#EF4444",
  teachers: "#F59E0B",
} as const;

/** Reactions shown as circular glass emoji quick actions in the hero. */
export const HERO_EMOJIS = ["😍", "😊", "😳", "🥳", "😲"] as const;

export type HeroEmoji = (typeof HERO_EMOJIS)[number];

/** Motivational message shown when a hero emoji is tapped (i18n keys). */
export const HERO_EMOJI_MESSAGES: Record<
  HeroEmoji,
  { titleKey: string; textKey: string }
> = {
  "😍": { titleKey: "home.emoji.love.title", textKey: "home.emoji.love.text" },
  "😊": { titleKey: "home.emoji.happy.title", textKey: "home.emoji.happy.text" },
  "😳": { titleKey: "home.emoji.shy.title", textKey: "home.emoji.shy.text" },
  "🥳": { titleKey: "home.emoji.party.title", textKey: "home.emoji.party.text" },
  "😲": { titleKey: "home.emoji.wow.title", textKey: "home.emoji.wow.text" },
};

export const SUBSCRIBE_GRADIENT: [string, string] = ["#22BEC8", "#046b72"];

/** Quick-action shortcuts sitting on the card that overlaps the hero curve. */
export const HOME_QUICK_ACTIONS: HomeQuickAction[] = [
  { id: "books", labelKey: "home.quick.books", icon: "library", tint: "#22BEC8", route: PATHS.TABS.BOOKS },
  { id: "live", labelKey: "home.quick.live", icon: "videocam", tint: "#EF4444", route: PATHS.TABS.MEETINGS },
  { id: "reserved", labelKey: "home.quick.reserved", icon: "calendar", tint: "#7C5CFC", route: PATHS.APP.RESERVED_MEETINGS },
  { id: "plans", labelKey: "home.quick.plans", icon: "diamond", tint: "#F59E0B", route: PATHS.TABS.PLANS },
];

export const TEACHER_COLORS = ["#F59E0B", "#8B5CF6", "#10B981", "#3B82F6", "#EC4899"];

export const DAILY_SNIPPETS: DailySnippet[] = [
  { id: "adhkar", labelKey: "home.snippet.adhkar.label", icon: "sunny-outline" as keyof typeof Ionicons.glyphMap, textKey: "home.snippet.adhkar.text", sourceKey: "home.snippet.adhkar.source" },
  { id: "hadith", labelKey: "home.snippet.hadith.label", icon: "chatbubbles-outline" as keyof typeof Ionicons.glyphMap, textKey: "home.snippet.hadith.text", sourceKey: "home.snippet.hadith.source" },
  { id: "hikma", labelKey: "home.snippet.hikma.label", icon: "sparkles-outline" as keyof typeof Ionicons.glyphMap, textKey: "home.snippet.hikma.text", sourceKey: "home.snippet.hikma.source" },
];

export const MOCK_TEACHERS: TeacherCard[] = [
  { id: 100, fullName: "Tarek Briki", subject: "رياضيات", avatar: require("../../../assets/teachers/tarek.png") },
  { id: 101, fullName: "Hajer Brahim", subject: "لغة عربية", avatar: require("../../../assets/teachers/ismail.png") },
  { id: 102, fullName: "تونس زهرة رحومة", subject: "فرنسية", avatar: require("../../../assets/teachers/tounes.png") },
];

export const MOCK_MEETINGS: MeetingCard[] = [
  {
    id: "m1",
    teacherName: "Tarek Briki",
    subjectLabel: "رياضيات • السنة الرابعة",
    dayLabel: "الإثنين",
    timeLabel: "18:00 - 19:30",
    nextDateLabel: "08/12/2025",
    price: "40",
    isReserved: true,
    bgColor: "#FECACA",
    headerColor: "#FB7185",
    avatar: require("../../../assets/teachers/tarek.png"),
  },
  {
    id: "m2",
    teacherName: "Hajer Brahim",
    subjectLabel: "لغة عربية • السنة الرابعة",
    dayLabel: "الأربعاء",
    timeLabel: "19:30 - 21:00",
    nextDateLabel: "10/12/2025",
    price: "40",
    oldPrice: "55",
    discountLabel: "تخفيض %20",
    bgColor: "#E9D5FF",
    headerColor: "#A855F7",
    avatar: require("../../../assets/teachers/ismail.png"),
  },
];

const VIDEO_COVER = require("../../../assets/images/cover_video.png");

export const MOCK_VIDEOS: LevelVideoCard[] = [
  { id: "v1", title: "جمع و طرح الأعداد إلى 999", subject: "رياضيات", teacherName: "Tarek Briki", duration: "12:35", thumbnail: VIDEO_COVER },
  { id: "v2", title: "فهم الجملة الاسمية", subject: "لغة عربية", teacherName: "Hajer Brahim", duration: "09:20", thumbnail: VIDEO_COVER },
];

export const AUGUST_RESERVED_DAYS: import("./HomeScreen.type").ReservedDay[] = [
  { day: 5,  teacherPhoto: require("../../../assets/teachers/tarek.png"),  accent: "#F97316" },
  { day: 12, teacherPhoto: require("../../../assets/teachers/ismail.png"), accent: "#22BEC8" },
  { day: 19, teacherPhoto: require("../../../assets/teachers/tounes.png"), accent: "#7C4DCC" },
  { day: 25, teacherPhoto: require("../../../assets/teachers/tarek.png"),  accent: "#F97316" },
];
