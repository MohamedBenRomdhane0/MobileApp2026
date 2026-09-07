import React from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import type { PlanPricingUI, PlanUI } from "@redux/apis/plans/plansApi.type";
import { formatPrice } from "@utils/helpers/plans.helpers";
import type { MiniPlanCardsProps } from "@screens/home/HomeScreen.type";

const PLAN_ICON_BY_NAME: Record<string, keyof typeof Ionicons.glyphMap> = {
  MenuBook: "book-outline",
  Book: "book-outline",
  MenuBookOutlined: "book-outline",
  Videocam: "videocam-outline",
  VideocamOutlined: "videocam-outline",
  LiveTv: "tv-outline",
  LiveTvOutlined: "tv-outline",
  School: "school-outline",
  SchoolOutlined: "school-outline",
  VideoLibrary: "play-circle-outline",
  VideoLibraryOutlined: "play-circle-outline",
  Star: "star-outline",
  StarOutlined: "star-outline",
  Rocket: "rocket-outline",
  RocketLaunch: "rocket-outline",
  AutoAwesome: "sparkles-outline",
  AutoAwesomeOutlined: "sparkles-outline",
};

const resolvePlanIcon = (icon: string): keyof typeof Ionicons.glyphMap =>
  PLAN_ICON_BY_NAME[icon] ?? "pricetag-outline";

const POPULAR_COLOR_FALLBACK = "#8B5CF6";

const bestPerMaterialPricing = (plan: PlanUI): PlanPricingUI | undefined =>
  plan.pricings.find((p) => p.pricingType === "per_material") ??
  plan.pricings.find((p) => p.materialPricings.length > 0);

const periodSuffix = (months: number): string => {
  if (months >= 10) return "/ annuel";
  if (months >= 3) return `/${Math.round(months / 3)} trim.`;
  return "/mois";
};

type CardProps = {
  plan: PlanUI;
  index: number;
  isRTL: boolean;
  styles: MiniPlanCardsProps["styles"];
  currencyLabel: string;
  perMonthLabel: string;
  annualLabel: string;
  startingFromLabel: string;
  popularLabel: string;
  ctaLabel: string;
  onPress: () => void;
  onPlanPress?: (planId: number) => void;
};

function PlanCard({
  plan,
  index,
  isRTL,
  styles,
  currencyLabel,
  perMonthLabel,
  annualLabel,
  startingFromLabel,
  popularLabel,
  ctaLabel,
  onPress,
  onPlanPress,
}: CardProps) {
  const entrance = useHomeCardEntrance(index);
  const press = useHomeCardPress();

  const monthlyPricing = plan.pricings.find((p) => p.months === 1);
  const perMatPricing = bestPerMaterialPricing(plan);
  const isPerMaterial = perMatPricing?.pricingType === "per_material";

  const cardColor =
    plan.color || (plan.isPopular ? POPULAR_COLOR_FALLBACK : "#22BEC8");

  let displayPrice: number;
  let isAnnualOnly = false;
  let suffix: string;

  if (isPerMaterial) {
    displayPrice = perMatPricing?.startingFromPrice ?? 0;
    suffix = "";
  } else if (monthlyPricing) {
    displayPrice = monthlyPricing.finalPrice ?? monthlyPricing.price ?? 0;
    suffix = `/ ${perMonthLabel}`;
  } else {
    const fallback = plan.pricings[0];
    displayPrice = fallback?.finalPrice ?? fallback?.price ?? 0;
    suffix = periodSuffix(fallback?.months ?? 0);
    isAnnualOnly = true;
  }

  const iconName = resolvePlanIcon(plan.icon);

  return (
    <Animated.View
      style={[
        styles.miniPlanCard,
        {
          opacity: entrance.opacity,
          transform: [
            { translateY: entrance.translateY },
            { scale: press.scale },
          ],
        },
      ]}
    >
      <Pressable
        onPress={() =>
          onPlanPress ? onPlanPress(plan.id) : onPress()
        }
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={styles.miniPlanCardPress}
      >
        <LinearGradient
          colors={[`${cardColor}18`, `${cardColor}08`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.miniPlanCardInner}
        >
          <View
              style={[
                styles.miniPlanBloom,
                { backgroundColor: `${cardColor}14` },
              ]}
            pointerEvents="none"
          />

          <View style={styles.miniPlanTop}>
            <View
              style={[
                styles.miniPlanIconTile,
                { backgroundColor: `${cardColor}20`, borderColor: `${cardColor}30` },
              ]}
            >
              <Ionicons name={iconName} size={16} color={cardColor} />
            </View>

            {plan.isPopular ? (
              <View
                style={[styles.miniPlanPopular, { backgroundColor: cardColor }]}
              >
                <Text style={styles.miniPlanPopularText}>{popularLabel}</Text>
              </View>
            ) : isAnnualOnly ? (
              <View
                style={[styles.miniPlanAnnualBadge, { backgroundColor: "#F59E0B" }]}
              >
                <Ionicons name="calendar-outline" size={9} color="#FFFFFF" />
                <Text style={styles.miniPlanAnnualBadgeText}>{annualLabel}</Text>
              </View>
            ) : null}
          </View>

          <Text
            style={[styles.miniPlanTitle, { color: cardColor }]}
            numberOfLines={2}
          >
            {plan.title}
          </Text>

          {isPerMaterial ? (
            <Text style={[styles.miniPlanStartingFrom, { color: cardColor }]}>
              {startingFromLabel}
            </Text>
          ) : null}

          <View style={styles.miniPlanPriceRow}>
            <Text style={[styles.miniPlanPrice, { color: cardColor }]}>
              {formatPrice(displayPrice)} {currencyLabel}
            </Text>
            {!isPerMaterial ? (
              <Text style={styles.miniPlanPerMonth}>{suffix}</Text>
            ) : null}
          </View>

          <View style={[styles.miniPlanCta, { backgroundColor: cardColor }]}>
            <Text style={styles.miniPlanCtaText}>{ctaLabel}</Text>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={11}
              color="#FFFFFF"
            />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Simple plan cards matching the clean MaterialsRow / TeachersRow style,
 * with staggered entrance animation and spring press feedback.
 */
export default function MiniPlanCards({
  styles,
  palette,
  isRTL,
  plans,
  currencyLabel,
  perMonthLabel,
  annualLabel,
  startingFromLabel,
  popularLabel,
  ctaLabel,
  onPress,
  onPlanPress,
}: MiniPlanCardsProps) {
  if (plans.length === 0) return null;

  return (
    <View style={styles.plansGrid}>
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          index={index}
          isRTL={isRTL}
          styles={styles}
          currencyLabel={currencyLabel}
          perMonthLabel={perMonthLabel}
          annualLabel={annualLabel}
          startingFromLabel={startingFromLabel}
          popularLabel={popularLabel}
          ctaLabel={ctaLabel}
          onPress={onPress}
          onPlanPress={onPlanPress}
        />
      ))}
    </View>
  );
}
