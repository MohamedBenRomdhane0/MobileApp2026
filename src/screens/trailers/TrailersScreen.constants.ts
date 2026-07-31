export const TRAILERS_UI = {
  screenTitle:        "trailers.screen_title",
  screenSubtitle:     "trailers.screen_subtitle",
  confirmBtn:         "trailers.confirm_btn",
  scheduleBtn:        "trailers.schedule_btn",
  profileBtn:         "trailers.profile_btn",
  filterAll:          "common.all",
  perMonth:           "plan.per_month",
  loading:            "common.loading",
  retry:              "common.retry",
  genericError:       "common.generic_error",
  emptyTitle:         "trailers.empty_title",
  emptySubtitle:      "trailers.empty_subtitle",
  liveNow:            "trailers.live_now",
  tomorrow:           "trailers.tomorrow",
  sessionsSuffix:     "meetings.sessions_suffix",
  watchBtn: "trailers.watch_btn",
} as const;

export const TRAILERS_HEADER_GRADIENT = [
  "#0D2A52",
  "#163867",
  "#1A4A82",
] as const;

/** Per-subject gradient for the video thumbnail overlay */
export const SUBJECT_GRADIENTS: Record<string, readonly [string, string]> = {
  math:    ["#1a3a6e", "#0d2244"],
  arabic:  ["#6e1a1a", "#44110d"],
  french:  ["#1a4a6e", "#0d2a44"],
  science: ["#1a6e3a", "#0d441f"],
  wake:    ["#4a1a6e", "#2a0d44"],
  english: ["#6e4a1a", "#442a0d"],
  default: ["#1d3b65", "#0a1e38"],
};

export function getSubjectGradient(subject: string): readonly [string, string] {
  const s = String(subject ?? "").toLowerCase();
  if (s.includes("math")   || s.includes("رياض")) return SUBJECT_GRADIENTS.math;
  if (s.includes("arab")   || s.includes("عرب"))  return SUBJECT_GRADIENTS.arabic;
  if (s.includes("fr")     || s.includes("فرن"))  return SUBJECT_GRADIENTS.french;
  if (s.includes("scien")  || s.includes("علوم")) return SUBJECT_GRADIENTS.science;
  if (s.includes("wake")   || s.includes("إيقاظ")) return SUBJECT_GRADIENTS.wake;
  if (s.includes("eng")    || s.includes("انجل")) return SUBJECT_GRADIENTS.english;
  return SUBJECT_GRADIENTS.default;
}
