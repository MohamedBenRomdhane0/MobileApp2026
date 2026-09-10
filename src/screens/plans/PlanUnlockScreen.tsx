import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import type { RootStackParamList } from "@config/types/navigation.types";
import { PATHS } from "@config/constants/paths";
import { useAppTheme } from "@theme/ThemeProvider";

import { createUnlockStyles } from "./PlanUnlockScreen.styles";
import {
  UNLOCK_UI_KEYS,
  UNLOCK_PACKS,
  UNLOCK_ICON_MAP,
} from "./PlanUnlockScreen.constants";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type UnlockRoute = RouteProp<RootStackParamList, typeof PATHS.APP.PLAN_UNLOCK>;

export default function PlanUnlockScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<UnlockRoute>();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.language ?? "ar") === "ar";
  const isDark = mode === "dark";

  const styles = createUnlockStyles(colors, isDark, isRTL);

  const packId = route.params?.packId ?? "pack1";
  const pack = UNLOCK_PACKS[packId as keyof typeof UNLOCK_PACKS] ?? UNLOCK_PACKS["pack1"];

  const [selectedPlan, setSelectedPlan] = useState<string>(
    pack.plans[0]?.id ?? "monthly",
  );

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleCTA = useCallback(() => {
    navigation.navigate(PATHS.APP.PLAN_UI);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      {/* Decorative blobs */}
      <View style={styles.blobContainer} pointerEvents="none">
        <View style={styles.blobA} />
        <View style={styles.blobB} />
        <View style={styles.blobC} />
      </View>

      {/* Close button */}
      <TouchableOpacity
        style={[styles.closeBtn, { top: (insets.top || 44) + 8 }]}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <Ionicons
          name="close"
          size={18}
          color={isDark ? "#FFFFFF" : "#0F172A"}
        />
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.content, { paddingTop: (insets.top || 44) + 48 }]}
        >
          {/* Headline */}
          <Text style={styles.headline}>
            {t(UNLOCK_UI_KEYS.headline1)}{" "}
            <Text style={styles.headlineHighlight}>
              {t(pack.headlineHighlightKey)}
            </Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{t(pack.subtitleKey)}</Text>

          {/* Features grid */}
          <View style={styles.featuresGrid}>
            {pack.features.map((feature) => {
              const hasImage = feature.iconName in UNLOCK_ICON_MAP;
              return (
                <View key={feature.id} style={styles.featureItem}>
                  <View style={styles.featureIconWrap}>
                    {hasImage ? (
                      <Image
                        source={UNLOCK_ICON_MAP[feature.iconName]}
                        style={{ width: 48, height: 48 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Ionicons
                        name={feature.iconName as keyof typeof Ionicons.glyphMap}
                        size={42}
                        color={feature.color}
                      />
                    )}
                  </View>
                  <Text style={styles.featureLabel}>{t(feature.labelKey)}</Text>
                </View>
              );
            })}
          </View>

          {/* Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>
              {t(UNLOCK_UI_KEYS.detailsTitle)}
            </Text>
            <View style={styles.detailRow}>
              <View style={styles.detailDot} />
              <Text style={styles.detailText}>{t(UNLOCK_UI_KEYS.detail1)}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailDot} />
              <Text style={styles.detailText}>{t(UNLOCK_UI_KEYS.detail2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailDot} />
              <Text style={styles.detailText}>{t(UNLOCK_UI_KEYS.detail3)}</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.pricingSection}>
            <View style={styles.plansSection}>
              {pack.plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planCard,
                      isSelected
                        ? styles.planCardSelected
                        : styles.planCardUnselected,
                    ]}
                    onPress={() => setSelectedPlan(plan.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.planTopRow}>
                      <Text style={styles.planName}>{t(plan.nameKey)}</Text>
                      {plan.badge && (
                        <View style={styles.planBadge}>
                          <Text style={styles.planBadgeText}>
                            {t(plan.badge)}
                          </Text>
                        </View>
                      )}
                    </View>
                    {plan.trialKey && (
                      <Text style={styles.planTrial}>{t(plan.trialKey)}</Text>
                    )}
                    <View style={styles.planPriceRow}>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPeriod}>{t(plan.periodKey)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA + footer fixed at bottom */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleCTA}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaTitle}>{t(UNLOCK_UI_KEYS.ctaTitle)}</Text>
          <Text style={styles.ctaSub}>{t(UNLOCK_UI_KEYS.ctaSub)}</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.footerLink}>
              {t(UNLOCK_UI_KEYS.restore)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.footerLink}>
              {t(UNLOCK_UI_KEYS.terms)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.footerLink}>
              {t(UNLOCK_UI_KEYS.privacy)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
