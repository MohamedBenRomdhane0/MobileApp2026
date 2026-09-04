import type {
  PackConfig,
  ProIncludedFeature,
  ProPlanOption,
} from "./PlanProPricingSectionScreen.type";

export const PRO_UI_KEYS = {
  proBadge: "pro_pricing.pro_badge",
  headline: "pro_pricing.headline",
  headlineHighlight: "pro_pricing.headline_highlight",
  headlineEnd: "pro_pricing.headline_end",
  includedTitle: "pro_pricing.included_title",
  featureCorrection: "pro_pricing.feature_correction",
  featureVideos: "pro_pricing.feature_videos",
  featureSupport: "pro_pricing.feature_support",
  featureLanguage: "pro_pricing.feature_language",
  featureDevices: "pro_pricing.feature_devices",
  featureContestCorrection: "pro_pricing.feature_contest_correction",
  monthly: "pro_pricing.monthly",
  quarterly: "pro_pricing.quarterly",
  yearly: "pro_pricing.yearly",
  billedMonthly: "pro_pricing.billed_monthly",
  billedQuarterly: "pro_pricing.billed_quarterly",
  billedYearly: "pro_pricing.billed_yearly",
  billedAnnually: "pro_pricing.billed_annually",
  bestDeal: "pro_pricing.bestdeal",
  ctaTitle: "pro_pricing.cta_title",
  ctaSub: "pro_pricing.cta_sub",
  restore: "pro_pricing.restore",
  terms: "pro_pricing.terms",
  privacy: "pro_pricing.privacy",
} as const;

const PACK1_FEATURES: ProIncludedFeature[] = [
  {
    id: "correction",
    iconName: "school-outline",
    labelKey: PRO_UI_KEYS.featureCorrection,
  },
  {
    id: "videos",
    iconName: "play-circle-outline",
    labelKey: PRO_UI_KEYS.featureVideos,
  },
  {
    id: "support",
    iconName: "headset-outline",
    labelKey: PRO_UI_KEYS.featureSupport,
  },
  {
    id: "language",
    iconName: "language-outline",
    labelKey: PRO_UI_KEYS.featureLanguage,
  },
  {
    id: "devices",
    iconName: "phone-portrait-outline",
    labelKey: PRO_UI_KEYS.featureDevices,
  },
];

const PACK2_FEATURES: ProIncludedFeature[] = [
  {
    id: "contest",
    iconName: "document-text-outline",
    labelKey: PRO_UI_KEYS.featureContestCorrection,
  },
  {
    id: "videos",
    iconName: "play-circle-outline",
    labelKey: PRO_UI_KEYS.featureVideos,
  },
  {
    id: "support",
    iconName: "headset-outline",
    labelKey: PRO_UI_KEYS.featureSupport,
  },
  {
    id: "language",
    iconName: "language-outline",
    labelKey: PRO_UI_KEYS.featureLanguage,
  },
  {
    id: "devices",
    iconName: "phone-portrait-outline",
    labelKey: PRO_UI_KEYS.featureDevices,
  },
];

const PACK1_PLANS: ProPlanOption[] = [
  {
    id: "monthly",
    nameKey: PRO_UI_KEYS.monthly,
    price: "29 DT",
    noteKey: PRO_UI_KEYS.billedMonthly,
  },
  {
    id: "quarterly",
    nameKey: PRO_UI_KEYS.quarterly,
    price: "80 DT",
    noteKey: PRO_UI_KEYS.billedQuarterly,
    badge: PRO_UI_KEYS.bestDeal,
  },
  {
    id: "yearly",
    nameKey: PRO_UI_KEYS.yearly,
    price: "250 DT",
    noteKey: PRO_UI_KEYS.billedYearly,
  },
];

const PACK2_PLANS: ProPlanOption[] = [
  {
    id: "single",
    nameKey: PRO_UI_KEYS.yearly,
    price: "79 DT",
    noteKey: PRO_UI_KEYS.billedAnnually,
  },
];

export const SWIPER_PACKS: PackConfig[] = [
  {
    id: "pack1",
    titleKey: "pro_pricing.pack1_title",
    gradientColors: [
      "rgb(75, 151, 232)",
      "rgba(28, 135, 201, 0.9)",
      "rgba(28, 135, 201, 0.9)",
      "rgba(12, 45, 83, 0.9)",
      "rgba(7, 33, 62, 0.9)",
      "rgb(3, 11, 28)",
    ],
    highlightColor: "#fcfcfc",
    features: PACK1_FEATURES,
    plans: PACK1_PLANS,
  },
  {
    id: "pack2",
    titleKey: "pro_pricing.pack2_title",
    gradientColors: [
      "rgba(0, 80, 60, 1)",
      "rgba(0, 180, 80, 0.95)",
      "rgba(80, 255, 140, 0.9)",
      "rgba(0, 180, 80, 0.8)",
      "rgba(0, 60, 40, 0.95)",
      "rgba(11, 18, 32, 1)",
    ],
    highlightColor: "#fdfffe",
    features: PACK2_FEATURES,
    plans: PACK2_PLANS,
  },
];
