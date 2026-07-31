import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import type { RootStackParamList } from "@config/types/navigation.types";
import { useGetPlansForChildQuery } from "@redux/apis/plans/plansApi";
import type {
  PlanFeatureUI,
  PlanMaterialPriceUI,
  PlanPricingUI,
  PlanUI,
} from "@redux/apis/plans/plansApi.type";
import { useAppTheme } from "@theme/ThemeProvider";
import { formatPrice, humanizeKey } from "@utils/helpers/plans.helpers";

import {
  getPlansPalette,
  plansStyles as styles,
} from "./PlansScreen.styles";

const HEADER_GRADIENT = ["#163867", "#1E4B86", "#22BEC8"] as const;

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PlansScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();

  const isDark = mode === "dark";
  const palette = getPlansPalette(colors, isDark);

  const {
    data: plans = [],
    isLoading,
    isError,
    refetch,
  } = useGetPlansForChildQuery();

  const currencyLabel = t("plans.currency", { defaultValue: "د.ت" });

  const formatCurrency = (value: number): string =>
    `${formatPrice(value)} ${currencyLabel}`;

  const getMonthsLabel = (months: number): string => {
    switch (months) {
      case 1:
        return t("plans.month_1", { defaultValue: "شهر واحد" });
      case 3:
        return t("plans.month_3", { defaultValue: "3 أشهر" });
      case 9:
        return t("plans.month_9", { defaultValue: "9 أشهر" });
      default:
        return `${months} ${t("plans.months", { defaultValue: "أشهر" })}`;
    }
  };

  const getPricingTypeLabel = (value: string): string =>
    value === "per_material"
      ? t("plans.per_material", { defaultValue: "لكل مادة" })
      : t("plans.total", { defaultValue: "إجمالي" });

  const getMaterialLabel = (materialKey: string): string => {
    if (!materialKey) {
      return t("plans.material", { defaultValue: "مادة" });
    }

    const nestedKey = `material.${materialKey}`;
    const fallback = humanizeKey(materialKey);

    return t(nestedKey, {
      defaultValue: t(materialKey, { defaultValue: fallback }),
    });
  };

  const getPlanTypeLabel = (planType: string): string => {
    const fallback = planType.replace(/_/g, " ");
    return t(`plans.plan_type.${planType}`, { defaultValue: fallback });
  };

  const renderPriceLine = (
    label: string,
    price: number,
    finalPrice: number,
    discount: number,
  ) => (
    <View style={styles.priceLine}>
      <Text style={[styles.priceLineLabel, { color: palette.text }]}>
        {label}
      </Text>

      <View style={styles.priceLineRight}>
        {discount > 0 ? (
          <>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>-{formatPrice(discount)}%</Text>
            </View>

            <Text style={[styles.oldPrice, { color: palette.muted }]}>
              {formatCurrency(price)}
            </Text>

            <Text style={[styles.newPrice, { color: palette.primary }]}>
              {formatCurrency(finalPrice)}
            </Text>
          </>
        ) : (
          <Text style={[styles.noDiscountPrice, { color: palette.primary }]}>
            {formatCurrency(finalPrice)}
          </Text>
        )}
      </View>
    </View>
  );

  const renderMaterialPricing = (item: PlanMaterialPriceUI) =>
    renderPriceLine(
      getMaterialLabel(item.materialKey),
      item.price,
      item.finalPrice,
      item.discount,
    );

  const renderPricingCard = (pricing: PlanPricingUI) => (
    <View
      key={pricing.id}
      style={[
        styles.pricingCard,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
        },
      ]}
    >
      <View style={styles.pricingTopRow}>
        <Text style={[styles.pricingMonths, { color: palette.text }]}>
          {getMonthsLabel(pricing.months)}
        </Text>

        <View
          style={[
            styles.pricingTypeBadge,
            {
              backgroundColor:
                pricing.pricingType === "per_material"
                  ? `${palette.primary}15`
                  : "rgba(245,166,35,0.18)",
            },
          ]}
        >
          <Text
            style={[
              styles.pricingTypeBadgeText,
              {
                color:
                  pricing.pricingType === "per_material"
                    ? palette.primary
                    : "#B96D00",
              },
            ]}
          >
            {getPricingTypeLabel(pricing.pricingType)}
          </Text>
        </View>
      </View>

      {pricing.pricingType === "per_material" ? (
        <>
          {pricing.materialPricings.map(renderMaterialPricing)}

          <Text style={[styles.priceHint, { color: palette.muted }]}>
            {t("plans.starting_from", { defaultValue: "يبدأ من" })}{" "}
            {formatCurrency(pricing.startingFromPrice)}
          </Text>
        </>
      ) : (
        renderPriceLine(
          t("plans.total_price", { defaultValue: "السعر الإجمالي" }),
          pricing.price,
          pricing.finalPrice,
          pricing.discount,
        )
      )}
    </View>
  );

  const renderFeature = (feature: PlanFeatureUI) => (
    <View key={feature.id} style={styles.featureRow}>
      <View style={styles.featureIconWrap}>
        <Ionicons
          name={feature.isAvailable ? "checkmark-circle" : "close-circle"}
          size={18}
          color={feature.isAvailable ? palette.primary : palette.muted}
        />
      </View>

      <View style={styles.featureTexts}>
        <Text style={[styles.featureTitle, { color: palette.text }]}>
          {feature.title}
        </Text>

        {feature.description && feature.description !== feature.title ? (
          <Text style={[styles.featureDescription, { color: palette.muted }]}>
            {feature.description}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const renderPlanCard = (plan: PlanUI) => (
    <View
      key={plan.id}
      style={[
        styles.planCard,
        {
          backgroundColor: palette.card,
          borderColor: plan.isPopular ? palette.primary : palette.border,
        },
      ]}
    >
      <View style={styles.planHeaderRow}>
        <View style={styles.planBadges}>
          {plan.isPopular ? (
            <View style={styles.popularBadge}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.popularBadgeText}>
                {t("plans.popular", { defaultValue: "الأكثر طلبًا" })}
              </Text>
            </View>
          ) : null}

          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${palette.primary}14` },
            ]}
          >
            <Text style={[styles.typeBadgeText, { color: palette.primary }]}>
              {getPlanTypeLabel(plan.planType)}
            </Text>
          </View>
        </View>

        <View style={styles.planHeaderTexts}>
          <Text style={[styles.planTitle, { color: palette.text }]}>
            {plan.title}
          </Text>

          {!!plan.description && (
            <Text style={[styles.planDescription, { color: palette.muted }]}>
              {plan.description}
            </Text>
          )}
        </View>
      </View>

      {!!plan.features.length && (
        <View style={styles.featuresBlock}>
          <Text style={[styles.sectionLabel, { color: palette.text }]}>
            {t("plans.features", { defaultValue: "مميزات الخطة" })}
          </Text>

          {plan.features.map(renderFeature)}
        </View>
      )}

      {!!plan.pricings.length && (
        <View style={styles.pricingsBlock}>
          <Text style={[styles.sectionLabel, { color: palette.text }]}>
            {t("plans.pricings", { defaultValue: "الأسعار" })}
          </Text>

          {plan.pricings.map(renderPricingCard)}
        </View>
      )}

      {!!plan.accessibleEntities.length && (
        <View style={styles.accessibleWrap}>
          <Text style={[styles.sectionLabel, { color: palette.text }]}>
            {t("plans.accessible_content", { defaultValue: "المحتوى المتاح" })}
          </Text>

          <View style={styles.accessibleChipsRow}>
            {plan.accessibleEntities.map((entity) => (
              <View
                key={entity.id}
                style={[
                  styles.accessibleChip,
                  {
                    backgroundColor: `${palette.primary}10`,
                    borderColor: `${palette.primary}24`,
                  },
                ]}
              >
                <Text
                  style={[styles.accessibleChipText, { color: palette.text }]}
                  numberOfLines={2}
                >
                  {entity.materialKey
                    ? `📘 ${entity.title} • ${getMaterialLabel(entity.materialKey)}`
                    : `📘 ${entity.title}`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.stateText, { color: palette.muted }]}>
          {t("plans.loading", { defaultValue: "جارٍ تحميل الخطط..." })}
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <Ionicons
          name="cloud-offline-outline"
          size={46}
          color={palette.danger}
        />
        <Text style={[styles.stateText, { color: palette.text }]}>
          {t("plans.error", {
            defaultValue: "تعذر تحميل الخطط. حاول مرة أخرى.",
          })}
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={refetch}
          style={[styles.retryBtn, { backgroundColor: palette.primary }]}
        >
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.retryBtnText}>
            {t("common.retry", { defaultValue: "إعادة المحاولة" })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={[...HEADER_GRADIENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerGlowLeft} />
          <View style={styles.headerGlowRight} />

          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.headerBackBtn}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.logoText}>
              <Text style={styles.logoA}>A</Text>
              <Text style={styles.logoB}>bajim</Text>
              <View style={styles.logoDot} />
            </View>
          </View>

          <Text style={styles.headerTitle}>
            {t("plans.screen_title", { defaultValue: "الاشتراكات" })}
          </Text>

          <Text style={styles.headerSubtitle}>
            {t("plans.screen_subtitle", {
              defaultValue: "كل خطة تعرض أسعارها الحقيقية حسب المدة والمادة",
            })}
          </Text>
        </LinearGradient>

        <View style={styles.body}>
          {plans.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                },
              ]}
            >
              <Ionicons
                name="wallet-outline"
                size={42}
                color={palette.primary}
              />
              <Text style={[styles.emptyTitle, { color: palette.text }]}>
                {t("plans.empty_title", {
                  defaultValue: "لا توجد خطط متاحة حاليًا",
                })}
              </Text>
              <Text style={[styles.emptyText, { color: palette.muted }]}>
                {t("plans.empty_text", {
                  defaultValue:
                    "عندما تصبح هناك خطط مناسبة لمستوى الطفل ستظهر هنا مباشرة.",
                })}
              </Text>
            </View>
          ) : (
            plans.map(renderPlanCard)
          )}
        </View>
      </ScrollView>
    </View>
  );
}