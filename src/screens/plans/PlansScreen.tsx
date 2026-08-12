import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import * as Haptics from "expo-haptics";

import type { RootStackParamList } from "@config/types/navigation.types";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId } from "@redux/slices/authSlice";
import { useGetPlansForChildQuery } from "@redux/apis/plans/plansApi";
import type {
  PlanAccessibleEntityUI,
  PlanFeatureUI,
  PlanMaterialPriceUI,
  PlanPricingUI,
  PlanUI,
} from "@redux/apis/plans/plansApi.type";
import { useGetMaterialsByLevelQuery } from "@redux/apis/materials/materialsApi";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import { useGetBooksQuery } from "@redux/apis/books/bookApi";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";
import { useAppTheme } from "@theme/ThemeProvider";
import { getMaterialEmoji } from "@utils/helpers/materialIcon.helper";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import {
  filterBooksByMaterial,
  filterTeachersByMaterial,
  isSubscribeEnabled,
  requiresBook,
  requiresTeacher,
} from "@utils/helpers/planSelection.helper";
import { formatPrice, humanizeKey } from "@utils/helpers/plans.helpers";
import { MOCK_TEACHERS } from "@screens/home/HomeScreen.constants";
import {
  getMaterialLabel as getMaterialLabelFor,
  pickMaterialArtwork,
  toValidId,
} from "@screens/home/HomeScreen.helpers";
import { BookSelectorList } from "@components/plans/BookSelectorList";
import { ConditionalSelectionSection } from "@components/plans/ConditionalSelectionSection";
import { SelectionBubbleDock } from "@components/plans/SelectionBubbleDock";
import type { SelectionBubble } from "@components/plans/SelectionBubbleDock";
import { TeacherSelectorList } from "@components/plans/TeacherSelectorList";

import {
  CTA_GRADIENT,
  PERIOD_DISCOUNT_LABELS,
  PERIOD_LABEL_KEYS,
  PERIOD_MONTHS_MAP,
  PLANS_HEADER_GRADIENT,
  PLANS_UI,
} from "./PlansScreen.constants";
import { createPlansStyles, getPlansPalette } from "./PlansScreen.styles";
import type { PlanSelectionState, PlanType, SelectedPeriod } from "./PlansScreen.type";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PERIODS: SelectedPeriod[] = ["monthly", "quarterly", "yearly"];

const PLAN_TYPE_OPTIONS: Array<{ type: PlanType; labelKey: string }> = [
  { type: "live", labelKey: PLANS_UI.tabLive },
  { type: "books_docs", labelKey: PLANS_UI.tabBundle },
  { type: "books", labelKey: PLANS_UI.tabBooks },
];

const SUBSCRIBE_HINT_KEYS: Record<PlanType, string> = {
  live:       "plan.subscribe_hint_live",
  books:      "plan.subscribe_hint_books",
  books_docs: "plan.subscribe_hint_bundle",
};

const PLAN_TYPE_TOKENS: Record<PlanType, string[]> = {
  live:       ["live"],
  books_docs: ["bundle", "books_docs", "docs"],
  books:      ["books"],
};

