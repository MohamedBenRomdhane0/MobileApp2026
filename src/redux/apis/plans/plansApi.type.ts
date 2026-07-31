export type PricingTypeApi = "per_material" | "total" | string;

export interface ApiTranslation {
  id: number;
  locale: string;
  key: string;
  text: string;
}

export interface ApiMaterial {
  id: number;
  name: string;
}

export interface ApiPlanFeature {
  id: number;
  is_available: number | boolean;
  translations?: ApiTranslation[];
}

export interface ApiMaterialPricing {
  id: number;
  plan_pricing_id: number;
  material_id: number;
  price: string | number | null;
  discount: string | number | null;
  material?: ApiMaterial | null;
}

export interface ApiPlanPricing {
  id: number;
  plan_id: number;
  price: string | number | null;
  months: number;
  discount: string | number | null;
  is_highlighted: boolean;
  pricing_type: PricingTypeApi;
  status: string | number;
  material_pricings?: ApiMaterialPricing[] | null;
}

export interface ApiAccessibleEntity {
  id: number;
  plan_id: number;
  accessible_type: string;
  accessible_id: number;
  material_id?: number | null;
  material?: ApiMaterial | null;
  accessible?: {
    id: number;
    title?: string | null;
  } | null;
}

export interface ApiPlan {
  id: number;
  is_popular: boolean;
  creator_id: number;
  level_id: number;
  plan_type: string;
  has_meeting: boolean;
  translations?: ApiTranslation[];
  features?: ApiPlanFeature[];
  plan_pricings?: ApiPlanPricing[];
  accessible_entities?: ApiAccessibleEntity[];
}

export interface PlansListResponse {
  message: string;
  data: ApiPlan[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

export interface PlanDetailResponse {
  message: string;
  data: ApiPlan;
}

export interface GetPlansArgs {
  levelId?: number;
}

export interface GetPlanDetailArgs {
  id: number;
}

export interface PlanFeatureUI {
  id: number;
  title: string;
  description: string;
  isAvailable: boolean;
}

export interface PlanMaterialPriceUI {
  id: number;
  materialId: number;
  materialKey: string;
  materialName: string;
  price: number;
  discount: number;
  finalPrice: number;
}

export interface PlanPricingUI {
  id: number;
  months: number;
  pricingType: PricingTypeApi;
  price: number;
  discount: number;
  finalPrice: number;
  isHighlighted: boolean;
  materialPricings: PlanMaterialPriceUI[];
  startingFromPrice: number;
  totalMaterialsFinalPrice: number;
}

export interface PlanAccessibleEntityUI {
  id: number;
  accessibleType: string;
  accessibleId: number;
  materialId: number | null;
  materialKey: string;
  title: string;
}

export interface PlanUI {
  id: number;
  title: string;
  description: string;
  levelId: number;
  planType: string;
  isPopular: boolean;
  hasMeeting: boolean;
  features: PlanFeatureUI[];
  pricings: PlanPricingUI[];
  accessibleEntities: PlanAccessibleEntityUI[];
}