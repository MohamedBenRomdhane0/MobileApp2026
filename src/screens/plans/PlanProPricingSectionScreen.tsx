import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId } from "@redux/slices/authSlice";
import { useGetPlansForChildQuery } from "@redux/apis/plans/plansApi";
import type { PlanUI, PlanPricingUI, PlanMaterialPriceUI } from "@redux/apis/plans/plansApi.type";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import { formatPrice } from "@utils/helpers/plans.helpers";
import { getMaterialEmoji } from "@utils/helpers/materialIcon.helper";
import { toValidId } from "@screens/home/HomeScreen.helpers";

import type { RootStackParamList } from "@config/types/navigation.types";
import { PATHS } from "@config/constants/paths";
import { useAppTheme } from "@theme/ThemeProvider";

import { createProPricingStyles } from "./PlanProPricingSectionScreen.styles";
import { PRO_UI_KEYS } from "./PlanProPricingSectionScreen.constants";
import type { PackConfig, ProIncludedFeature, ProPlanOption, ProPlanType, SwiperPack } from "./PlanProPricingSectionScreen.type";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type ProPricingRoute = RouteProp<RootStackParamList, typeof PATHS.APP.PLAN_PRO_PRICING>;

const { width: SCREEN_W } = Dimensions.get("window");

const FALLBACK_GRADIENT = [
  "rgb(75, 151, 232)",
  "rgba(28, 135, 201, 0.9)",
  "rgba(28, 135, 201, 0.9)",
  "rgba(12, 45, 83, 0.9)",
  "rgba(7, 33, 62, 0.9)",
  "rgb(3, 11, 28)",
];

const PLAN_TYPE_GRADIENTS: Record<string, string[]> = {
  live: [
    "rgb(75, 151, 232)",
    "rgba(28, 135, 201, 0.9)",
    "rgba(28, 135, 201, 0.9)",
    "rgba(12, 45, 83, 0.9)",
    "rgba(7, 33, 62, 0.9)",
    "rgb(3, 11, 28)",
  ],
  books: [
    "rgba(0, 80, 60, 1)",
    "rgba(0, 180, 80, 0.95)",
    "rgba(80, 255, 140, 0.9)",
    "rgba(0, 180, 80, 0.8)",
    "rgba(0, 60, 40, 0.95)",
    "rgba(11, 18, 32, 1)",
  ],
};

const FEATURE_ICON_KEYWORDS: Array<[string, string]> = [
  ["correction", "school-outline"],
  ["corriger", "school-outline"],
  ["contest", "document-text-outline"],
  ["concours", "document-text-outline"],
  ["vidéo", "play-circle-outline"],
  ["video", "play-circle-outline"],
  ["support", "headset-outline"],
  ["multilangue", "language-outline"],
  ["language", "language-outline"],
  ["appareils", "phone-portrait-outline"],
  ["devices", "phone-portrait-outline"],
  ["exercice", "create-outline"],
  ["exercise", "create-outline"],
  ["quiz", "help-circle-outline"],
  ["cours", "book-outline"],
  ["live", "videocam-outline"],
  ["réunion", "people-outline"],
  ["suivi", "analytics-outline"],
  ["tracking", "analytics-outline"],
];

const resolveFeatureIcon = (title: string): string => {
  const lower = (title ?? "").toLowerCase();
  for (const [keyword, icon] of FEATURE_ICON_KEYWORDS) {
    if (lower.includes(keyword)) return icon;
  }
  return "checkmark-circle-outline";
};

const monthsToKey = (months: number): ProPlanType => {
  if (months <= 1) return "monthly";
  if (months <= 3) return "quarterly";
  if (months <= 12) return "yearly";
  return "single";
};

const resolveMonthLabel = (months: number): string => {
  if (months <= 1) return PRO_UI_KEYS.monthly;
  if (months <= 3) return PRO_UI_KEYS.quarterly;
  if (months <= 12) return PRO_UI_KEYS.yearly;
  return PRO_UI_KEYS.yearly;
};

const resolveBilledLabel = (months: number): string => {
  if (months <= 1) return PRO_UI_KEYS.billedMonthly;
  if (months <= 3) return PRO_UI_KEYS.billedQuarterly;
  if (months <= 12) return PRO_UI_KEYS.billedYearly;
  return PRO_UI_KEYS.billedAnnually;
};

