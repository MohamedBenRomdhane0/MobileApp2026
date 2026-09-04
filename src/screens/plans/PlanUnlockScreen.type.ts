export type UnlockPackId = "pack1" | "pack2";

export type UnlockPackFeature = {
  id: string;
  iconName: string;
  labelKey: string;
  color: string;
};

export type UnlockPlanOption = {
  id: string;
  nameKey: string;
  price: string;
  periodKey: string;
  badge?: string;
  trialKey?: string;
};

export type UnlockPackConfig = {
  id: UnlockPackId;
  headlineHighlightKey: string;
  subtitleKey: string;
  features: UnlockPackFeature[];
  plans: UnlockPlanOption[];
};
