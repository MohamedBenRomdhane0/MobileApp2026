export const BOOK_FILE_UI = {
  viewerTitle: "book.viewer_title",
  invalidId: "book.invalid_id",
  loadFailed: "book.load_failed",
  noPages: "book.no_pages",
  pageOf: "book.page_of",
  loading: "common.loading",
  retry: "common.retry",
  fullscreen: "book.fullscreen",
  exitFullscreen: "book.exit_fullscreen",
  zoomIn: "book.zoom_in",
  zoomOut: "book.zoom_out",
  chapters: "book.chapters",
  pageNumber: "book.page_number",
  chapterListTitle: "book.chapter_list_title",
} as const;

export const BOOK_FILE_ROUTES = {
  profileParent: "ProfileParent",
  video: "Video",
} as const;

export const BOOK_FILE_LAYOUT = {
  minHitSize: 36,
  maxHitSize: 50,
  viewAreaCoveragePercentThreshold: 60,
  defaultIconPx: 24,
} as const;

export const BOOK_FILE_ICON = {
  background: "#E53935",
  border: "#FFFFFF",
  icon: "#FFFFFF",
} as const;
