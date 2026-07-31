export const COURSE_CHAPTERS_UI = {
  headerTitle: "course.header_title",
  contentTab: "course.tabs.content",
  docsTab: "course.tabs.documents",
  quizTab: "course.tabs.quiz",

  summaryHint: "course.summary_hint",
  teacherLabel: "course.teacher_label",

  sectionTitle: "course.section_title",

  emptyCourse: "course.empty_course",
  emptyContent: "course.empty_content",
  emptyDocs: "course.empty_docs",
  emptyQuiz: "course.empty_quiz",
  noDesc: "course.no_desc",
  noVideos: "course.no_videos",
  tapToRetry: "common.tap_to_retry",
  loading: "common.loading",
} as const;

export const COURSE_CHAPTERS_TABS = ["content", "documents", "quiz"] as const;
export type CourseChaptersTab = (typeof COURSE_CHAPTERS_TABS)[number];