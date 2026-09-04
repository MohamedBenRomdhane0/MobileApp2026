import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { PlanUI } from "@redux/apis/plans/plansApi.type";
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

/** Monthly pricing of a plan — monthly first, first pricing as fallback. */
const monthlyPricingOf = (plan: PlanUI) =>
  plan.pricings.find((p) => p.months === 1) ?? plan.pricings[0];

/**
 * Compact plan tiles in a 2-column grid. Each tile is a single-color mini
 * card (plan color), shows the monthly price with strikethrough when a
 * discount applies, and a tappable CTA that opens the Plans screen.
 */
export default function MiniPlanCards({
  styles,
  palette,
  isRTL,
  plans,
  currencyLabel,
  perMonthLabel,
  popularLabel,
  ctaLabel,
  onPress,
}: MiniPlanCardsProps) {
  if (plans.length === 0) return null;

  return (
    <View style={styles.plansGrid}>
      {plans.map((plan) => {
        const pricing = monthlyPricingOf(plan);
        const cardColor =
          plan.color || (plan.isPopular ? POPULAR_COLOR_FALLBACK : palette.teal);
        const price = pricing?.finalPrice ?? pricing?.price ?? 0;
        const oldPrice =
          pricing && (pricing.discount ?? 0) > 0 ? pricing.price : null;
        const iconName = resolvePlanIcon(plan.icon);

        return (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.88}
            onPress={onPress}
            style={[
              styles.miniPlanCard,
              { borderColor: `${cardColor}55`, shadowColor: cardColor },
            ]}
          >
            <View style={styles.miniPlanTop}>
              <View
                style={[
                  styles.miniPlanIconTile,
                  {
                    backgroundColor: `${cardColor}18`,
                    borderColor: `${cardColor}33`,
                  },
                ]}
              >
                <Ionicons name={iconName} size={15} color={cardColor} />
              </View>

              {plan.isPopular ? (
                <View
                  style={[styles.miniPlanPopular, { backgroundColor: cardColor }]}
                >
                  <Text style={styles.miniPlanPopularText}>{popularLabel}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.miniPlanTitle} numberOfLines={2}>
              {plan.title}
            </Text>

            <View style={styles.miniPlanPriceRow}>
              <Text style={[styles.miniPlanPrice, { color: cardColor }]}>
                {formatPrice(price)} {currencyLabel}
              </Text>
              <Text style={styles.miniPlanPerMonth}>/{perMonthLabel}</Text>
            </View>

            {oldPrice != null && oldPrice > 0 ? (
              <Text style={styles.miniPlanOldPrice}>
                {formatPrice(oldPrice)} {currencyLabel}
              </Text>
            ) : null}

            <View style={[styles.miniPlanCta, { backgroundColor: cardColor }]}>
              <Text style={styles.miniPlanCtaText}>{ctaLabel}</Text>
              <Ionicons
                name={isRTL ? "arrow-back" : "arrow-forward"}
                size={12}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}