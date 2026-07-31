import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  MATERIAL_UI_KEY_BY_CODE,
  MATERIAL_UI_KEY_BY_ID,
  type MaterialUiKey,
} from "@config/enums/material.enum";
import {
  MEETINGS_SUBJECT_THEME,
  MATERIAL_KEYWORDS_BY_CATEGORY,
} from "@screens/meetings/MeetingsScreen.constants";
import type {
  MeetingCategoryKey,
  MeetingResolvedSubject,
  SubjectThemeItem,
} from "@screens/meetings/MeetingsScreen.type";

const SUBJECT_ACCENT: Record<string, string> = {
  math:    "#22BEC8",
  arabic:  "#E8294C",
  french:  "#3A86D8",
  science: "#27AE60",
  social:  "#8B5CF6",
  english: "#F5A623",
};

const SUBJECT_GRADIENT: Record<string, readonly [string, string]> = {
  math:    ["#26C6DA", "#2E89D8"],
  arabic:  ["#E8294C", "#7A5AF8"],
  french:  ["#3A86D8", "#5B7CFA"],
  science: ["#27AE60", "#2E89D8"],
  social:  ["#8B5CF6", "#5B7CFA"],
  english: ["#F5A623", "#E8294C"],
};

function resolveKeyFromMaterialName(
  materialName?: string | null
): Exclude<MeetingCategoryKey, "all"> {
  const normalized = String(materialName ?? "").toLowerCase().trim();
  for (const [key, keywords] of Object.entries(MATERIAL_KEYWORDS_BY_CATEGORY)) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return key as Exclude<MeetingCategoryKey, "all">;
    }
  }
  return "math";
}

function resolveKeyFromMaterialId(
  materialId?: number | string | null
): MaterialUiKey | null {
  const id = Number(materialId);
  if (Number.isFinite(id) && id > 0 && MATERIAL_UI_KEY_BY_ID[id]) {
    return MATERIAL_UI_KEY_BY_ID[id];
  }
  return null;
}

function resolveKeyFromCode(code?: string | null): MaterialUiKey | null {
  const normalized = String(code ?? "").trim().toLowerCase();
  return MATERIAL_UI_KEY_BY_CODE[normalized] ?? null;
}

export type ResolvedSubject = {
  key: Exclude<MeetingCategoryKey, "all">;
  labelKey: string;
  accent: string;
  gradient: readonly [string, string];
  theme: SubjectThemeItem;
  localizedName: string;
};

type UseMeetingSubjectInput = {
  materialName?: string | null;
  materialId?: number | string | null;
  materialCode?: string | null;
};

export function useMeetingSubject(input: UseMeetingSubjectInput): ResolvedSubject {
  const { t } = useTranslation();

  return useMemo(() => {
    const key: Exclude<MeetingCategoryKey, "all"> =
      resolveKeyFromMaterialId(input.materialId) ??
      resolveKeyFromCode(input.materialCode) ??
      resolveKeyFromMaterialName(input.materialName);

    const labelKey = `meetings.subject_${key}`;
    const accent   = SUBJECT_ACCENT[key]   ?? "#22BEC8";
    const gradient = SUBJECT_GRADIENT[key] ?? (["#26C6DA", "#2E89D8"] as const);
    const theme    = MEETINGS_SUBJECT_THEME[key] ?? MEETINGS_SUBJECT_THEME.math;

    const localizedName =
      t(labelKey) ||
      String(input.materialName ?? "").trim() ||
      t("meetings.detail_default_subject");

    return { key, labelKey, accent, gradient, theme, localizedName };
  }, [input.materialId, input.materialCode, input.materialName, t]);
}

export function useMeetingSubjectFromName(
  materialName?: string | null
): ResolvedSubject {
  return useMeetingSubject({ materialName });
}