const buildGradient = (planColor: string, _planType: string): string[] => {
  if (planColor) {
    return [
      planColor,
      `${planColor}dd`,
      `${planColor}bb`,
      `${planColor}88`,
      `${planColor}55`,
      "rgb(3, 11, 28)",
    ];
  }
  if (PLAN_TYPE_GRADIENTS[_planType]) return PLAN_TYPE_GRADIENTS[_planType];
  return FALLBACK_GRADIENT;
};

const buildPackId = (planId: number, index: number): SwiperPack => {
  return `plan_${planId}_${index}` as SwiperPack;
};

const resolvePerMaterialCardPrice = (
  plan: ProPlanOption,
  selectedMaterialIds: number[],
): string => {
  if (plan._perMaterial) {
    const selected = (plan._materialPricings ?? []).filter((m) =>
      selectedMaterialIds.includes(m.materialId),
    );
    const total = selected.reduce((sum, m) => sum + m.finalPrice, 0);
    if (total > 0) return `${formatPrice(total)} DT`;
    return `${formatPrice(plan._startingFromPrice ?? 0)} DT`;
  }
  return plan.price;
};

const mapPlanToPack = (plan: PlanUI, index: number, t: (key: string) => string): PackConfig => {
  const packId = buildPackId(plan.id, index);
  const gradient = buildGradient(plan.color, plan.planType);

  const features: ProIncludedFeature[] = plan.features
    .filter((f) => f.isAvailable)
    .map((f) => ({
      id: String(f.id),
      iconName: resolveFeatureIcon(f.title),
      labelKey: f.title,
    }));

  if (features.length === 0) {
    features.push(
      { id: "default-1", iconName: "checkmark-circle-outline", labelKey: plan.title },
    );
  }

  const plans: ProPlanOption[] = (() => {
    const isPerMaterial = plan.pricings.some(
      (p) => p.pricingType === "per_material",
    );
    const filtered = plan.pricings.filter(
      (p) => p.price > 0 || (isPerMaterial && p.pricingType === "per_material"),
    );
    const maxDiscount = Math.max(0, ...filtered.map((p) => p.discount));
    return filtered.map((p: PlanPricingUI) => {
      const key = monthsToKey(p.months);
      const isBestDeal = p.isHighlighted || (p.discount > 0 && p.discount >= maxDiscount);
      const isPerMaterialOption = p.pricingType === "per_material";
      return {
        id: key,
        nameKey: resolveMonthLabel(p.months),
        price: isPerMaterialOption ? "" : `${Math.round(p.finalPrice)} DT`,
        noteKey: resolveBilledLabel(p.months),
        badge: isBestDeal ? PRO_UI_KEYS.bestDeal : undefined,
        _perMaterial: isPerMaterialOption,
        _materialPricings: isPerMaterialOption ? p.materialPricings : undefined,
        _startingFromPrice: isPerMaterialOption ? p.startingFromPrice : undefined,
      };
    });
  })();

  if (plans.length === 0) {
    plans.push({
      id: "monthly",
      nameKey: PRO_UI_KEYS.monthly,
      price: "—",
      noteKey: PRO_UI_KEYS.billedMonthly,
    });
  }

  const isPerMaterialPlan = plan.pricings.some(
    (p) => p.pricingType === "per_material",
  );
  const perMaterialPricing = plan.pricings.find(
    (p) => p.pricingType === "per_material" && p.materialPricings.length > 0,
  ) ?? plan.pricings.find((p) => p.pricingType === "per_material");

  return {
    id: packId,
    titleKey: plan.title,
    gradientColors: gradient,
    highlightColor: "#fcfcfc",
    features,
    plans,
    _planId: plan.id,
    _planType: plan.planType,
    _pricingType: isPerMaterialPlan ? "per_material" : plan.planType,
    _materialPricings: perMaterialPricing?.materialPricings,
    _startingFromPrice: perMaterialPricing?.startingFromPrice,
  };
};

