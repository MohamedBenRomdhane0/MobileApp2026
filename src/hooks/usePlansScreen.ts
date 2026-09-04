import { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useEnsureChildSession } from "@hooks/useEnsureChildSession";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import { getMaterialEmoji } from "@utils/helpers/materialIcon.helper";
import { getMaterialDisplayName } from "@utils/helpers/material.display.helper";
import { useGetPlansForChildQuery } from "@redux/apis/plans/plansApi";
import type { PlanMaterialPriceUI, PlanPricingUI, PlanUI } from "@redux/apis/plans/plansApi.type";

import { PERIOD_MONTHS_MAP, PLANS_UI } from "@screens/plans/PlansScreen.constants";
import { formatPrice } from "@utils/helpers/plans.helpers";
import { usePlanTeachers } from "./usePlanTeachers";
import type {
  PlanTab,
  SelectedMaterials,
  SelectedPeriod,
} from "@screens/plans/PlansScreen.type";

export interface BundleOption {
  key:           "bundle" | "courses" | "books";
  emoji:         string;
  label:         string;
  originalPrice: number;
  finalPrice:    number;
}

export interface MaterialFilterOption {
  key:   string;
  label: string;
  emoji: string;
}

export interface LiveHeadlinePrice {
  originalPrice: number;
  finalPrice:    number;
}


