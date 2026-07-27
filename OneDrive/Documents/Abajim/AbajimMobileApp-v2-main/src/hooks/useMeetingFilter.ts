import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  MATERIAL_UI_KEY_BY_CODE,
  MATERIAL_UI_KEY_BY_ID,
} from "@config/enums/material.enum";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import { MATERIAL_KEYWORDS_BY_CATEGORY } from "@screens/meetings/MeetingsScreen.constants";
import type {
  MeetingCategoryKey,
  MeetingsScreenMeetingItem,
} from "@screens/meetings/MeetingsScreen.type";

const ICONS = {
  arabic:  require("@assets/images/mat_arabic.png"),
  frensh:  require("@assets/images/mat_frensh.png"),
  math:    require("@assets/images/mat_math.png"),
  science: require("@assets/images/mat_science.png"),
  wake:    require("@assets/images/math_english.png"),
};

export type MaterialFilterItem = {
  id: number;
  name: string;
  label: string;
  iconUrl?: string | null;
  fallbackIcon: any;
  normalizedKey: string;
};

export type ActiveMaterialFilter = {
  id: number;
  normalizedKey: string;
  label: string;
} | null;

function normalizeText(v?: string | null): string {
  return String(v ?? "").toLowerCase().trim();
}

function toValidId(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function pickFallbackIcon(m: MaterialUI): any {
  const k = String(m.slug || m.name || "").toLowerCase();
  if (k.includes("math")  || k.includes("رياض"))  return ICONS.math;
  if (k.includes("arab")  || k.includes("عرب"))   return ICONS.arabic;
  if (k.includes("fr")    || k.includes("فرن"))   return ICONS.frensh;
  if (k.includes("scien") || k.includes("علوم"))  return ICONS.science;
  if (k.includes("eng")   || k.includes("anglais") || k.includes("انجل")) return ICONS.wake;
  return ICONS.math;
}

function normalizeMaterialKey(m: MaterialUI): string | null {
  const raw = String((m as any)?.slug ?? (m as any)?.code ?? m?.name ?? "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.startsWith("mat_")) return lower.slice(4);
  if (/^[a-z0-9_ -]+$/i.test(lower)) return lower.replace(/\s+/g, "_");
  return null;
}

function getMaterialLabel(
  t: (k: string, o?: Record<string, unknown>) => string,
  m: MaterialUI
): string {
  const fallback = String(m?.name ?? "").trim();
  const key = normalizeMaterialKey(m);
  if (!key) return fallback;
  return t(`material.${key}`, { defaultValue: fallback });
}

function meetingMatchesMaterial(
  item: MeetingsScreenMeetingItem,
  active: ActiveMaterialFilter
): boolean {
  if (!active) return true;
  const itemId = toValidId((item as any)?.materialId);
  if (itemId && itemId === active.id) return true;
  const n = normalizeText(item.materialName);
  const f = normalizeText(active.normalizedKey);
  const l = normalizeText(active.label);
  if (!n) return false;
  return n.includes(f) || f.includes(n) || n.includes(l) || l.includes(n);
}

function filterMeetings(
  items: MeetingsScreenMeetingItem[],
  active: ActiveMaterialFilter,
  search: string
): MeetingsScreenMeetingItem[] {
  const s = normalizeText(search);
  return items.filter((item) => {
    if (!meetingMatchesMaterial(item, active)) return false;
    if (!s) return true;
    return normalizeText(
      [item.name, item.teacherName, item.materialName, item.levelName].join(" ")
    ).includes(s);
  });
}

export type UseMeetingsFilterReturn = {
  searchValue:          string;
  setSearchValue:       (v: string) => void;
  activeMaterialId:     number;
  setActiveMaterialId:  (id: number) => void;
  activeMaterial:       ActiveMaterialFilter;
  materialFilters:      MaterialFilterItem[];
  filteredMeetings:     MeetingsScreenMeetingItem[];
  featuredMeetings:     MeetingsScreenMeetingItem[];
};

export function useMeetingsFilter(
  meetings: MeetingsScreenMeetingItem[],
  materials: MaterialUI[]
): UseMeetingsFilterReturn {
  const { t } = useTranslation();
  const [searchValue,      setSearchValue]      = useState("");
  const [activeMaterialId, setActiveMaterialId] = useState<number>(0);

  const materialFilters = useMemo<MaterialFilterItem[]>(() => {
    return materials
      .map((m) => {
        const id = toValidId(m.id);
        if (!id) return null;
        return {
          id,
          name:          String(m.name ?? "").trim(),
          label:         getMaterialLabel(t, m),
          iconUrl:       m.iconUrl,
          fallbackIcon:  pickFallbackIcon(m),
          normalizedKey: normalizeMaterialKey(m) ?? normalizeText(m.name) ?? String(id),
        };
      })
      .filter(Boolean) as MaterialFilterItem[];
  }, [materials, t]);

  const activeMaterial = useMemo<ActiveMaterialFilter>(() => {
    if (!activeMaterialId) return null;
    const found = materialFilters.find((m) => m.id === activeMaterialId);
    if (!found) return null;
    return { id: found.id, normalizedKey: found.normalizedKey, label: found.label };
  }, [activeMaterialId, materialFilters]);

  const filteredMeetings = useMemo(
    () => filterMeetings(meetings, activeMaterial, searchValue),
    [meetings, activeMaterial, searchValue]
  );

  const featuredMeetings = useMemo(
    () => filteredMeetings.slice(0, 6),
    [filteredMeetings]
  );

  return {
    searchValue,
    setSearchValue,
    activeMaterialId,
    setActiveMaterialId,
    activeMaterial,
    materialFilters,
    filteredMeetings,
    featuredMeetings,
  };
}