export default function PlansScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { colors, mode } = useAppTheme();

  const isDark = mode === "dark";
  const isRTL = (i18n.language ?? "ar") === "ar";
  const styles = createPlansStyles(colors, isDark, isRTL);
  const palette = getPlansPalette(colors, isDark);

  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod>("monthly");
  const [planType, setPlanType] = useState<PlanType>("live");
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(null);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [shakeTick, setShakeTick] = useState(0);

  const {
    data: plans = [],
    isLoading,
    isError,
    refetch,
  } = useGetPlansForChildQuery();

  const headerData = useActiveChildHeaderData();
  const levelId = useMemo(
    () => pickLevelIdFromChild(headerData?.child),
    [headerData?.child]
  );

  const activeChildId = useAppSelector(selectActiveChildId);
  const childAccessToken = useAppSelector((s) => s.auth.childAccessToken);
  const isChildReady = toValidId(activeChildId) > 0 && !!childAccessToken;

  const {
    data: materialsData,
    isLoading: materialsLoading,
    isError: materialsError,
    refetch: refetchMaterials,
  } = useGetMaterialsByLevelQuery(
    { levelId: toValidId(levelId), locale: i18n.language ?? "fr" },
    { skip: !toValidId(levelId) }
  );

  const materials: MaterialUI[] = useMemo(
    () => (Array.isArray(materialsData) ? materialsData : []),
    [materialsData]
  );

  const {
    data: booksData,
    isLoading: booksLoading,
  } = useGetBooksQuery(
    { page: 1, perPage: 20, keyword: "" },
    { skip: !isChildReady }
  );

  const books: BookListItemUI[] = useMemo(
    () => (Array.isArray(booksData?.data) ? booksData.data : []),
    [booksData]
  );

  const selectedMatiere = useMemo(
    () =>
      selectedMatiereId != null
        ? materials.find((m) => m.id === selectedMatiereId) ?? null
        : null,
    [materials, selectedMatiereId]
  );

  const matiereLabel = selectedMatiere ? getMaterialLabelFor(t, selectedMatiere) : "";

  const teachersForMatiere = useMemo(
    () =>
      selectedMatiere
        ? filterTeachersByMaterial(MOCK_TEACHERS, selectedMatiere)
        : [],
    [selectedMatiere]
  );

  const booksForMatiere = useMemo(
    () => (selectedMatiere ? filterBooksByMaterial(books, selectedMatiere) : []),
    [selectedMatiere, books]
  );

  const selectedTeachers = useMemo(
    () => MOCK_TEACHERS.filter((teacher) => selectedTeacherIds.includes(teacher.id)),
    [selectedTeacherIds]
  );

  const selectedBooks = useMemo(
    () => books.filter((book) => selectedBookIds.includes(book.id)),
    [books, selectedBookIds]
  );

  // When the matière or its data changes, drop selections that no longer exist.
  useEffect(() => {
    setSelectedTeacherIds((ids) => {
      const next = ids.filter((id) => teachersForMatiere.some((t) => t.id === id));
      return next.length === ids.length ? ids : next;
    });
  }, [teachersForMatiere]);

  useEffect(() => {
    setSelectedBookIds((ids) => {
      const next = ids.filter((id) => booksForMatiere.some((b) => b.id === id));
      return next.length === ids.length ? ids : next;
    });
  }, [booksForMatiere]);

  const toggleTeacher = useCallback((id: number) => {
    setSelectedTeacherIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }, []);

  const toggleBook = useCallback((id: number) => {
    setSelectedBookIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }, []);

  const currencyLabel = t("plan.currency", { defaultValue: "د.ت" });

  const formatCurrency = (value: number): string =>
    `${formatPrice(value)} ${currencyLabel}`;

  const getPeriodLabel = (period: SelectedPeriod): string =>
    t(PERIOD_LABEL_KEYS[period]);

  const getMonthsLabel = (months: number): string => {
    switch (months) {
      case 1:
        return t("plan.period_monthly");
      case 3:
        return t("plan.period_quarterly");
      case 9:
        return t("plan.period_yearly");
      default:
        return `${months} ${t("plan.months", { defaultValue: "mois" })}`;
    }
  };

  const getMaterialLabel = (materialKey: string): string => {
    if (!materialKey) {
      return t("plan.material", { defaultValue: "Matière" });
    }

    const nestedKey = `material.${materialKey}`;
    const fallback = humanizeKey(materialKey);

    return t(nestedKey, {
      defaultValue: t(materialKey, { defaultValue: fallback }),
    });
  };

  const getPlanTypeLabel = (planTypeValue: string): string => {
    const fallback = planTypeValue.replace(/_/g, " ");
    return t(`plans.plan_type.${planTypeValue}`, { defaultValue: fallback });
  };

  const getPricingForPeriod = (plan: PlanUI): PlanPricingUI | undefined =>
    plan.pricings.find((p) => p.months === PERIOD_MONTHS_MAP[selectedPeriod]) ??
    plan.pricings[0];

  const selectionState: PlanSelectionState = useMemo(
    () => ({
      planType,
      selectedMatiere: selectedMatiereId,
      selectedTeachers: selectedTeacherIds,
      selectedBooks: selectedBookIds,
    }),
    [planType, selectedMatiereId, selectedTeacherIds, selectedBookIds]
  );
  const subscribeEnabled = isSubscribeEnabled(selectionState);

  const visiblePlans = useMemo(() => {
    const tokens = PLAN_TYPE_TOKENS[planType];
    const matched = plans.filter((plan) =>
      tokens.some((token) =>
        String(plan.planType ?? "").toLowerCase().includes(token)
      )
    );
    return matched.length > 0 ? matched : plans;
  }, [plans, planType]);

  const basePricing = useMemo(() => {
    const plan = visiblePlans[0];
    if (!plan) return null;
    return getPricingForPeriod(plan);
  }, [visiblePlans, selectedPeriod]);

  const dockTotal = basePricing
    ? formatCurrency(basePricing.finalPrice)
    : t("plan.cta_label");
  const dockHint = basePricing
    ? `/${t("plan.per_month")} • ${getPeriodLabel(selectedPeriod)}`
    : "";

  const dockBubbles = useMemo<SelectionBubble[]>(() => {
    const teacherBubbles: SelectionBubble[] = selectedTeachers.map((teacher) => ({
      id: `t-${teacher.id}`,
      kind: "teacher",
      label: teacher.fullName,
      source: teacher.avatar,
      fallback: "👩‍🏫",
      onRemove: () => toggleTeacher(teacher.id),
    }));

    const bookBubbles: SelectionBubble[] = selectedBooks.map((book) => ({
      id: `b-${book.id}`,
      kind: "book",
      label: book.title,
      source: book.coverUrl ? { uri: book.coverUrl } : null,
      fallback: "📘",
      onRemove: () => toggleBook(book.id),
    }));

    return [...teacherBubbles, ...bookBubbles];
  }, [selectedTeachers, selectedBooks, toggleTeacher, toggleBook]);

  const handleSelectPlanType = (next: PlanType) => {
    if (next === planType) return;
    setPlanType(next);
    setSelectedTeacherIds([]);
    setSelectedBookIds([]);
  };

  const handleSelectMatiere = (id: number) => {
    if (id === selectedMatiereId) return;
    setSelectedMatiereId(id);
  };

  const handleSubscribe = useCallback(() => {
    if (!subscribeEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShakeTick((n) => n + 1);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [subscribeEnabled]);

  const renderFeature = (feature: PlanFeatureUI) => (
    <View key={feature.id} style={styles.featureRow}>
      <View
        style={[
          styles.featureIconWrap,
          {
            backgroundColor: feature.isAvailable
              ? `${palette.primary}1A`
              : `${palette.muted}22`,
          },
        ]}
      >
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

  const renderMaterialRow = (item: PlanMaterialPriceUI) => (
    <View key={item.id} style={styles.materialRow}>
      <Text
        style={[styles.materialLabel, { color: palette.text }]}
        numberOfLines={1}
      >
        {getMaterialEmoji(item.materialKey)} {getMaterialLabel(item.materialKey)}
      </Text>

      <View style={styles.materialRowPrices}>
        {item.discount > 0 ? (
          <Text style={[styles.oldPrice, { color: palette.muted }]}>
            {formatCurrency(item.price)}
          </Text>
        ) : null}

        <Text style={[styles.materialFinalPrice, { color: palette.primary }]}>
          {formatCurrency(item.finalPrice)}
        </Text>
      </View>
    </View>
  );

  const renderPricingHero = (pricing: PlanPricingUI, isPopular: boolean) => {
    const isPerMaterial = pricing.pricingType === "per_material";
    const heroPrice = isPerMaterial
      ? pricing.startingFromPrice
      : pricing.finalPrice;
    const heroColor = isPopular ? palette.gold : palette.primary;

    return (
      <View
        style={[
          styles.priceHero,
          {
            backgroundColor: palette.heroBand,
            borderColor: isPerMaterial
              ? `${palette.primary}22`
              : "rgba(245,166,35,0.24)",
          },
        ]}
      >
        <View style={styles.priceHeroTop}>
          <Text style={[styles.priceHintLabel, { color: palette.muted }]}>
            {isPerMaterial
              ? t("plan.starting_from")
              : getMonthsLabel(pricing.months)}
          </Text>

          {pricing.discount > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                −{formatPrice(pricing.discount)}%
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.priceHeroBottom}>
          <View style={styles.priceValueRow}>
            <Text style={[styles.priceValue, { color: heroColor }]}>
              {formatCurrency(heroPrice)}
            </Text>
            <Text style={[styles.pricePerMonth, { color: palette.muted }]}>
              /{t("plan.per_month")}
            </Text>
          </View>

          {pricing.discount > 0 && pricing.price > 0 ? (
            <Text style={[styles.oldPrice, { color: palette.muted }]}>
              {formatCurrency(pricing.price)}
            </Text>
          ) : null}
        </View>

        {isPerMaterial && pricing.materialPricings.length > 0 ? (
          <>
            <View style={[styles.priceDivider, { backgroundColor: palette.border }]} />
            {pricing.materialPricings.map(renderMaterialRow)}
          </>
        ) : null}
      </View>
    );
  };

  const renderAccessibleChip = (entity: PlanAccessibleEntityUI) => (
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
  );

  const renderPlanCard = (plan: PlanUI) => {
    const pricing = getPricingForPeriod(plan);

    return (
      <View
        key={plan.id}
        style={[
          styles.planCard,
          {
            backgroundColor: palette.card,
            borderColor: plan.isPopular ? palette.gold : palette.border,
          },
          plan.isPopular ? styles.planCardPopular : null,
        ]}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.badgesRow}>
            {plan.isPopular ? (
              <LinearGradient
                colors={[palette.gold, palette.goldStrong]}
                style={styles.popularPill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.popularPillText}>
                  {t("plan.most_popular")}
                </Text>
              </LinearGradient>
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
        </View>

        <Text style={[styles.planTitle, { color: palette.text }]}>
          {plan.title}
        </Text>

        {!!plan.description && (
          <Text style={[styles.planDescription, { color: palette.muted }]}>
            {plan.description}
          </Text>
        )}

        {pricing ? renderPricingHero(pricing, plan.isPopular) : null}

        {!!plan.features.length && (
          <View style={styles.featuresBlock}>
            <Text style={[styles.sectionLabel, { color: palette.text }]}>
              {t("plan.features")}
            </Text>

            {plan.features.map(renderFeature)}
          </View>
        )}

        {!!plan.accessibleEntities.length && (
          <View style={styles.accessibleWrap}>
            <Text style={[styles.sectionLabel, { color: palette.text }]}>
              {t("plan.accessible_entities")}
            </Text>

            <View style={styles.accessibleChipsRow}>
              {plan.accessibleEntities.map(renderAccessibleChip)}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.stateText, { color: palette.muted }]}>
          {t("plan.loading")}
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
          {t("plan.error")}
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={refetch}
          style={[styles.retryBtn, { backgroundColor: palette.primary }]}
        >
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.retryBtnText}>{t("common.retry")}</Text>
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
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={[...PLANS_HEADER_GRADIENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerGlowLeft} />
          <View style={styles.headerGlowRight} />
          <View style={styles.headerDotRing} />

          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.headerBackBtn}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name={isRTL ? "arrow-forward" : "arrow-back"}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.logoText}>
              <Text style={styles.logoA}>A</Text>
              <Text style={styles.logoB}>bajim</Text>
              <View style={styles.logoDot} />
            </View>
          </View>

          <Text style={styles.headerTitle}>{t("plan.screen_title")}</Text>

          <Text style={styles.headerSubtitle}>
            {t("plan.screen_subtitle")}
          </Text>
        </LinearGradient>

        <View style={styles.body}>
          <View
            style={[
              styles.periodWrap,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}
          >
            {PERIODS.map((period) => {
              const active = period === selectedPeriod;
              const discount = PERIOD_DISCOUNT_LABELS[period];

              return (
                <TouchableOpacity
                  key={period}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPeriod(period)}
                  style={styles.periodBtn}
                >
                  {active ? (
                    <LinearGradient
                      colors={[...CTA_GRADIENT]}
                      style={styles.periodActiveBg}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  ) : null}

                  <Text
                    style={[
                      styles.periodLabel,
                      active && styles.periodLabelActive,
                      !active && { color: palette.muted },
                    ]}
                  >
                    {getPeriodLabel(period)}
                  </Text>

                  {discount ? (
                    <View
                      style={[
                        styles.periodBadge,
                        {
                          backgroundColor: active
                            ? "rgba(255,255,255,0.22)"
                            : `${palette.primary}16`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.periodBadgeText,
                          active && { color: "#FFFFFF" },
                          !active && { color: palette.primary },
                        ]}
                      >
                        −{discount}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.builderCard}>
            <View style={styles.builderToggleWrap}>
              {PLAN_TYPE_OPTIONS.map((option) => {
                const active = option.type === planType;

                return (
                  <TouchableOpacity
                    key={option.type}
                    activeOpacity={0.85}
                    onPress={() => handleSelectPlanType(option.type)}
                    style={styles.builderToggleBtn}
                  >
                    {active ? (
                      <LinearGradient
                        colors={[...CTA_GRADIENT]}
                        style={styles.builderToggleActiveBg}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    ) : null}

                    <Text
                      style={[
                        styles.builderToggleLabel,
                        active
                          ? styles.builderToggleLabelActive
                          : { color: palette.muted },
                      ]}
                    >
                      {t(option.labelKey).trim()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.builderDivider} />

            <Text style={[styles.matiereTitle, { color: palette.text }]}>
              {t("plan.choose_subject")}
            </Text>

            {materialsLoading ? (
              <View style={styles.matiereChipsWrap}>
                {[0, 1, 2, 3].map((key) => (
                  <View key={key} style={styles.matiereChipSkeleton} />
                ))}
              </View>
            ) : materialsError ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={refetchMaterials}
                style={styles.selectorEmpty}
              >
                <Ionicons name="refresh-outline" size={22} color={palette.primary} />
                <Text style={styles.selectorEmptyText}>
                  {t("common.tap_to_retry")}
                </Text>
              </TouchableOpacity>
            ) : materials.length === 0 ? (
              <View style={styles.selectorEmpty}>
                <Ionicons name="apps-outline" size={22} color={palette.muted} />
                <Text style={styles.selectorEmptyText}>
                  {t("plan.empty_text")}
                </Text>
              </View>
            ) : (
              <View style={styles.matiereChipsWrap}>
                {materials.map((matiere) => {
                  const active = matiere.id === selectedMatiereId;

                  return (
                    <TouchableOpacity
                      key={matiere.id}
                      activeOpacity={0.85}
                      onPress={() => handleSelectMatiere(matiere.id)}
                      style={[
                        styles.matiereChip,
                        {
                          backgroundColor: active
                            ? `${palette.primary}18`
                            : palette.surface,
                          borderColor: active ? palette.primary : palette.border,
                        },
                      ]}
                    >
                      <Image
                        source={pickMaterialArtwork(matiere)}
                        style={styles.matiereChipImage}
                      />
                      <Text
                        style={[
                          styles.matiereChipText,
                          { color: active ? palette.primary : palette.text },
                        ]}
                      >
                        {getMaterialLabelFor(t, matiere)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {requiresTeacher(planType) && selectedMatiere != null ? (
            <ConditionalSelectionSection
              key={`teacher-${planType}-${selectedMatiereId}`}
            >
              <TeacherSelectorList
                teachers={teachersForMatiere}
                matiereLabel={matiereLabel}
                selectedIds={selectedTeacherIds}
                loading={false}
                onToggle={toggleTeacher}
                styles={styles}
                palette={palette}
              />
            </ConditionalSelectionSection>
          ) : null}

          {requiresBook(planType) && selectedMatiere != null ? (
            <ConditionalSelectionSection
              key={`book-${planType}-${selectedMatiereId}`}
            >
              <BookSelectorList
                books={booksForMatiere}
                matiereLabel={matiereLabel}
                selectedIds={selectedBookIds}
                loading={booksLoading}
                onToggle={toggleBook}
                styles={styles}
                palette={palette}
              />
            </ConditionalSelectionSection>
          ) : null}

          {visiblePlans.length === 0 ? (
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
                {t("plan.empty_title")}
              </Text>
              <Text style={[styles.emptyText, { color: palette.muted }]}>
                {t("plan.empty_text")}
              </Text>
            </View>
          ) : (
            visiblePlans.map(renderPlanCard)
          )}

          <View
            style={[
              styles.guaranteeWrap,
              { backgroundColor: `${palette.primary}12` },
            ]}
          >
            <Ionicons name="shield-checkmark" size={16} color={palette.primary} />
            <Text style={[styles.guaranteeText, { color: palette.text }]}>
              {t("plan.guarantee")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {selectedMatiere != null ? (
        <SelectionBubbleDock
          bubbles={dockBubbles}
          totalLabel={dockTotal}
          periodHint={dockHint}
          ctaLabel={t("plan.cta_label")}
          ctaEnabled={subscribeEnabled}
          helperText={
            subscribeEnabled ? undefined : t(SUBSCRIBE_HINT_KEYS[planType])
          }
          shakeTick={shakeTick}
          onSubscribe={handleSubscribe}
          isRTL={isRTL}
          bottomInset={insets.bottom}
          styles={styles}
          palette={palette}
        />
      ) : null}
    </View>
  );
}
