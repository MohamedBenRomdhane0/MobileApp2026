export type PlanUIType = "annual" | "monthly";

export type ReviewItem = {
  id: string;
  title: string;
  date: string;
  author: string;
  body: string;
};

export type PremiumFeature = {
  id: string;
  icon: number;
  titleKey: string;
  bodyKey: string;
};

export type PlanOption = {
  id: PlanUIType;
  labelKey: string;
  price: string;
  periodLabel: string;
  savingsBadge?: string;
  trialText?: string;
  isPopular?: boolean;
};

export type StatItem = {
  value: string;
  labelKey: string;
};
