export {
  HEADER_GRADIENT,
  MATERIAL_COLOR,
  MATERIAL_COLOR as MATERIAL_COLORS,
  MATERIAL_GRADIENT,
  MATERIAL_GRADIENT as MATERIAL_DARK_GRADIENTS,
  TEACHER_AVATAR_GRADIENT,
} from "./BooksScreen.tokens";

export const BOOKS_UI = {
  title: "book.title",
  subtitle: "book.subtitle",
  emptyTitle: "book.empty_title",
  emptySubtitle: "book.empty_subtitle",
  openBook: "book.open_book",
  startNow: "book.start_now",
  continueLearning: "book.continueLearning",
  pageCounts: "book.pages_counts",
  teachersTitle: "book.teachers_title",
  teachersEmpty: "book.teachers_empty",
  teacherLabel: "book.teacher_label",
  noCover: "book.no_cover",
  noActiveChild: "book.no_active_child",
  loading: "common.loading",
  retry: "common.retry",
  unnamed: "common.unnamed",
  unknownTeacher: "teacher.unknown_teacher",
  genericError: "common.something_went_wrong",
  lastPosition: "book.last_position",
  notStartedYet: "book.not_started_yet",
  lessonsLabel: "book.lessons_label",
  booksLabel: "book.books_label",
  booksCountLabel: "book.books_count_label",
  filterAll: "book.filter_all",
  filterMaterials: "book.filter_materials",
  filterNoResultsTitle: "book.filter_no_results_title",
  filterNoResultsSub: "book.filter_no_results_sub",
} as const;

export const BOOKS_PAGINATION = {
  firstPage: 1,
} as const;

export const MATERIAL_ORDER = [
  "mat_arabic",
  "mat_math",
  "mat_french",
  "mat_science",
  "mat_social",
  "mat_english",
] as const;

export const MATERIAL_LABELS: Record<string, { ar: string; fr: string }> = {
  mat_arabic: { ar: "عربية", fr: "LANGUE ARABE" },
  mat_math: { ar: "رياضيات", fr: "MATHÉMATIQUES" },
  mat_french: { ar: "فرنسية", fr: "MANUEL DE LECTURE" },
  mat_science: { ar: "إيقاظ علمي", fr: "SCIENCES" },
  mat_social: { ar: "اجتماعيات", fr: "SCIENCES SOCIALES" },
  mat_english: { ar: "إنجليزية", fr: "ENGLISH" },
  default: { ar: "", fr: "" },
};

export const BOOK_CARD_GRADIENTS = [
  ["#031C34", "#08315C", "#0E4C83"],
  ["#4A061A", "#720A29", "#A0123D"],
  ["#27104B", "#43207B", "#5B2FA1"],
  ["#0B3A2A", "#105440", "#15705A"],
] as const;

export const BOOK_BUTTON_GRADIENTS = [
  ["#79D8FF", "#34BFFF"],
  ["#FF8DAA", "#FF5F8E"],
  ["#B79CFF", "#8A6DFF"],
  ["#7BE7C0", "#33C98F"],
] as const;