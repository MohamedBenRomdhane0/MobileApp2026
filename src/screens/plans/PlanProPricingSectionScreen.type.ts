import type { PlanMaterialPriceUI } from "@redux/apis/plans/plansApi.type";

export type ProPlanType = "monthly" | "quarterly" | "yearly" | "single";

export type ProPlanOption = {
  id: ProPlanType;
  nameKey: string;
  price: string;
  noteKey: string;
  badge?: string;
  _perMaterial?: boolean;
  _materialPricings?: PlanMaterialPriceUI[];
  _startingFromPrice?: number;
};

export type ProIncludedFeature = {
  id: string;
  iconName: string;
  labelKey: string;
};

export type SwiperPack = string;

export type PackConfig = {
  id: SwiperPack;
  titleKey: string;
  gradientColors: string[];
  highlightColor: string;
  features: ProIncludedFeature[];
  plans: ProPlanOption[];
  _planId?: number;
  _planType?: string;
  _pricingType?: string;
  _materialPricings?: PlanMaterialPriceUI[];
  _startingFromPrice?: number;
};
