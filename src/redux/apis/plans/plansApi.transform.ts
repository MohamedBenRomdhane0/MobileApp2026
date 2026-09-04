import type {
  ApiMaterialPricing,
  ApiPlan,
  ApiPlanDiscount,
  ApiPlanFeature,
  ApiPlanPricing,
  ApiTranslation,
  PlanAccessibleEntityUI,
  PlanDiscountUI,
  PlanFeatureUI,
  PlanMaterialPriceUI,
  PlanPricingUI,
  PlanUI,
} from "./plansApi.type";

import { GLOBAL_VARIABLES } from "@config/constants/globalVariables";

const FALLBACK_LOCALES = ["ar", "fr", "en"];

const MATERIAL_COLOR_FALLBACK = "#8B5CF6";

const resolveMaterialColor = (
  name: string,
  apiColor: string | null | undefined,
): string => {
  const trimmedApiColor = (apiColor ?? "").trim();
  return (
    trimmedApiColor ||
    GLOBAL_VARIABLES.MATERIAL_COLORS[name] ||
    MATERIAL_COLOR_FALLBACK
  );
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const applyDiscount = (price: number, discount: number): number => {
  if (discount <= 0) {
    return price;
  }

  return Math.max(price - price * (discount / 100), 0);
};

const normalizeLocale = (locale?: string): string =>
  (locale ?? "ar").split("-")[0].toLowerCase();

const pickTranslation = (
  translations: ApiTranslation[] = [],
  locale: string,
  key: string,
): string => {
  const normalizedLocale = normalizeLocale(locale);

  const candidates = translations.filter(
    (item) =>
      item?.key === key &&
      typeof item?.text === "string" &&
      item.text.trim().length > 0,
  );

  const exact = candidates.find(
    (item) => normalizeLocale(item.locale) === normalizedLocale,
  );

  if (exact) {
    return exact.text;
  }

  for (const fallback of [normalizedLocale, ...FALLBACK_LOCALES]) {
    const found = candidates.find(
      (item) => normalizeLocale(item.locale) === fallback,
    );

    if (found) {
      return found.text;
    }
  }

  return candidates[0]?.text ?? "";
};

const transformFeature = (
  feature: ApiPlanFeature,
  locale: string,
): PlanFeatureUI => {
  const title = pickTranslation(feature.translations ?? [], locale, "title");
  const description =
    pickTranslation(feature.translations ?? [], locale, "description") || title;

  return {
    id: feature.id,
    title,
    description,
    isAvailable: Boolean(Number(feature.is_available)),
  };
};

const transformMaterialPricing = (
  item: ApiMaterialPricing,
): PlanMaterialPriceUI => {
  const price = toNumber(item.price);
  const discount = toNumber(item.discount);
  const finalPrice = applyDiscount(price, discount);

  return {
    id: item.id,
    materialId: item.material_id,
    materialKey: item.material?.name ?? "",
    materialName: item.material?.name ?? "",
    materialColor: resolveMaterialColor(
      item.material?.name ?? "",
      item.material?.color,
    ),
    price,
    discount,
    finalPrice,
  };
};

const transformPricing = (pricing: ApiPlanPricing): PlanPricingUI => {
  const price = toNumber(pricing.price);
  const discount = toNumber(pricing.discount);
  const finalPrice = applyDiscount(price, discount);

  const materialPricings = Array.isArray(pricing.material_pricings)
    ? pricing.material_pricings
        .map(transformMaterialPricing)
        .sort((a, b) => a.materialName.localeCompare(b.materialName))
    : [];

  const materialFinalPrices = materialPricings.map((item) => item.finalPrice);

  const startingFromPrice =
    materialFinalPrices.length > 0
      ? Math.min(...materialFinalPrices)
      : finalPrice;

  const totalMaterialsFinalPrice = materialFinalPrices.reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    id: pricing.id,
    months: pricing.months,
    pricingType: pricing.pricing_type,
    price,
    discount,
    finalPrice,
    isHighlighted: Boolean(pricing.is_highlighted),
    materialPricings,
    startingFromPrice,
    totalMaterialsFinalPrice,
  };
};

const transformAccessibleEntity = (
  item: NonNullable<ApiPlan["accessible_entities"]>[number],
): PlanAccessibleEntityUI => ({
  id: item.id,
  accessibleType: item.accessible_type,
  accessibleId: item.accessible_id,
  materialId: item.material_id ?? null,
  materialKey: item.material?.name ?? "",
  materialColor: resolveMaterialColor(
    item.material?.name ?? "",
    item.material?.color,
  ),
  title: item.accessible?.title ?? "",
});

const transformDiscount = (
  discount: ApiPlanDiscount,
  locale: string,
): PlanDiscountUI => {
  const value = toNumber(discount.value);
  const label =
    pickTranslation(discount.translations ?? [], locale, "title") ||
    pickTranslation(discount.translations ?? [], locale, "label") ||
    `${value}%`;

  return {
    id: discount.id,
    durationMonths: discount.duration_months,
    value,
    label,
  };
};

export const transformPlan = (plan: ApiPlan, locale: string): PlanUI => {
  const title = pickTranslation(plan.translations ?? [], locale, "title");
  const description = pickTranslation(
    plan.translations ?? [],
    locale,
    "description",
  );

  const features = Array.isArray(plan.features)
    ? plan.features
        .map((feature) => transformFeature(feature, locale))
        .sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable))
    : [];

  const pricings = Array.isArray(plan.plan_pricings)
    ? plan.plan_pricings
        .map(transformPricing)
        .sort((a, b) => a.months - b.months)
    : [];

  const accessibleEntities = Array.isArray(plan.accessible_entities)
    ? plan.accessible_entities.map(transformAccessibleEntity)
    : [];

  const discounts = Array.isArray(plan.discounts)
    ? plan.discounts.map((discount) => transformDiscount(discount, locale))
    : [];

  const planType =
    plan.plan_type ??
    (pricings.some((p) => p.pricingType === "per_material") ? "books" : "live");

  return {
    id: plan.id,
    title,
    description,
    levelId: plan.level_id,
    planType,
    isPopular: Boolean(plan.is_popular),
    hasMeeting: Boolean(plan.has_meeting),
    icon: typeof plan.icon === "string" ? plan.icon : "",
    color: typeof plan.color === "string" ? plan.color : "",
    displayTier: typeof plan.display_tier === "string" ? plan.display_tier : "",
    status: typeof plan.status === "string" ? plan.status : "",
    grandfatherPricing: Boolean(plan.grandfather_pricing),
    features,
    pricings,
    accessibleEntities,
    discounts,
  };
};

export const transformPlans = (plans: ApiPlan[], locale: string): PlanUI[] =>
  plans
    .map((plan) => transformPlan(plan, locale))
    .sort((a, b) => Number(b.isPopular) - Number(a.isPopular));