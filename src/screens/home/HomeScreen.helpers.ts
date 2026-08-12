import type { DimensionValue, ImageSourcePropType } from "react-native";

import type { BookListItemUI } from "@redux/apis/books/bookApi.type";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import { getMaterialDisplayName } from "@utils/helpers/material.display.helper";
import { MATERIAL_ICONS, pickMaterialFallbackIcon } from "@utils/helpers/materialIcon.helper";

import type { HomeResume } from "./HomeScreen.type";

type Translate = (key: string, options?: Record<string, unknown>) => string;

/** Coerce an unknown id into a usable positive integer (0 = unusable). */
export function toValidId(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Localized material label. Falls back to the raw server name so a missing
 * translation never renders an empty card.
 */
export function getMaterialLabel(t: Translate, material: MaterialUI): string {
  const fallback = String(material?.name ?? "").trim();
  if (!fallback) return "—";

  const translated = getMaterialDisplayName(t, fallback).trim();
  return translated || fallback;
}

/** Clamp an API progress value (0–100) to a whole percentage. */
export function formatProgress(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(100, Math.round(n));
}

/** Subject keywords that have dedicated 3D artwork shipped with the app. */
const ARTWORK_KEYWORDS = [
  "math", "رياض", "calcul",
  "arab", "عرب",
  "fr", "فرن",
  "scien", "علوم", "svt", "phys", "bio", "chim",
  "eng", "anglais", "انجل",
];

/**
 * Card artwork for a subject: the shipped 3D icon when the subject is
 * recognizable, otherwise the server icon, otherwise a neutral book.
 */
export function pickMaterialArtwork(material: MaterialUI): ImageSourcePropType {
  const key = String(material?.slug || material?.name || "").toLowerCase();
  const hasArtwork = ARTWORK_KEYWORDS.some((k) => key.includes(k));

  if (hasArtwork) return pickMaterialFallbackIcon(material);
  if (material?.iconUrl) return { uri: material.iconUrl };

  return MATERIAL_ICONS.math;
}

/** Percentage as a style width, e.g. 42 → "42%". */
export function percentWidth(value: number): DimensionValue {
  return `${formatProgress(value)}%` as DimensionValue;
}

/**
 * Pick the book the child should resume: the one with the freshest
 * `lastLearning` timestamp, else the furthest-along book. Returns null when
 * nothing has been started yet, so the Continue block stays hidden.
 */
export function pickResumeBook(books: BookListItemUI[], t: Translate): HomeResume | null {
  if (!Array.isArray(books) || books.length === 0) return null;

  const started = books.filter(
    (b) => b?.lastLearning != null || formatProgress(b?.progress) > 0
  );
  if (started.length === 0) return null;

  const syncedAt = (b: BookListItemUI): number => {
    const raw = b?.lastLearning?.lastSyncedAt;
    if (!raw) return 0;
    const ms = Date.parse(raw);
    return Number.isFinite(ms) ? ms : 0;
  };

  const best = started.reduce((acc, b) => {
    const bySync = syncedAt(b) - syncedAt(acc);
    if (bySync !== 0) return bySync > 0 ? b : acc;
    return formatProgress(b?.progress) > formatProgress(acc?.progress) ? b : acc;
  }, started[0]);

  const lessonTitle =
    String(best.lastLearning?.lessonTitle ?? "").trim() ||
    String(best.lastLearning?.moduleTitle ?? "").trim() ||
    String(best.materialName ?? "").trim() ||
    t("common.unnamed");

  return {
    book: best,
    lessonTitle,
    progress: formatProgress(best?.progress),
  };
}
