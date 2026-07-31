export const COURSES_UI = {
  title: "course.title",
  searchPlaceholder: "course.search_placeholder",
  empty: "course.empty",
  emptyByMaterial: "course.empty_by_material",
  tapToRetry: "common.tap_to_retry",
  loading: "common.loading",
  unnamed: "common.unnamed",
  teacher: "course.teacher",
  startNow: "course.start_now",
  favorites: "course.favorites",
  noCover: "course.no_cover",
  noFavorites: "course.no_favorites",
  byMaterialSub: "course.by_material_sub",
  minChars: "course.min_chars",
} as const;

export const COURSES_SEARCH = {
  MIN_CHARS: 3,
  DEBOUNCE_MS: 300,
} as const;