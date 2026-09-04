import type {
  UnlockPackConfig,
  UnlockPackFeature,
  UnlockPlanOption,
} from "./PlanUnlockScreen.type";

export const UNLOCK_UI_KEYS = {
  headline1: "unlock.headline_1",
  pack1Highlight: "unlock.pack1_highlight",
  pack2Highlight: "unlock.pack2_highlight",
  pack1Subtitle: "unlock.pack1_subtitle",
  pack2Subtitle: "unlock.pack2_subtitle",
  featureP1Correction: "unlock.feature_p1_correction",
  featureP2Contest: "unlock.feature_p2_contest",
  featureVideos: "unlock.feature_videos",
  featureSupport: "unlock.feature_support",
  featureLanguage: "unlock.feature_language",
  featureDevices: "unlock.feature_devices",
  featureTracking: "unlock.feature_tracking",
  detailsTitle: "unlock.details_title",
  detail1: "unlock.detail_1",
  detail2: "unlock.detail_2",
  detail3: "unlock.detail_3",
  annually: "unlock.annually",
  monthly: "unlock.monthly",
  quarterly: "unlock.quarterly",
  saveBadge: "unlock.save_badge",
  perYear: "unlock.per_year",
  perMonth: "unlock.per_month",
  perQuarter: "unlock.per_quarter",
  freeTrial: "unlock.free_trial",
  ctaTitle: "unlock.cta_title",
  ctaSub: "unlock.cta_sub",
  restore: "unlock.restore",
  terms: "unlock.terms",
  privacy: "unlock.privacy",
} as const;

const SHARED_FEATURES: UnlockPackFeature[] = [
  {
    id: "videos",
    iconName: "icon-guidance",
    labelKey: UNLOCK_UI_KEYS.featureVideos,
    color: "#4FC3F7",
  },
  {
    id: "support",
    iconName: "icon-analytics",
    labelKey: UNLOCK_UI_KEYS.featureSupport,
    color: "#7B61FF",
  },
  {
    id: "language",
    iconName: "icon-devices",
    labelKey: UNLOCK_UI_KEYS.featureLanguage,
    color: "#FF6B8A",
  },
  {
    id: "devices",
    iconName: "icon-adfree",
    labelKey: UNLOCK_UI_KEYS.featureDevices,
    color: "#448AFF",
  },
  {
    id: "tracking",
    iconName: "infinite-outline",
    labelKey: UNLOCK_UI_KEYS.featureTracking,
    color: "#26C6DA",
  },
];

const PACK1_FEATURES: UnlockPackFeature[] = [
  {
    id: "correction",
    iconName: "icon-emotion",
    labelKey: UNLOCK_UI_KEYS.featureP1Correction,
    color: "#FFB300",
  },
  ...SHARED_FEATURES,
];

const PACK2_FEATURES: UnlockPackFeature[] = [
  {
    id: "contest",
    iconName: "icon-emotion",
    labelKey: UNLOCK_UI_KEYS.featureP2Contest,
    color: "#FFB300",
  },
  ...SHARED_FEATURES,
];

const PACK1_PLANS: UnlockPlanOption[] = [
  {
    id: "annually",
    nameKey: UNLOCK_UI_KEYS.annually,
    price: "250 DT",
    periodKey: UNLOCK_UI_KEYS.perYear,
    badge: UNLOCK_UI_KEYS.saveBadge,
    trialKey: UNLOCK_UI_KEYS.freeTrial,
  },
  {
    id: "quarterly",
    nameKey: UNLOCK_UI_KEYS.quarterly,
    price: "80 DT",
    periodKey: UNLOCK_UI_KEYS.perQuarter,
  },
  {
    id: "monthly",
    nameKey: UNLOCK_UI_KEYS.monthly,
    price: "29 DT",
    periodKey: UNLOCK_UI_KEYS.perMonth,
  },
];

const PACK2_PLANS: UnlockPlanOption[] = [
  {
    id: "single",
    nameKey: UNLOCK_UI_KEYS.annually,
    price: "79 DT",
    periodKey: UNLOCK_UI_KEYS.perYear,
    trialKey: UNLOCK_UI_KEYS.freeTrial,
  },
];

export const UNLOCK_ICON_MAP: Record<string, ReturnType<typeof require>> = {
  "icon-emotion": require("../../../assets/unlock/icon-emotion.png"),
  "icon-analytics": require("../../../assets/unlock/icon-analytics.png"),
  "icon-devices": require("../../../assets/unlock/icon-devices.png"),
  "icon-guidance": require("../../../assets/unlock/icon-guidance.png"),
  "icon-adfree": require("../../../assets/unlock/icon-adfree.png"),
};

export const UNLOCK_PACKS: Record<"pack1" | "pack2", UnlockPackConfig> = {
  pack1: {
    id: "pack1",
    headlineHighlightKey: UNLOCK_UI_KEYS.pack1Highlight,
    subtitleKey: UNLOCK_UI_KEYS.pack1Subtitle,
    features: PACK1_FEATURES,
    plans: PACK1_PLANS,
  },
  pack2: {
    id: "pack2",
    headlineHighlightKey: UNLOCK_UI_KEYS.pack2Highlight,
    subtitleKey: UNLOCK_UI_KEYS.pack2Subtitle,
    features: PACK2_FEATURES,
    plans: PACK2_PLANS,
  },
};
