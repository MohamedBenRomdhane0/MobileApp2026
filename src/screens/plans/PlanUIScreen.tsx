import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
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
import { useAppTheme } from "@theme/ThemeProvider";

import { createPlanUIStyles, getPlanUIPalette } from "./PlanUIScreen.styles";
import {
  FEATURES,
  HERO_IMAGE,
  PLAN_OPTIONS,
  PLAN_UI_GRADIENT,
  PLAN_UI_KEYS,
  REVIEWS,
  STATS,
} from "./PlanUIScreen.constants";
import type { PlanUIType } from "./PlanUIScreen.type";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PlanUIScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.language ?? "ar") === "ar";

  const styles = createPlanUIStyles(colors, isDark, isRTL);
  const palette = getPlanUIPalette(colors, isDark);

  const [selectedPlan, setSelectedPlan] = useState<PlanUIType>("annual");
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const reviewsFlatListRef = useRef<FlatList>(null);

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleRestore = useCallback(() => {}, []);
  const handleTerms = useCallback(() => {}, []);
  const handlePrivacy = useCallback(() => {}, []);
  const handleCTA = useCallback(() => {}, []);

  const onReviewScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const contentX = event.nativeEvent.contentOffset.x;
      const cardWidth = 260;
      const index = Math.round(contentX / cardWidth);
      setActiveReviewIndex(index);
    },
    [],
  );

  const renderReviewCard = useCallback(
    ({ item }: { item: (typeof REVIEWS)[number] }) => (
      <View style={styles.reviewCard}>
        <View style={styles.reviewTopRow}>
          <Text style={styles.reviewTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <View style={styles.reviewStarsRow}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons key={i} name="star" size={14} color={palette.gold} />
            ))}
          </View>
          <Text style={styles.reviewAuthor}>{item.author}</Text>
        </View>
        <Text style={styles.reviewBody} numberOfLines={4}>
          {item.body}
        </Text>
      </View>
    ),
    [styles, palette.gold, isRTL],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Close button */}
      <TouchableOpacity
        style={[styles.closeBtn, { top: (insets.top || 44) + 8 }]}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}></View>
        {/* Hero */}
        {/* <View style={styles.heroContainer}>
          <Image source={HERO_IMAGE} style={styles.heroImage} />
          <LinearGradient
            colors={["transparent", palette.bg]}
            style={styles.heroGradient}
          />
          <TouchableOpacity
            style={[styles.closeBtn, { top: (insets.top || 44) + 8 }]}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View> */}

        {/* Plan Selector */}
        <Text style={styles.sectionTitle}>
          {t(PLAN_UI_KEYS.transformationTitle)}
        </Text>
        <View style={styles.plansSection}>
          {PLAN_OPTIONS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected ? styles.planCardSelected : styles.planCardUnselected,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                <View style={styles.planLeft}>
                  <View style={styles.planLabelRow}>
                    <Text style={styles.planLabel}>{t(plan.labelKey)}</Text>
                    {plan.savingsBadge && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>
                          {t(plan.savingsBadge)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{t(plan.periodLabel)}</Text>
                  </View>
                  {plan.trialText && (
                    <Text style={styles.planTrialText}>
                      {t(plan.trialText)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={handleCTA}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[...PLAN_UI_GRADIENT.cta]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>{t(PLAN_UI_KEYS.ctaTrial)}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>
          {t(PLAN_UI_KEYS.featuresTitle)}
        </Text>
        <View style={styles.featuresSection}>
          {FEATURES.map((feature) => (
            <View key={feature.id} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Image source={feature.icon} style={styles.featureIcon} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>{t(feature.titleKey)}</Text>
                <Text style={styles.featureBody}>{t(feature.bodyKey)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Headline */}
        <View style={styles.headlineSection}>
          <Text style={styles.headlineText}>
            {t(PLAN_UI_KEYS.joinHeadline)}{" "}
            <Text style={styles.headlineHighlight}>
              {t(PLAN_UI_KEYS.joinHighlight)}
            </Text>
          </Text>
          <Text style={styles.headlineSub}>{t(PLAN_UI_KEYS.joinSub)}</Text>
        </View>

        {/* Reviews Carousel */}
        <FlatList
          ref={reviewsFlatListRef}
          data={REVIEWS}
          renderItem={renderReviewCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={272}
          decelerationRate="fast"
          onMomentumScrollEnd={onReviewScroll}
          contentContainerStyle={styles.reviewsTrack}
          style={styles.reviewsScroll}
        />

        {/* Dot Indicators */}
        <View style={styles.dotsRow}>
          {REVIEWS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeReviewIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={styles.footerLink}>{t(PLAN_UI_KEYS.restore)}</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={handleTerms}>
            <Text style={styles.footerLink}>{t(PLAN_UI_KEYS.terms)}</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={handlePrivacy}>
            <Text style={styles.footerLink}>{t(PLAN_UI_KEYS.privacy)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
