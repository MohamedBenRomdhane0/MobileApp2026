import React, { useCallback, useRef, useState } from "react";
import {
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import type { RootStackParamList } from "@config/types/navigation.types";
import { PATHS } from "@config/constants/paths";
import { useAppTheme } from "@theme/ThemeProvider";

import { createProPricingStyles } from "./PlanProPricingSectionScreen.styles";
import { PRO_UI_KEYS, SWIPER_PACKS } from "./PlanProPricingSectionScreen.constants";
import type { PackConfig, ProPlanType, SwiperPack } from "./PlanProPricingSectionScreen.type";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get("window");

export default function PlanProPricingSectionScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.language ?? "ar") === "ar";

  const styles = createProPricingStyles(colors, isRTL);

  const [activePack, setActivePack] = useState<SwiperPack>("pack1");
  const [selectedPlan, setSelectedPlan] = useState<ProPlanType>("quarterly");
  const scrollX = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef<ScrollView>(null);

  const activePackConfig: PackConfig =
    SWIPER_PACKS.find((p) => p.id === activePack) ?? SWIPER_PACKS[0];

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleCTA = useCallback(() => {
    navigation.navigate(PATHS.APP.PLAN_UNLOCK, { packId: activePack });
  }, [navigation, activePack]);
  const handleRestore = useCallback(() => {}, []);
  const handleTerms = useCallback(() => {}, []);
  const handlePrivacy = useCallback(() => {}, []);

  const handleSwiperScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
      if (SWIPER_PACKS[index]) {
        const newPack = SWIPER_PACKS[index];
        setActivePack(newPack.id);
        setSelectedPlan(newPack.plans[0]?.id ?? "monthly");
      }
    },
    [],
  );

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
        {SWIPER_PACKS.map((pack) => {
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
                <View style={styles.plansSection}>
                  {packPlans.map((plan) => {
                    const isSelected = pack.id === activePack
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
              </View>
            </ScrollView>
          );
        })}
      </Animated.ScrollView>

      {/* Pagination dots */}
      <View style={styles.paginationRow}>
        {SWIPER_PACKS.map((pack) => (
          <View
            key={pack.id}
            style={[
              styles.dot,
              activePack === pack.id && styles.dotActive,
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
          <Text style={styles.ctaTitle}>{t(PRO_UI_KEYS.ctaTitle)}</Text>
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
