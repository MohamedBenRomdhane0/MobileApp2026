import { Ionicons } from "@expo/vector-icons";
import type { DailySnippet, LevelVideoCard, MeetingCard, TeacherCard } from "./HomeScreen.type";

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
} as const;

export const HOME_COMMON_UI = {
  seeAll: "common.see_all",
  open: "common.open",
  live: "common.live",
  tapToRetry: "common.tap_to_retry",
} as const;

export const HOME_TOKENS = {
  subscribeGradient: ["#22BEC8", "#046b72"] as [string, string],
} as const;
export const SUBSCRIBE_GRADIENT: [string, string] = ["#22BEC8", "#046b72"];
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