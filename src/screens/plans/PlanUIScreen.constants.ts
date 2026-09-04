import type { PremiumFeature, PlanOption, ReviewItem, StatItem } from "./PlanUIScreen.type";

export const PLAN_UI_KEYS = {
  screenTitle: "plan_ui.screen_title",
  screenSubtitle: "plan_ui.screen_subtitle",
  joinHeadline: "plan_ui.join_headline",
  joinHighlight: "plan_ui.join_highlight",
  joinSub: "plan_ui.join_sub",
  transformationTitle: "plan_ui.transformation_title",
  featuresTitle: "plan_ui.features_title",
  ctaTrial: "plan_ui.cta_trial",
  annually: "plan_ui.annually",
  monthly: "plan_ui.monthly",
  perMonth: "plan_ui.per_month",
  perYear: "plan_ui.per_year",
  save45: "plan_ui.save_45",
  freeTrialText: "plan_ui.free_trial_text",
  statMood: "plan_ui.stat_mood",
  statResults: "plan_ui.stat_results",
  statRating: "plan_ui.stat_rating",
  restore: "plan_ui.restore",
  terms: "plan_ui.terms",
  privacy: "plan_ui.privacy",
  featureEmotion: "plan_ui.feature_emotion",
  featureEmotionDesc: "plan_ui.feature_emotion_desc",
  featureAnalytics: "plan_ui.feature_analytics",
  featureAnalyticsDesc: "plan_ui.feature_analytics_desc",
  featureDevices: "plan_ui.feature_devices",
  featureDevicesDesc: "plan_ui.feature_devices_desc",
  featureGuidance: "plan_ui.feature_guidance",
  featureGuidanceDesc: "plan_ui.feature_guidance_desc",
  featureAdfree: "plan_ui.feature_adfree",
  featureAdfreeDesc: "plan_ui.feature_adfree_desc",
  featureUnlimited: "plan_ui.feature_unlimited",
  featureUnlimitedDesc: "plan_ui.feature_unlimited_desc",
} as const;

export const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    title: "Found my triggers",
    date: "12/15/2025",
    author: "SarahM_NYC",
    body: "Within 10 days I noticed I'm always anxious after late-night social media scrolling. The pattern insights helped me connect the dots.",
  },
  {
    id: "2",
    title: "Quick daily habit",
    date: "11/28/2025",
    author: "Jonas_PDX",
    body: "Takes me two minutes each morning. After a month my mood chart finally looks happier and I know exactly why.",
  },
  {
    id: "3",
    title: "Worth every cent",
    date: "10/09/2025",
    author: "Amelie_FR",
    body: "The AI emotion detection puts words to things I could never explain to my therapist before.",
  },
  {
    id: "4",
    title: "Calmer evenings",
    date: "09/21/2025",
    author: "Dev_Singh",
    body: "The guided exercises are short and real. My evenings feel a lot less heavy than they did.",
  },
  {
    id: "5",
    title: "Loved by my family",
    date: "08/02/2025",
    author: "Marta_ES",
    body: "We sync across devices and check in together. It became a small ritual we actually keep.",
  },
];

export const FEATURES: PremiumFeature[] = [
  {
    id: "emotion",
    icon: require("../../../assets/paywall/icon-emotion.png"),
    titleKey: PLAN_UI_KEYS.featureEmotion,
    bodyKey: PLAN_UI_KEYS.featureEmotionDesc,
  },
  {
    id: "analytics",
    icon: require("../../../assets/paywall/icon-analytics.png"),
    titleKey: PLAN_UI_KEYS.featureAnalytics,
    bodyKey: PLAN_UI_KEYS.featureAnalyticsDesc,
  },
  {
    id: "devices",
    icon: require("../../../assets/paywall/icon-devices.png"),
    titleKey: PLAN_UI_KEYS.featureDevices,
    bodyKey: PLAN_UI_KEYS.featureDevicesDesc,
  },
  {
    id: "guidance",
    icon: require("../../../assets/paywall/icon-guidance.png"),
    titleKey: PLAN_UI_KEYS.featureGuidance,
    bodyKey: PLAN_UI_KEYS.featureGuidanceDesc,
  },
  {
    id: "adfree",
    icon: require("../../../assets/paywall/icon-adfree.png"),
    titleKey: PLAN_UI_KEYS.featureAdfree,
    bodyKey: PLAN_UI_KEYS.featureAdfreeDesc,
  },
];

export const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "annual",
    labelKey: PLAN_UI_KEYS.annually,
    price: "$59.99",
    periodLabel: PLAN_UI_KEYS.perYear,
    savingsBadge: PLAN_UI_KEYS.save45,
    trialText: PLAN_UI_KEYS.freeTrialText,
    isPopular: true,
  },
  {
    id: "monthly",
    labelKey: PLAN_UI_KEYS.monthly,
    price: "$9.99",
    periodLabel: PLAN_UI_KEYS.perMonth,
  },
];

export const STATS: StatItem[] = [
  { value: "86%", labelKey: PLAN_UI_KEYS.statMood },
  { value: "14 days", labelKey: PLAN_UI_KEYS.statResults },
  { value: "4.9★", labelKey: PLAN_UI_KEYS.statRating },
];

export const HERO_IMAGE = require("../../../assets/paywall/paywall-hero.jpg");

export const PLAN_UI_GRADIENT = {
  header: ["#0D2A52", "#163867", "#1A4A82"] as const,
  cta: ["#22BEC8", "#1aa8b0"] as const,
};
