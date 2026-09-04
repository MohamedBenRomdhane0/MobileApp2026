import type { SelectedPeriod } from "./PlansScreen.type";

export const PLANS_UI = {
  screenTitle:        "plan.screen_title",
  periodMonthly:      "plan.period_monthly",
  periodQuarterly:    "plan.period_quarterly",
  periodYearly:       "plan.period_yearly",
  tabLive:            "plan.tab_live",
  tabBooks:           "plan.tab_books",
  tabBundle:          "plan.tab_bundle",
  liveSectionTitle:   "plan.live_section_title",
  liveSectionSub:     "plan.live_section_sub",
  liveDiscount:       "plan.live_discount",
  chooseTeachersBtn:  "plan.choose_teachers_btn",
  bundleTitle:        "plan.bundle_title",
  bundleSub:          "plan.bundle_sub",
  perMonth:           "plan.per_month",
  ctaLabel:           "plan.cta_label",
  guarantee:          "plan.guarantee",
  totalLabel:         "plan.total_label",
  liveLine:           "plan.live_line",
  booksLine:          "plan.books_line",
  booksDiscount:      "plan.books_discount",
  priceCurrency:      "common.currency_tnd",
  loading:            "common.loading",
  retry:              "common.retry",
  genericError:       "common.generic_error",
  emptyTitle:         "plan.empty_title",
  quarterlyDiscount:  "plan.quarterly_discount",
  yearlyDiscount:     "plan.yearly_discount",
  selectedTeacher:    "plan.selected_teacher",
  selectTeacher:      "plan.select_teacher",

  viewTrailersBtn:    "plan.view_trailers",
  chooseBundle:       "plan.choose_bundle",
  both:               "plan.both",
  courses:            "plan.courses",
  booksOnly:          "plan.books_only",
  mostPopular:        "plan.most_popular",
  bundleSubDesc:      "plan.bundle_sub_desc",
  priceLabel:         "plan.price_label",
  discountTwoMats:    "plan.discount_two_mats",
  booksTitle:         "plan.books_title",
  booksSub:           "plan.books_sub",
  liveTeachersLabel:  "plan.live_teachers_label",
} as const;

export const PERIOD_LABEL_KEYS: Record<SelectedPeriod, string> = {
  monthly:   "plan.period_monthly",
  quarterly: "plan.period_quarterly",
  yearly:    "plan.period_yearly",
};

export const PERIOD_MONTHS_MAP: Record<SelectedPeriod, number> = {
  monthly:   1,
  quarterly: 3,
  yearly:    10,
};

export const PLANS_HEADER_GRADIENT = ["#0D2A52", "#163867", "#1A4A82"] as const;

export const LIVE_PLAN_GRADIENT = ["#E3F8F8", "#D0F4F4"] as const;
export const LIVE_BADGE_GRADIENT = ["#22BEC8", "#1aa8b0"] as const;
export const CTA_GRADIENT = ["#22BEC8", "#1aa8b0"] as const;