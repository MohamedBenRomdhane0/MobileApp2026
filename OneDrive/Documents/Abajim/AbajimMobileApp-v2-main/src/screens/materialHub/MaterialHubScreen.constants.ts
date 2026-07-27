import type { MaterialHubTabKey } from "./MaterialHubScreen.types";

export const HUB_UI = {
  level: "hub.level",
  materialId: "hub.material_id",

  tabs: {
    exercises: "hub.exercises",
    live: "hub.live",
    lessons: "hub.lessons",
    book: "hub.book",
  },

  exercisesSoonTitle: "hub.exercises_soon_title",
  exercisesSoonSub: "hub.exercises_soon_sub",

  bookTitle: "hub.book_title",
  bookSubtitle: "hub.book_subtitle",

  liveNowTitle: "hub.live_now_title",
  liveNowMeta: "hub.live_now_meta",
  upcoming: "hub.upcoming",

  recentLessons: "hub.recent_lessons",

  open: "common.open",
  join: "common.join",
} as const;

export const HUB_TABS: Array<{
  key: MaterialHubTabKey;
  labelKey: (typeof HUB_UI)["tabs"][keyof (typeof HUB_UI)["tabs"]];
  icon: any;
  dot?: boolean;
}> = [
  { key: "book", labelKey: HUB_UI.tabs.book, icon: "albums", dot: false },
  { key: "lessons", labelKey: HUB_UI.tabs.lessons, icon: "film", dot: false },
  { key: "live", labelKey: HUB_UI.tabs.live, icon: "radio", dot: true },
  { key: "exercises", labelKey: HUB_UI.tabs.exercises, icon: "pencil", dot: false },
];

export const HUB_MOCK = {
  book: {
    titleKey: HUB_UI.bookTitle,
    subtitleKey: HUB_UI.bookSubtitle,
    progress: 0.45,
    pages: 177,
    lastPage: 8,
    chapters: [{ id: 1, titleKey: "hub.ch1" }, { id: 2, titleKey: "hub.ch2" }, { id: 3, titleKey: "hub.ch3" }],
  },
  live: {
    liveTitleKey: HUB_UI.liveNowTitle,
    liveMetaKey: HUB_UI.liveNowMeta,
    upcomingTitleKey: HUB_UI.upcoming,
    upcoming: [
      { id: 1, titleKey: "hub.live_up_1", metaKey: "hub.live_up_1_meta" },
      { id: 2, titleKey: "hub.live_up_2", metaKey: "hub.live_up_2_meta" },
    ],
  },
  lessons: {
    teachers: [
      { id: 1, nameKey: "hub.teacher_1", metaKey: "hub.teacher_1_meta", rating: 4.9, students: "1.2k" },
      { id: 2, nameKey: "hub.teacher_2", metaKey: "hub.teacher_2_meta", rating: 4.7, students: "876" },
    ],
    recentTitleKey: HUB_UI.recentLessons,
    recent: [
      { id: 1, titleKey: "hub.lesson_1", duration: "6:00" },
      { id: 2, titleKey: "hub.lesson_2", duration: "14:00" },
      { id: 3, titleKey: "hub.lesson_3", duration: "8:00" },
      { id: 4, titleKey: "hub.lesson_4", duration: "15:00" },
      { id: 5, titleKey: "hub.lesson_5", duration: "5:00" },
    ],
  },
};