function toValidId(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function sumSelectedMaterials(
  materialPricings: PlanMaterialPriceUI[],
  selected: SelectedMaterials
): { original: number; final: number } {
  const active = materialPricings.filter((m) => selected[m.materialId]);
  if (active.length === 0) {
    const first = materialPricings[0];
    return first
      ? { original: first.price, final: first.finalPrice }
      : { original: 0, final: 0 };
  }
  return {
    original: active.reduce((s, m) => s + m.price, 0),
    final:    active.reduce((s, m) => s + m.finalPrice, 0),
  };
}

function getPricingForPeriod(
  plan: PlanUI | null,
  period: SelectedPeriod
): PlanPricingUI | null {
  if (!plan) return null;
  const months = PERIOD_MONTHS_MAP[period];
  return (
    plan.pricings.find((p) => p.months === months) ??
    plan.pricings[0] ??
    null
  );
}

export function usePlansScreen() {
  const { t }    = useTranslation();
  const { isChildReady } = useEnsureChildSession();
  const headerData       = useActiveChildHeaderData();

  const levelId = useMemo(
    () => toValidId(pickLevelIdFromChild(headerData?.child)),
    [headerData?.child]
  );

  const {
    data:      plans = [],
    isLoading,
    isError,
    refetch,
  } = useGetPlansForChildQuery({ levelId }, { skip: !levelId });

  const { teachers } = usePlanTeachers(!isChildReady);

  const [selectedPeriod,       setSelectedPeriod]       = useState<SelectedPeriod>("monthly");
  const [selectedTab,          setSelectedTab]          = useState<PlanTab>("live");
  const [selectedMaterials,    setSelectedMaterials]    = useState<SelectedMaterials>({});
  const [booksSelectedMats,    setBooksSelectedMats]    = useState<SelectedMaterials>({});
  const [selectedBundleOption, setSelectedBundleOption] = useState<BundleOption["key"]>("bundle");
  const [selectedTeacherId,    setSelectedTeacherId]    = useState<number | null>(null);
  const [teacherMaterialFilter, setTeacherMaterialFilter] = useState("all");

  const livePlan = useMemo(
    () => plans.find((p) => p.hasMeeting) ?? null,
    [plans]
  );

  const contentPlan = useMemo(
    () => plans.find((p) => !p.hasMeeting) ?? plans[0] ?? null,
    [plans]
  );

  const livePricing   = useMemo(() => getPricingForPeriod(livePlan,     selectedPeriod), [livePlan,     selectedPeriod]);
  const contentPricing = useMemo(() => getPricingForPeriod(contentPlan, selectedPeriod), [contentPlan, selectedPeriod]);

  const allMaterials = useMemo<PlanMaterialPriceUI[]>(
    () => (livePricing ?? contentPricing)?.materialPricings ?? [],
    [livePricing, contentPricing]
  );

  const liveHeadlinePrice = useMemo<LiveHeadlinePrice>(() => {
    if (!livePricing) return { originalPrice: 0, finalPrice: 0 };
    const { original, final } = sumSelectedMaterials(livePricing.materialPricings, selectedMaterials);
    return { originalPrice: original, finalPrice: final };
  }, [livePricing, selectedMaterials]);

  const booksOnlyPrice = useMemo(() => {
    if (!contentPricing) return 0;
    const { final } = sumSelectedMaterials(contentPricing.materialPricings, booksSelectedMats);
    return final;
  }, [contentPricing, booksSelectedMats]);

  const bundleOptions = useMemo<BundleOption[]>(() => {
    const bundleOriginal = (() => {
      if (!contentPricing) return 0;
      return contentPricing.materialPricings.reduce((s, m) => s + m.price, 0);
    })();

    const bundleFinal = (() => {
      if (!contentPricing) return 0;
      return contentPricing.materialPricings.reduce((s, m) => s + m.finalPrice, 0);
    })();

    const coursesFinal = Math.round(bundleFinal * 0.6 * 10) / 10;
    const booksFinal   = Math.round(bundleFinal * 0.4 * 10) / 10;

    const coursesOriginal = Math.round(bundleOriginal * 0.6 * 10) / 10;
    const booksOriginal   = Math.round(bundleOriginal * 0.4 * 10) / 10;

    return [
      {
        key:           "bundle",
        emoji:         "📚+🎬",
        label:         t(PLANS_UI.both),
        originalPrice: bundleOriginal,
        finalPrice:    bundleFinal,
      },
      {
        key:           "courses",
        emoji:         "🎬",
        label:         t(PLANS_UI.courses),
        originalPrice: coursesOriginal,
        finalPrice:    coursesFinal,
      },
      {
        key:           "books",
        emoji:         "📚",
        label:         t(PLANS_UI.booksOnly),
        originalPrice: booksOriginal,
        finalPrice:    booksFinal,
      },
    ];
  }, [contentPricing, t]);

  const booksBundlePrice = useMemo(() => {
    const opt = bundleOptions.find((o) => o.key === selectedBundleOption);
    return Math.round((opt?.finalPrice ?? 0) * 0.5 * 10) / 10;
  }, [bundleOptions, selectedBundleOption]);

  const selectedTeacher = useMemo(
    () => teachers.find((t) => t.id === selectedTeacherId) ?? null,
    [teachers, selectedTeacherId]
  );

  const liveTeacherPrice = selectedTeacher?.price ?? 0;

  const totalPrice = useMemo(() => {
    if (selectedTab === "live")   return liveTeacherPrice + booksBundlePrice;
    if (selectedTab === "bundle") return liveHeadlinePrice.finalPrice;
    return booksOnlyPrice;
  }, [selectedTab, liveTeacherPrice, booksBundlePrice, liveHeadlinePrice, booksOnlyPrice]);

  const ctaLabel = useMemo(
    () => `${t(PLANS_UI.ctaLabel)} — ${t(PLANS_UI.priceCurrency)} ${formatPrice(totalPrice)}/${t(PLANS_UI.perMonth)} →`,
    [t, totalPrice]
  );

  const periodLabels = useMemo<Record<SelectedPeriod, string>>(
    () => ({
      monthly:   t(PLANS_UI.periodMonthly),
      quarterly: t(PLANS_UI.periodQuarterly),
      yearly:    t(PLANS_UI.periodYearly),
    }),
    [t]
  );

  const materialFilterOptions = useMemo<MaterialFilterOption[]>(
    () => [
      { key: "all", label: t("common.all"), emoji: "" },
      ...allMaterials.map((m) => ({
        key:   String(m.materialId),
        label: getMaterialDisplayName(t, m.materialName),
        emoji: getMaterialEmoji(m.materialName),
      })),
    ],
    [allMaterials, t]
  );

  const filteredTeachers = useMemo(() => {
    if (teacherMaterialFilter === "all") return teachers;
    const opt = materialFilterOptions.find((o) => o.key === teacherMaterialFilter);
    if (!opt) return teachers;
    return teachers.filter(
      (teacher) =>
        teacher.subject.toLowerCase().includes(opt.label.toLowerCase()) ||
        opt.label.toLowerCase().includes(teacher.subject.toLowerCase())
    );
  }, [teachers, teacherMaterialFilter, materialFilterOptions]);

  const toggleMaterial = useCallback((id: number) => {
    setSelectedMaterials((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleBooksMaterial = useCallback((id: number) => {
    setBooksSelectedMats((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const onSelectTeacher = useCallback((teacherId: number) => {
    setSelectedTeacherId((prev) => (prev === teacherId ? null : teacherId));
  }, []);

  return {
    isLoading,
    isError,
    refetch,

    selectedPeriod,    setSelectedPeriod,
    selectedTab,       setSelectedTab,
    selectedMaterials,
    booksSelectedMats,
    selectedBundleOption, setSelectedBundleOption,
    selectedTeacher,
    teacherMaterialFilter, setTeacherMaterialFilter,
    liveHeadlinePrice,
    allMaterials,
    filteredTeachers,
    materialFilterOptions,
    bundleOptions,
    periodLabels,
    booksBundlePrice,
    booksOnlyPrice,
    totalPrice,
    ctaLabel,
    livePlan,
    contentPlan,

    toggleMaterial,
    toggleBooksMaterial,
    onSelectTeacher,
  };
}
