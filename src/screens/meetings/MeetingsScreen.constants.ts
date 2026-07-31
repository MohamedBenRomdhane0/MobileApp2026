import type {
  MeetingCategoryItem,
  MeetingSectionKey,
  MeetingSubjectOption,
  SubjectThemeItem,
} from "./MeetingsScreen.type";

export const MEETINGS_UI = {
  heroTitle:          "meetings.hero_title",
  heroSubtitle:       "meetings.hero_subtitle",
  searchPlaceholder:  "meetings.search_placeholder",
  sessionsSuffix:     "meetings.sessions_suffix",
  teachersSuffix:     "meetings.teachers_suffix",
  teacherPrefix:      "meetings.teacher_prefix",
  detailsButton:      "meetings.details_button",
  featuredTitle:      "meetings.featured_title",
  allMeetingsTitle:   "meetings.all_meetings_title",
  priceCurrency:      "common.currency_tnd",
  loading:            "common.loading",
  emptyTitle:         "meetings.empty_title",
  emptySubtitle:      "meetings.empty_subtitle",
  retry:              "common.retry",
  genericError:       "common.generic_error",
  bookNow:            "meetings.book_now",
  monthSuffix:        "meetings.month_suffix",
  nextSession:        "meetings.next_session",
  verifiedTeacher:    "meetings.verified_teacher",
  daysLabel:          "meetings.days_label",
  sessionsCountLabel: "meetings.sessions_count_label",
  levelLabel:         "meetings.level_label",
  priceFilterLabel:   "meetings.price_filter_label",
} as const;

export const MEETINGS_SECTIONS: Record<MeetingSectionKey, string> = {
  liveNow:     "meetings.section_live_now",
  allTeachers: "meetings.section_all_teachers",
};

export const MEETINGS_CATEGORIES: MeetingCategoryItem[] = [
  { key: "all",     label: "meetings.category_all" },
  { key: "math",    label: "meetings.category_math" },
  { key: "arabic",  label: "meetings.category_arabic" },
  { key: "french",  label: "meetings.category_french" },
  { key: "science", label: "meetings.category_science" },
  { key: "english", label: "meetings.category_english" },
];

export const MEETINGS_SUBJECTS: MeetingSubjectOption[] = [
  { key: "math",    title: "meetings.subject_math",    iconName: "triangle-outline",  shortCode: "△" },
  { key: "arabic",  title: "meetings.subject_arabic",  iconName: "book-outline",      shortCode: "📖" },
  { key: "french",  title: "meetings.subject_french",  iconName: "language-outline",  shortCode: "FR" },
  { key: "science", title: "meetings.subject_science", iconName: "flask-outline",     shortCode: "🔬" },
  { key: "english", title: "meetings.subject_english", iconName: "text-outline",      shortCode: "GB" },
];

export const MEETINGS_SUBJECT_THEME: Record<string, SubjectThemeItem> = {
  math: {
    accent:  "#22BEC8",
    softBg:  "rgba(34,190,200,0.10)",
    gradient: ["#26C6DA", "#2E89D8"],
  },
  arabic: {
    accent:  "#E8294C",
    softBg:  "rgba(232,41,76,0.10)",
    gradient: ["#E8294C", "#7A5AF8"],
  },
  french: {
    accent:  "#3A86D8",
    softBg:  "rgba(58,134,216,0.10)",
    gradient: ["#3A86D8", "#5B7CFA"],
  },
  science: {
    accent:  "#27AE60",
    softBg:  "rgba(39,174,96,0.10)",
    gradient: ["#27AE60", "#2E89D8"],
  },
  social: {
    accent:  "#8B5CF6",
    softBg:  "rgba(139,92,246,0.10)",
    gradient: ["#8B5CF6", "#5B7CFA"],
  },
  english: {
    accent:  "#F5A623",
    softBg:  "rgba(245,166,35,0.10)",
    gradient: ["#F5A623", "#E8294C"],
  },
};

export const MATERIAL_KEYWORDS_BY_CATEGORY: Record<
  Exclude<MeetingCategoryItem["key"], "all">,
  string[]
> = {
  math:    ["math", "maths", "mathematics", "رياض", "رياضيات", "mathématique"],
  arabic:  ["arab", "arabic", "عرب", "عربية", "اللغة العربية"],
  french:  ["french", "français", "francais", "فرنسية", "fr"],
  science: ["science", "sciences", "علوم", "svt"],
  social:  ["social", "اجتما", "تربية", "civic"],
  english: ["english", "anglais", "إنقليزي", "انجليزية"],
};