export default function PlanProPricingSectionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<ProPricingRoute>();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.language ?? "ar") === "ar";

  const styles = createProPricingStyles(colors, isRTL);

  const headerData = useActiveChildHeaderData();
  const levelId = useMemo(
    () => pickLevelIdFromChild(headerData?.child),
    [headerData?.child],
  );
  const activeChildId = useAppSelector(selectActiveChildId);
  const isChildReady = toValidId(activeChildId) > 0;

  const routePlans = route.params?.plans;
  const selectedPlanId = route.params?.selectedPlanId;

  const { data: apiPlans, isLoading } = useGetPlansForChildQuery(
    isChildReady && levelId ? { levelId: toValidId(levelId) } : undefined,
    { skip: !isChildReady || !toValidId(levelId) || !!routePlans },
  );

  const rawPlans: PlanUI[] = useMemo(() => {
    if (routePlans && routePlans.length > 0) return routePlans;
    if (Array.isArray(apiPlans) && apiPlans.length > 0) return apiPlans;
    return [];
  }, [routePlans, apiPlans]);

  const packs: PackConfig[] = useMemo(
    () => rawPlans.map((p, i) => mapPlanToPack(p, i, t)),
    [rawPlans, t],
  );

  const initialPack = useMemo(() => {
    if (!selectedPlanId || packs.length === 0) return null;
    return packs.find((p) => p._planId === selectedPlanId) ?? null;
  }, [selectedPlanId, packs]);

  const [activePack, setActivePack] = useState<SwiperPack | null>(
    initialPack?.id ?? null,
  );
  const [selectedPlan, setSelectedPlan] = useState<ProPlanType>("monthly");
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef<ScrollView>(null);

  const toggleMaterial = useCallback((materialId: number) => {
    setSelectedMaterialIds((ids) =>
      ids.includes(materialId) ? ids.filter((x) => x !== materialId) : [...ids, materialId],
    );
  }, []);

  useEffect(() => {
    if (!initialPack || packs.length <= 1) return;
    const idx = packs.findIndex((p) => p.id === initialPack.id);
    if (idx <= 0) return;
    requestAnimationFrame(() => {
      swiperRef.current?.scrollTo({ x: idx * SCREEN_W, animated: false });
    });
  }, [initialPack, packs]);

  const effectiveActivePack: SwiperPack = activePack ?? packs[0]?.id ?? ("plan_0" as SwiperPack);
  const activePackConfig: PackConfig =
    packs.find((p) => p.id === effectiveActivePack) ?? packs[0];

  const hasPerMaterial = activePackConfig?._pricingType === "per_material";

  /** Material prices are period-specific — use the selected card's pricings so
   *  the material chips and totals reflect the active period (monthly/quarterly/yearly). */
  const selectedOption = activePackConfig?.plans.find((p) => p.id === selectedPlan);
  const periodMaterials = selectedOption?._materialPricings ?? [];
  const materialPricings =
    hasPerMaterial && periodMaterials.length > 0
      ? periodMaterials
      : (activePackConfig?._materialPricings ?? []);

  const materialsTotal = useMemo(() => {
    if (!hasPerMaterial || materialPricings.length === 0) return 0;
    return materialPricings
      .filter((m) => selectedMaterialIds.includes(m.materialId))
      .reduce((sum, m) => sum + m.finalPrice, 0);
  }, [hasPerMaterial, materialPricings, selectedMaterialIds]);

  const ctaPrice = useMemo(() => {
    if (hasPerMaterial && materialsTotal > 0) return materialsTotal;
    const selectedPricing = activePackConfig?.plans.find((p) => p.id === selectedPlan);
    if (selectedPricing) {
      const num = parseInt(selectedPricing.price.replace(/[^\d]/g, ""), 10);
      return Number.isFinite(num) ? num : 0;
    }
    return 0;
  }, [hasPerMaterial, materialsTotal, activePackConfig, selectedPlan]);

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleCTA = useCallback(() => {
    const planId = activePackConfig?._planId;
    if (planId) {
      navigation.navigate(PATHS.APP.PLAN_UNLOCK, { packId: effectiveActivePack });
    }
  }, [navigation, activePackConfig, effectiveActivePack]);
  const handleRestore = useCallback(() => {}, []);
  const handleTerms = useCallback(() => {}, []);
  const handlePrivacy = useCallback(() => {}, []);

  const handleSwiperScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
      if (packs[index]) {
        const newPack = packs[index];
        setActivePack(newPack.id);
        setSelectedPlan(newPack.plans[0]?.id ?? "monthly");
        setSelectedMaterialIds([]);
      }
    },
    [packs],
  );

  if (isLoading && packs.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={{ color: "#FFFFFF", marginTop: 16, fontSize: 16 }}>
          {t("plan.loading", { defaultValue: "Chargement..." })}
        </Text>
      </View>
    );
  }

  if (packs.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Ionicons name="folder-open-outline" size={56} color="#FFFFFF55" />
        <Text style={{ color: "#FFFFFF", marginTop: 16, fontSize: 16, textAlign: "center", paddingHorizontal: 32 }}>
          {t("plan.empty_title", { defaultValue: "Aucune formule disponible" })}
        </Text>
        <TouchableOpacity
          style={[styles.closeBtn, { position: "relative", marginTop: 24 }]}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Mesh gradient background */}
      <LinearGradient
        colors={activePackConfig.gradientColors.slice(0, 6) as [string, string, ...string[]]}
        style={styles.meshGradient}
        pointerEvents="none"
      />

      {/* Top row: PRO badge + close */}
      <View style={[styles.topRow, { paddingTop: (insets.top || 44) + 12, paddingHorizontal: 20 }]}>
        <View style={styles.proBadge}>
          <Ionicons name="flash" size={13} color="#1A1200" />
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Full-content horizontal swiper */}
      <Animated.ScrollView
        ref={swiperRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSwiperScroll}
        snapToAlignment="center"
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        style={{ flex: 1 }}
      >
        {packs.map((pack) => {
          const packPlans = pack.plans;
          return (
            <ScrollView
              key={pack.id}
              style={{ width: SCREEN_W }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                {/* Headline */}
                <Text style={[styles.headline, { color: pack.highlightColor }]}>
                  {t(pack.titleKey)}
                </Text>

                {/* What's included */}
                <Text style={styles.includedTitle}>
                  {t(PRO_UI_KEYS.includedTitle)}
                </Text>
                <View style={styles.featuresList}>
                  {pack.features.map((feature) => (
                    <View key={feature.id} style={styles.featureRow}>
                      <Ionicons
                        name={feature.iconName as keyof typeof Ionicons.glyphMap}
                        size={22}
                        color="#FFFFFF"
                        style={{ width: 26, textAlign: "center" }}
                      />
                      <Text style={styles.featureLabel}>{t(feature.labelKey)}</Text>
                    </View>
                  ))}
                </View>

                {/* Plans */}
                {pack._pricingType === "per_material" ? (
                  <View style={styles.plansSectionGrid3}>
                    {packPlans.map((plan) => {
                      const isSelected = pack.id === effectiveActivePack
                        ? selectedPlan === plan.id
                        : plan.id === packPlans[0]?.id;
                      return (
                        <TouchableOpacity
                          key={plan.id}
                          style={[
                            styles.planCardGrid3,
                            isSelected ? styles.planCardSelected : styles.planCardUnselected,
                          ]}
                          onPress={() => {
                            setActivePack(pack.id);
                            setSelectedPlan(plan.id);
                          }}
                          activeOpacity={0.7}
                        >
                          {plan.badge && (
                            <View style={styles.planBadge3}>
                              <Text style={styles.planBadgeText3}>{t(plan.badge)}</Text>
                            </View>
                          )}
                          <Text
                            style={[
                              styles.planName3,
                              { textAlign: "center", marginTop: plan.badge ? 7 : 0 },
                            ]}
                          >
                            {t(plan.nameKey)}
                          </Text>
                          <Text style={[styles.planPrice3, { fontSize: 15 }]}>
                            {resolvePerMaterialCardPrice(plan, selectedMaterialIds)}
                          </Text>
                          <View
                            style={[
                              styles.planCheckGrid3,
                              isSelected ? styles.planCheckSelected : styles.planCheckUnselected,
                            ]}
                          >
                            {isSelected && (
                              <Ionicons name="checkmark" size={12} color="#0A0A0A" />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.plansSection}>
                    {packPlans.map((plan) => {
                      const isSelected = pack.id === effectiveActivePack
                        ? selectedPlan === plan.id
                        : plan.id === packPlans[0]?.id;
                      return (
                        <TouchableOpacity
                          key={plan.id}
                          style={[
                            styles.planCard,
                            isSelected ? styles.planCardSelected : styles.planCardUnselected,
                          ]}
                          onPress={() => {
                            setActivePack(pack.id);
                            setSelectedPlan(plan.id);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.planLeft}>
                            <View style={styles.planNameRow}>
                              <Text style={styles.planName}>{t(plan.nameKey)}</Text>
                              {plan.badge && (
                                <View style={styles.planBadge}>
                                  <Text style={styles.planBadgeText}>{t(plan.badge)}</Text>
                                </View>
                              )}
                            </View>
                            <View style={styles.planPriceRow}>
                              <Text style={styles.planPrice}>{plan.price}</Text>
                              <Text style={styles.planNote}>{t(plan.noteKey)}</Text>
                            </View>
                          </View>
                          <View
                            style={[
                              styles.planCheck,
                              isSelected ? styles.planCheckSelected : styles.planCheckUnselected,
                            ]}
                          >
                            {isSelected && (
                              <Ionicons name="checkmark" size={15} color="#0A0A0A" />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Material selection for per_material plans */}
                {pack._pricingType === "per_material" && pack._materialPricings && pack._materialPricings.length > 0 && (
                  <View style={styles.materialSection}>
                    <Text style={styles.materialSectionTitle}>
                      {t("plan.select_materials", { defaultValue: "Choisissez vos matières" })}
                    </Text>
                    <View style={styles.materialGrid}>
                      {pack._materialPricings.map((item) => {
                        const isChecked = selectedMaterialIds.includes(item.materialId);
                        return (
                          <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.8}
                            onPress={() => {
                              setActivePack(pack.id);
                              toggleMaterial(item.materialId);
                            }}
                            style={[
                              styles.materialItem,
                              isChecked ? styles.materialItemActive : styles.materialItemInactive,
                              isChecked && item.materialColor ? { borderColor: item.materialColor } : null,
                            ]}
                          >
                            <View
                              style={[
                                styles.materialCheck,
                                isChecked ? styles.materialCheckActive : styles.materialCheckInactive,
                              ]}
                            >
                              {isChecked && (
                                <Ionicons name="checkmark" size={12} color="#0A0A0A" />
                              )}
                            </View>
                            <Text style={styles.materialEmoji}>
                              {getMaterialEmoji(item.materialKey)}
                            </Text>
                            <Text style={styles.materialName} numberOfLines={2}>
                              {item.materialName}
                            </Text>
                            {item.discount > 0 && (
                              <Text style={styles.materialOldPrice}>{formatPrice(item.price)} DT</Text>
                            )}
                            <Text style={styles.materialPrice}>{formatPrice(item.finalPrice)} DT</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {selectedMaterialIds.length > 0 && (
                      <View style={styles.materialTotalRow}>
                        <Text style={styles.materialTotalLabel}>
                          {t("plan.total_label", { defaultValue: "Total" })}
                        </Text>
                        <Text style={styles.materialTotalPrice}>{formatPrice(materialsTotal)} DT</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          );
        })}
      </Animated.ScrollView>

      {/* Pagination dots */}
      <View style={styles.paginationRow}>
        {packs.map((pack) => (
          <View
            key={pack.id}
            style={[
              styles.dot,
              effectiveActivePack === pack.id && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* CTA - fixed at bottom */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleCTA}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaTitle}>
            {hasPerMaterial && ctaPrice > 0
              ? `${t(PRO_UI_KEYS.ctaTitle)} — ${formatPrice(ctaPrice)} DT`
              : t(PRO_UI_KEYS.ctaTitle)}
          </Text>
          <Text style={styles.ctaSub}>{t(PRO_UI_KEYS.ctaSub)}</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={styles.footerLink}>{t(PRO_UI_KEYS.restore)}</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={handleTerms}>
            <Text style={styles.footerLink}>{t(PRO_UI_KEYS.terms)}</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={handlePrivacy}>
            <Text style={styles.footerLink}>{t(PRO_UI_KEYS.privacy)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
