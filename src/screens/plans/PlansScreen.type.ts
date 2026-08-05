import type { PlanUI, PlanPricingUI } from "@redux/apis/plans/plansApi.type";

export type PlansScreenRouteParams = {
  preselectedPlanId?: number;
};

export type SelectedPeriod = "monthly" | "quarterly" | "yearly";

export type PERIOD_MONTHS_MAP = {
  monthly: 1;
  quarterly: 3;
  yearly: 9;
};

export const PERIOD_MONTHS: PERIOD_MONTHS_MAP = {
  monthly: 1,
  quarterly: 3,
  yearly: 9,
};

export type PlanTab = "live" | "books" | "bundle";

export type PlanType = "live" | "books" | "books_docs";

export type PlanSelectionState = {
  planType: PlanType;
  selectedMatiere: number | null;
  selectedTeachers: number[];
  selectedBooks: number[];
};

export type SelectedMaterials = Record<number, boolean>;

export type CartSummaryLine = {
  labelKey: string;
  value: string;
  isTotal?: boolean;
  isDiscount?: boolean;
};

export type { PlanUI, PlanPricingUI };
