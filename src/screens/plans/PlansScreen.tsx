import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { PATHS } from "@config/constants/paths";
import { LocalStorageKeysEnum } from "@config/enums/localStorage.enum";
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
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@utils/localStorage/storage";
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
  PERIOD_LABEL_KEYS,
  PERIOD_MONTHS_MAP,
  PLANS_HEADER_GRADIENT,
} from "./PlansScreen.constants";
import { createPlansStyles, getPlansPalette } from "./PlansScreen.styles";
import type { PlanSelectionState, PlanType, SelectedPeriod } from "./PlansScreen.type";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PERIODS: SelectedPeriod[] = ["monthly", "quarterly", "yearly"];

const discountAmount = (price: number, discountPct: number): number =>
  discountPct > 0 ? Math.max(price - price * (discountPct / 100), 0) : price;

const SUBSCRIBE_HINT_KEYS: Record<PlanType, string> = {
  live:       "plan.subscribe_hint_live",
  books:      "plan.subscribe_hint_books",
  books_docs: "plan.subscribe_hint_bundle",
};

const PLAN_ICON_BY_NAME: Record<string, keyof typeof Ionicons.glyphMap> = {
  MenuBook:          "book-outline",
  Book:              "book-outline",
  MenuBookOutlined:  "book-outline",
  Videocam:          "videocam-outline",
  VideocamOutlined:  "videocam-outline",
  LiveTv:            "tv-outline",
  LiveTvOutlined:    "tv-outline",
  School:            "school-outline",
  SchoolOutlined:    "school-outline",
  VideoLibrary:      "play-circle-outline",
  VideoLibraryOutlined: "play-circle-outline",
  Star:              "star-outline",
  StarOutlined:      "star-outline",
  Rocket:            "rocket-outline",
  RocketLaunch:      "rocket-outline",
  AutoAwesome:       "sparkles-outline",
  AutoAwesomeOutlined: "sparkles-outline",
};

