import type {
  ApiMaterialPricing,
  ApiPlan,
  ApiPlanFeature,
  ApiPlanPricing,
  ApiTranslation,
  PlanAccessibleEntityUI,
  PlanFeatureUI,
  PlanMaterialPriceUI,
  PlanPricingUI,
  PlanUI,
} from "./plansApi.type";

const FALLBACK_LOCALES = ["ar", "fr", "en"];

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
  item: ApiPlan["accessible_entities"][number],
): PlanAccessibleEntityUI => ({
  id: item.id,
  accessibleType: item.accessible_type,
  accessibleId: item.accessible_id,
  materialId: item.material_id ?? null,
  materialKey: item.material?.name ?? "",
  title: item.accessible?.title ?? "",
});

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

  return {
    id: plan.id,
    title,
    description,
    levelId: plan.level_id,
    planType: plan.plan_type,
    isPopular: Boolean(plan.is_popular),
    hasMeeting: Boolean(plan.has_meeting),
    features,
    pricings,
    accessibleEntities,
  };
};

export const transformPlans = (plans: ApiPlan[], locale: string): PlanUI[] =>
  plans
    .map((plan) => transformPlan(plan, locale))
    .sort((a, b) => Number(b.isPopular) - Number(a.isPopular));