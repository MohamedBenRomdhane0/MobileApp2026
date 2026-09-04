export type ProPlanType = "monthly" | "quarterly" | "yearly" | "single";

export type ProPlanOption = {
  id: ProPlanType;
  nameKey: string;
  price: string;
  noteKey: string;
  badge?: string;
};

export type ProIncludedFeature = {
  id: string;
  iconName: string;
  labelKey: string;
};

export type SwiperPack = "pack1" | "pack2";

export type PackConfig = {
  id: SwiperPack;
  titleKey: string;
  gradientColors: string[];
  highlightColor: string;
  features: ProIncludedFeature[];
  plans: ProPlanOption[];
};