const resolvePlanIcon = (icon: string): keyof typeof Ionicons.glyphMap =>
  PLAN_ICON_BY_NAME[icon] ?? "pricetag-outline";

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
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(null);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [selectedPlanMaterialIds, setSelectedPlanMaterialIds] = useState<number[]>([]);
  const [shakeTick, setShakeTick] = useState(0);
  const [twoColByPlan, setTwoColByPlan] = useState<Record<number, boolean>>({});
  const [plansLayoutMode, setPlansLayoutMode] = useState<"grid" | "list">("grid");
  const materialsHydrated = useRef(false);
  const previousChildId = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    getFromLocalStorage<number[]>(
      LocalStorageKeysEnum.SelectedPlanMaterials,
      true
    )
      .then((stored) => {
        if (!active) return;
        if (Array.isArray(stored) && stored.length > 0) {
          setSelectedPlanMaterialIds(stored);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) materialsHydrated.current = true;
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!materialsHydrated.current) return;
    void setToLocalStorage(
      LocalStorageKeysEnum.SelectedPlanMaterials,
      selectedPlanMaterialIds,
      true
    );
  }, [selectedPlanMaterialIds]);

  const headerData = useActiveChildHeaderData();
  const levelId = useMemo(
    () => pickLevelIdFromChild(headerData?.child),
    [headerData?.child]
  );

  const activeChildId = useAppSelector(selectActiveChildId);
  const childAccessToken = useAppSelector((s) => s.auth.childAccessToken);
  const isChildReady = toValidId(activeChildId) > 0 && !!childAccessToken;

  useEffect(() => {
    const childId = toValidId(activeChildId);
    if (previousChildId.current === childId) return;

    const switchedChildren =
      previousChildId.current !== null && previousChildId.current !== childId;
    previousChildId.current = childId;
    if (!switchedChildren) return;

    materialsHydrated.current = true;
    setSelectedPlanMaterialIds([]);
    setSelectedMatiereId(null);
    setSelectedTeacherIds([]);
    setSelectedBookIds([]);
    void removeFromLocalStorage(LocalStorageKeysEnum.SelectedPlanMaterials);
  }, [activeChildId]);

  const {
    data: plans = [],
    isLoading,
    isError,
    refetch,
  } = useGetPlansForChildQuery(
    isChildReady && levelId
      ? { levelId: toValidId(levelId) }
      : undefined,
    { skip: !isChildReady || !toValidId(levelId) }
  );

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

  const togglePlanMaterial = useCallback((id: number) => {
    setSelectedPlanMaterialIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }, []);

  const togglePlanGridLayout = useCallback((planId: number) => {
    setTwoColByPlan((prev) => ({
      ...prev,
      [planId]: !(prev[planId] ?? true),
    }));
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
      case 10:
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

  const pricingWithMaterials = (plan: PlanUI): PlanPricingUI | undefined => {
    const selected = getPricingForPeriod(plan);
    if (selected && selected.materialPricings.length > 0) return selected;
    return (
      plan.pricings.find((p) => p.materialPricings.length > 0) ?? selected
    );
  };

  const activePlanType: PlanType = plans.some(
    (p) => pricingWithMaterials(p)?.pricingType === "per_material",
  )
    ? "books"
    : "live";

  const selectionState: PlanSelectionState = useMemo(
    () => ({
      planType: activePlanType,
      selectedMatiere: selectedMatiereId,
      selectedTeachers: selectedTeacherIds,
      selectedBooks: selectedBookIds,
      selectedPlanMaterialIds,
    }),
    [
      activePlanType,
      selectedMatiereId,
      selectedTeacherIds,
      selectedBookIds,
      selectedPlanMaterialIds,
    ]
  );
  const subscribeEnabled = isSubscribeEnabled(selectionState);

  const visiblePlans = useMemo(() => {
    if (plansLayoutMode === "grid") {
      return [...plans].sort((a, b) => a.features.length - b.features.length);
    }
    return plans;
  }, [plans, plansLayoutMode]);

  const basePricing = useMemo(() => {
    const plan = visiblePlans[0];
    if (!plan) return null;
    return getPricingForPeriod(plan);
  }, [visiblePlans, selectedPeriod]);

  const cartableMaterials = useMemo<PlanMaterialPriceUI[]>(() => {
    const plan = visiblePlans.find((p) => {
      const pricing = pricingWithMaterials(p);
      return pricing?.pricingType === "per_material";
    });
    if (!plan) return [];
    const pricing = pricingWithMaterials(plan);
    return pricing?.materialPricings ?? [];
  }, [visiblePlans, selectedPeriod]);

  const isCartableMaterial = cartableMaterials.length > 0;

  const periodDiscounts = useMemo<
    Partial<Record<SelectedPeriod, number>>
  >(() => {
    const plan = visiblePlans[0];
    const result: Partial<Record<SelectedPeriod, number>> = {};

    if (!plan) {
      return result;
    }

    for (const discount of plan.discounts) {
      const period = (Object.keys(PERIOD_MONTHS_MAP) as SelectedPeriod[]).find(
        (key) => PERIOD_MONTHS_MAP[key] === discount.durationMonths,
      );

      if (period && discount.value > 0) {
        result[period] = discount.value;
      }
    }

    return result;
  }, [visiblePlans]);

  const cartableTotal = useMemo(() => {
    const plan = visiblePlans.find((p) => {
      const pricing = pricingWithMaterials(p);
      return pricing?.pricingType === "per_material";
    });
    const sum = cartableMaterials
      .filter((item) => selectedPlanMaterialIds.includes(item.materialId))
      .reduce((total, item) => total + item.finalPrice, 0);
    const periodDiscount =
      plan?.discounts.find(
        (d) =>
          d.durationMonths === PERIOD_MONTHS_MAP[selectedPeriod] && d.value > 0,
      )?.value ?? 0;
    return discountAmount(sum, periodDiscount);
  }, [cartableMaterials, selectedPlanMaterialIds, visiblePlans, selectedPeriod]);

  const dockTotal =
    cartableMaterials.length > 0
      ? formatCurrency(cartableTotal)
      : basePricing
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
      source: teacher.avatar ?? null,
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

    const materialBubbles: SelectionBubble[] = cartableMaterials
      .filter((item) => selectedPlanMaterialIds.includes(item.materialId))
      .map((item) => ({
        id: `m-${item.materialId}`,
        kind: "material",
        label: getMaterialLabel(item.materialKey),
        source: null,
        fallback: getMaterialEmoji(item.materialKey),
        onRemove: () => togglePlanMaterial(item.materialId),
      }));

    return [...teacherBubbles, ...bookBubbles, ...materialBubbles];
  }, [
    selectedTeachers,
    selectedBooks,
    toggleTeacher,
    toggleBook,
    cartableMaterials,
    selectedPlanMaterialIds,
    togglePlanMaterial,
  ]);

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

    const cartablePlan = visiblePlans.find((p) => {
      const pricing = pricingWithMaterials(p);
      return pricing?.pricingType === "per_material";
    });
    const targetPlan = cartablePlan ?? visiblePlans[0];
    if (!targetPlan) return;

    const targetPricing = targetPlan
      ? pricingWithMaterials(targetPlan)
      : undefined;

    const targetPrice =
      cartablePlan && cartableTotal > 0
        ? cartableTotal
        : targetPricing?.finalPrice ?? 0;

    navigation.navigate(PATHS.APP.PLANS_CHECKOUT, {
      planId: targetPlan.id,
      planTitle: targetPlan.title,
      periodLabel: getPeriodLabel(selectedPeriod),
      price: targetPrice,
      currency: t("plan.currency", { defaultValue: "د.ت" }),
    });
  }, [subscribeEnabled, visiblePlans, selectedPeriod, cartableTotal]);

  const handleSubscribePlan = useCallback(
    (plan: PlanUI) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const materialPricing = pricingWithMaterials(plan);
      const isPerMaterial = materialPricing?.pricingType === "per_material";

      let price = materialPricing?.finalPrice ?? 0;
      if (isPerMaterial) {
        const sum =
          materialPricing?.materialPricings
            .filter((item) => selectedPlanMaterialIds.includes(item.materialId))
            .reduce((total, item) => total + item.finalPrice, 0) ?? 0;
        if (sum > 0) {
          const periodDiscount =
            plan.discounts.find(
              (d) =>
                d.durationMonths === PERIOD_MONTHS_MAP[selectedPeriod] &&
                d.value > 0,
            )?.value ?? 0;
          price = discountAmount(sum, periodDiscount);
        }
      }

      navigation.navigate(PATHS.APP.PLANS_CHECKOUT, {
        planId: plan.id,
        planTitle: plan.title,
        periodLabel: getPeriodLabel(selectedPeriod),
        price,
        currency: t("plan.currency", { defaultValue: "د.ت" }),
      });
    },
    [selectedPeriod, selectedPlanMaterialIds],
  );

  const renderFeature = (feature: PlanFeatureUI, compact?: boolean) => (
    <View
      key={feature.id}
      style={[
        styles.featureRow,
        compact && styles.featureRowCompact,
      ]}
    >
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
        <Text
          style={[
            styles.featureTitle,
            compact && styles.featureTitleCompact,
            { color: palette.text },
          ]}
        >
          {feature.title}
        </Text>

        {feature.description && feature.description !== feature.title ? (
          <Text
            style={[
              styles.featureDescription,
              compact && styles.featureDescriptionCompact,
              { color: palette.muted },
            ]}
            numberOfLines={compact ? 1 : undefined}
          >
            {feature.description}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const renderMaterialRow = (item: PlanMaterialPriceUI, tint: string) => (
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

        <Text style={[styles.materialFinalPrice, { color: tint }]}>
          {formatCurrency(item.finalPrice)}
        </Text>
      </View>
    </View>
  );

  const renderPricingHero = (
    pricing: PlanPricingUI,
    isPopular: boolean,
    planColor: string,
    overrideDiscount?: number,
    hideMaterialPricingRows?: boolean,
    computedTotal?: number,
    compact?: boolean,
  ) => {
    const isPerMaterial = pricing.pricingType === "per_material";
    const heroColor = planColor || (isPopular ? palette.gold : palette.primary);
    const appliedDiscount =
      overrideDiscount != null && overrideDiscount > 0
        ? overrideDiscount
        : pricing.discount;
    const heroPrice =
      isPerMaterial && computedTotal != null
        ? computedTotal
        : isPerMaterial
          ? pricing.startingFromPrice
          : discountAmount(pricing.price || pricing.finalPrice, appliedDiscount);
    const basePrice = isPerMaterial
      ? pricing.startingFromPrice
      : pricing.price || pricing.finalPrice;

    return (
      <View
        style={[
          styles.priceHero,
          compact && styles.priceHeroCompact,
          {
            backgroundColor: palette.heroBand,
            borderColor: heroColor
              ? `${heroColor}22`
              : isPerMaterial
                ? `${palette.primary}22`
                : "rgba(245,166,35,0.24)",
          },
        ]}
      >
        <View style={styles.priceHeroTop}>
          <Text
            style={[
              styles.priceHintLabel,
              compact && styles.priceHintLabelCompact,
              { color: palette.muted },
            ]}
          >
            {isPerMaterial && computedTotal != null
              ? t("plan.total_label")
              : isPerMaterial
                ? t("plan.starting_from")
                : getMonthsLabel(pricing.months)}
          </Text>

          {appliedDiscount > 0 ? (
            <View
              style={[styles.discountBadge, { backgroundColor: heroColor }]}
            >
              <Text style={styles.discountBadgeText}>
                −{formatPrice(appliedDiscount)}%
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.priceHeroBottom}>
          <View style={styles.priceValueRow}>
            <Text
              style={[
                styles.priceValue,
                compact && styles.priceValueCompact,
                { color: heroColor },
              ]}
            >
              {formatCurrency(heroPrice)}
            </Text>
            {!compact && (
              <Text
                style={[
                  styles.pricePerMonth,
                  compact && styles.pricePerMonthCompact,
                  { color: palette.muted },
                ]}
              >
                /{t("plan.per_month")}
              </Text>
            )}
          </View>

          {appliedDiscount > 0 &&
          basePrice > 0 &&
          computedTotal == null ? (
            <Text style={[styles.oldPrice, { color: palette.muted }]}>
              {formatCurrency(basePrice)}
            </Text>
          ) : null}
        </View>

        {isPerMaterial && pricing.materialPricings.length > 0 && !hideMaterialPricingRows ? (
          <>
            <View style={[styles.priceDivider, { backgroundColor: palette.border }]} />
            {pricing.materialPricings.map((item) =>
              renderMaterialRow(item, heroColor),
            )}
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

  const renderPlanCard = (plan: PlanUI, layout: "grid" | "list") => {
    const pricing = getPricingForPeriod(plan);
    const planPeriodDiscount =
      plan.discounts.find(
        (d) =>
          d.durationMonths === PERIOD_MONTHS_MAP[selectedPeriod] && d.value > 0,
      )?.value ?? 0;
    const cardColor = plan.color || (plan.isPopular ? palette.gold : palette.primary);

    const materialPricing = pricingWithMaterials(plan);
    const isPerMaterial = materialPricing?.pricingType === "per_material";

    const pricedMaterials =
        isPerMaterial && materialPricing
          ? materialPricing.materialPricings
          : [];

    const selectedMaterialSum =
      isPerMaterial && materialPricing
        ? materialPricing.materialPricings
            .filter((item) => selectedPlanMaterialIds.includes(item.materialId))
            .reduce((sum, item) => sum + item.finalPrice, 0)
        : 0;

    const perMaterialSelectedTotal =
      isPerMaterial && selectedMaterialSum > 0
        ? discountAmount(selectedMaterialSum, planPeriodDiscount)
        : undefined;

    const derivedMaterials = !pricedMaterials.length
      ? plan.accessibleEntities
          .filter((entity) => entity.materialId != null)
          .filter(
            (entity, index, arr) =>
              arr.findIndex((x) => x.materialId === entity.materialId) === index,
          )
      : [];

    const showMaterialGrid =
      pricedMaterials.length > 0 || derivedMaterials.length > 0;

    const isTwoCol = twoColByPlan[plan.id] ?? true;
    const isGrid = layout === "grid";
    const isCompact = isGrid && !isPerMaterial;

    return (
      <View
        key={plan.id}
        style={[
          styles.planCard,
          layout === "grid" && styles.planCardGrid,
          layout === "grid" && isPerMaterial && styles.planCardGridFull,
          {
            backgroundColor: palette.card,
            borderColor: plan.color ? `${plan.color}55` : palette.border,
            shadowColor: plan.color || palette.gold,
            shadowOpacity: plan.isPopular ? 0.4 : 0.18,
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

            {!!plan.displayTier ? (
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: plan.color
                      ? `${plan.color}1F`
                      : `${palette.primary}14`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeBadgeText,
                    { color: plan.color || palette.primary },
                  ]}
                >
                  {plan.displayTier}
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: `${palette.primary}14` },
                ]}
              >
                <Text
                  style={[styles.typeBadgeText, { color: palette.primary }]}
                >
                  {getPlanTypeLabel(plan.planType)}
                </Text>
              </View>
            )}
          </View>

          {!isCompact && (
            <View
              style={[
                styles.planIconBadge,
                {
                  backgroundColor: plan.color
                    ? `${plan.color}1F`
                    : `${palette.primary}14`,
                },
              ]}
            >
              <Ionicons
                name={resolvePlanIcon(plan.icon)}
                size={18}
                color={plan.color || palette.primary}
              />
            </View>
          )}
        </View>

        <Text
          style={[
            styles.planTitle,
            isCompact && styles.planTitleCompact,
            { color: palette.text },
          ]}
        >
          {plan.title}
        </Text>

        {!!plan.description && (
          <Text
            style={[
              styles.planDescription,
              isCompact && styles.planDescriptionCompact,
              { color: palette.muted },
            ]}
            numberOfLines={isCompact ? 1 : undefined}
          >
            {plan.description}
          </Text>
        )}

        {pricing
          ? renderPricingHero(
              pricing,
              plan.isPopular,
              plan.color,
              planPeriodDiscount,
              isPerMaterial,
              perMaterialSelectedTotal,
              isCompact,
            )
          : null}

        {showMaterialGrid ? (
          <View
            style={[
              styles.cardMaterialBlock,
              isCompact && styles.cardMaterialBlockCompact,
            ]}
          >
            <View
              style={[
                styles.cardMaterialBlockHeader,
                isCompact && styles.cardMaterialBlockHeaderCompact,
              ]}
            >
              <Text style={[styles.sectionLabel, { color: palette.text }]}>
                {t("plan.choose_subject")}
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => togglePlanGridLayout(plan.id)}
                style={[
                  styles.layoutToggleBtn,
                  isCompact && styles.layoutToggleBtnCompact,
                  { backgroundColor: `${palette.primary}12` },
                ]}
              >
                <Ionicons
                  name={isTwoCol ? "grid" : "list"}
                  size={14}
                  color={palette.primary}
                />
                <Text
                  style={[styles.layoutToggleLabel, { color: palette.primary }]}
                >
                  {isTwoCol ? t("plan.layout_2col") : t("plan.layout_1col")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardMaterialGrid}>
              {pricedMaterials.map((item) => {
                const checked = selectedPlanMaterialIds.includes(
                  item.materialId,
                );

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    onPress={() => togglePlanMaterial(item.materialId)}
                    style={[
                      styles.cardMaterialGridItem,
                      isCompact && styles.cardMaterialGridItemCompact,
                      !isTwoCol && styles.cardMaterialGridItemFull,
                      checked && styles.cardMaterialGridItemActive,
                      {
                        backgroundColor: checked
                          ? `${item.materialColor}1F`
                          : palette.surface,
                        borderColor: checked
                          ? item.materialColor
                          : palette.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.cardTileCheck,
                        {
                          borderColor: checked
                            ? item.materialColor
                            : palette.border,
                          backgroundColor: checked
                            ? item.materialColor
                            : "transparent",
                        },
                      ]}
                    >
                      {checked ? (
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.cardMaterialTileEmoji,
                        isCompact && styles.cardMaterialTileEmojiCompact,
                      ]}
                    >
                      {getMaterialEmoji(item.materialKey)}
                    </Text>
                    <Text
                      style={[
                        styles.cardMaterialLabel,
                        isCompact && styles.cardMaterialLabelCompact,
                        {
                          color: checked ? item.materialColor : palette.text,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {getMaterialLabel(item.materialKey)}
                    </Text>
                    <Text
                      style={[
                        styles.cardMaterialPrice,
                        isCompact && styles.cardMaterialPriceCompact,
                        {
                          color: checked
                            ? item.materialColor
                            : cardColor,
                        },
                      ]}
                    >
                      {formatCurrency(item.finalPrice)}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {derivedMaterials.map((entity) => {
                const id = entity.materialId as number;
                const checked = selectedPlanMaterialIds.includes(id);

                return (
                  <TouchableOpacity
                    key={`a-${id}`}
                    activeOpacity={0.85}
                    onPress={() => togglePlanMaterial(id)}
                    style={[
                      styles.cardMaterialGridItem,
                      isCompact && styles.cardMaterialGridItemCompact,
                      !isTwoCol && styles.cardMaterialGridItemFull,
                      checked && styles.cardMaterialGridItemActive,
                      {
                        backgroundColor: checked
                          ? `${entity.materialColor}1F`
                          : palette.surface,
                        borderColor: checked
                          ? entity.materialColor
                          : palette.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.cardTileCheck,
                        {
                          borderColor: checked
                            ? entity.materialColor
                            : palette.border,
                          backgroundColor: checked
                            ? entity.materialColor
                            : "transparent",
                        },
                      ]}
                    >
                      {checked ? (
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.cardMaterialTileEmoji,
                        isCompact && styles.cardMaterialTileEmojiCompact,
                      ]}
                    >
                      {getMaterialEmoji(entity.materialKey)}
                    </Text>
                    <Text
                      style={[
                        styles.cardMaterialLabel,
                        isCompact && styles.cardMaterialLabelCompact,
                        {
                          color: checked
                            ? entity.materialColor
                            : palette.text,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {getMaterialLabel(entity.materialKey)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}

        {!!plan.features.length && (
          <View
            style={[
              styles.featuresBlock,
              isCompact && styles.featuresBlockCompact,
            ]}
          >
            <Text style={[styles.sectionLabel, { color: palette.text }]}>
              {t("plan.features")}
            </Text>

            {plan.features.map((feature) => renderFeature(feature, isCompact))}
          </View>
        )}

        {!isCompact && !!plan.accessibleEntities.length && (
          <View style={styles.accessibleWrap}>
            <Text style={[styles.sectionLabel, { color: palette.text }]}>
              {t("plan.accessible_entities")}
            </Text>

            <View style={styles.accessibleChipsRow}>
              {plan.accessibleEntities.map(renderAccessibleChip)}
            </View>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleSubscribePlan(plan)}
          style={styles.cardSubscribeWrap}
        >
          <LinearGradient
            colors={[cardColor, cardColor ? `${cardColor}BB` : palette.goldStrong]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardSubscribeBtn}
          >
            <Ionicons name="sparkles" size={15} color="#FFFFFF" />
            <Text style={styles.cardSubscribeText}>
              {t("plan.cta_label")}
            </Text>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={15}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>
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

          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>{t("plan.screen_title")}</Text>

            <View style={[styles.viewLayoutToggle, styles.viewLayoutToggleHeader]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setPlansLayoutMode("list")}
                style={[
                  styles.viewLayoutOption,
                  plansLayoutMode === "list" && {
                    backgroundColor: "rgba(255,255,255,0.22)",
                  },
                ]}
              >
                <Ionicons
                  name="list"
                  size={16}
                  color={plansLayoutMode === "list" ? "#FFFFFF" : "rgba(255,255,255,0.50)"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setPlansLayoutMode("grid")}
                style={[
                  styles.viewLayoutOption,
                  plansLayoutMode === "grid" && {
                    backgroundColor: "rgba(255,255,255,0.22)",
                  },
                ]}
              >
                <Ionicons
                  name="grid"
                  size={16}
                  color={plansLayoutMode === "grid" ? "#FFFFFF" : "rgba(255,255,255,0.50)"}
                />
              </TouchableOpacity>
            </View>
          </View>

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
              const periodDiscount = periodDiscounts[period];
              const discount = periodDiscount ? `${periodDiscount}%` : null;

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

          {/* <View style={styles.builderCard}>
            {isCartableMaterial ? (
              <>
                <Text style={[styles.matiereTitle, { color: palette.text }]}>
                  {t("plan.choose_subject")}
                </Text>
                <View style={styles.matiereChipsWrap}>
                  {cartableMaterials.map((item) => {
                    const active = selectedPlanMaterialIds.includes(
                      item.materialId,
                    );

                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.85}
                        onPress={() => togglePlanMaterial(item.materialId)}
                        style={[
                          styles.matiereChip,
                          active && styles.matiereChipActive,
                          {
                            backgroundColor: active
                              ? `${item.materialColor}1F`
                              : palette.surface,
                            borderColor: active
                              ? item.materialColor
                              : palette.border,
                          },
                        ]}
                      >
                        <Text style={styles.matiereChipEmoji}>
                          {getMaterialEmoji(item.materialKey)}
                        </Text>
                        <Text
                          style={[
                            styles.matiereChipText,
                            {
                              color: active
                                ? item.materialColor
                                : palette.text,
                            },
                          ]}
                        >
                          {getMaterialLabel(item.materialKey)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <>
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
                    <Ionicons
                      name="refresh-outline"
                      size={22}
                      color={palette.primary}
                    />
                    <Text style={styles.selectorEmptyText}>
                      {t("common.tap_to_retry")}
                    </Text>
                  </TouchableOpacity>
                ) : materials.length === 0 ? (
                  <View style={styles.selectorEmpty}>
                    <Ionicons
                      name="apps-outline"
                      size={22}
                      color={palette.muted}
                    />
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
                            active && styles.matiereChipActive,
                            {
                              backgroundColor: active
                                ? `${matiere.accent}1F`
                                : palette.surface,
                              borderColor: active
                                ? matiere.accent
                                : palette.border,
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
                              {
                                color: active
                                  ? matiere.accent
                                  : palette.text,
                              },
                            ]}
                          >
                            {getMaterialLabelFor(t, matiere)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            )}
          </View> */}

          {requiresTeacher(activePlanType) && selectedMatiere != null ? (
            <ConditionalSelectionSection
              key={`teacher-${activePlanType}-${selectedMatiereId}`}
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

          {!isCartableMaterial &&
          requiresBook(activePlanType) &&
          selectedMatiere != null ? (
            <ConditionalSelectionSection
              key={`book-${activePlanType}-${selectedMatiereId}`}
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
            <View
              key={plansLayoutMode}
              style={
                plansLayoutMode === "grid"
                  ? styles.plansGrid
                  : styles.plansList
              }
            >
              {visiblePlans.map((plan) =>
                renderPlanCard(plan, plansLayoutMode),
              )}
            </View>
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

      {/* {selectedMatiere != null || isCartableMaterial ? (
        <SelectionBubbleDock
          bubbles={dockBubbles}
          totalLabel={dockTotal}
          periodHint={dockHint}
          ctaLabel={t("plan.cta_label")}
          ctaEnabled={subscribeEnabled}
          helperText={
            subscribeEnabled ? undefined : t(SUBSCRIBE_HINT_KEYS[activePlanType])
          }
          shakeTick={shakeTick}
          onSubscribe={handleSubscribe}
          isRTL={isRTL}
          bottomInset={insets.bottom}
          styles={styles}
          palette={palette}
        />
      ) : null} */}
    </View>
  );
}
