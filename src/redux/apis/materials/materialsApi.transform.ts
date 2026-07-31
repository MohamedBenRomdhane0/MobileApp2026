import { ConfigEnv } from "@config/configEnv";
import type { ApiLevelMaterialRow, ListMaterialsApiResponse, MaterialTranslation, MaterialUI } from "./materialsApi.type";

const FALLBACK_LOCALES = ["ar", "fr", "en"];

const normalizeLocale = (locale?: string): string =>
  (locale ?? "ar").split("-")[0].toLowerCase();

// Resolve the material name from the backend `translations` relation.
// Each row: { model_type: "App\\Models\\Material", locale, text } where `text`
// is the material name. Prefers the requested locale, then ar/fr/en.
function pickTranslatedName(
  translations: MaterialTranslation[] = [],
  locale: string
): string {
  const want = normalizeLocale(locale);

  const candidates = (Array.isArray(translations) ? translations : []).filter((tr) => {
    if (!tr || typeof tr.text !== "string" || !tr.text.trim()) return false;
    // Keep only Material translations when a model_type is present.
    if (tr.model_type && !/Material/i.test(String(tr.model_type))) return false;
    // When the translation targets a specific attribute, keep only "name".
    const attr = tr.key ?? tr.column ?? tr.field;
    if (attr && String(attr).toLowerCase() !== "name") return false;
    return true;
  });

  const exact = candidates.find((tr) => normalizeLocale(tr.locale) === want);
  if (exact) return exact.text.trim();

  for (const fb of [want, ...FALLBACK_LOCALES]) {
    const found = candidates.find((tr) => normalizeLocale(tr.locale) === fb);
    if (found) return found.text.trim();
  }

  return candidates[0]?.text?.trim() ?? "";
}

const S3_BASE = String((ConfigEnv as any)?.S3_BUCKET_URL ?? (ConfigEnv as any)?.S3_BUCKET_URL ?? "")
  .replace(/\/+$/, "");

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

function joinUrl(base: string, path: string) {
  const b = String(base ?? "").replace(/\/+$/, "");
  const p = String(path ?? "").replace(/^\/+/, "");
  if (!b || !p) return "";
  return `${b}/${p}`;
}

export function resolveUrlFromApiPath(path?: string | null): string | null {
  const raw = String(path ?? "").trim();
  if (!raw) return null;
  if (isHttpUrl(raw)) return raw;
  if (!S3_BASE) return null;
  return joinUrl(S3_BASE, raw);
}

export function extractArray<T = any>(payload: any): T[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

const MATERIAL_UI: Record<
  string,
  { name: string; bg: string; accent: string; icon?: string }
> = {
  math: { name: "رياضيات", bg: "#0B2A4F", accent: "#22BEC8", icon: "calculator-outline" },
  arabic: { name: "عربية", bg: "#4B0E1F", accent: "#F43F5E", icon: "book-outline" },
  french: { name: "Français", bg: "#D97706", accent: "#FDBA74", icon: "language-outline" },
  science: { name: "علوم", bg: "#14532D", accent: "#34D399", icon: "leaf-outline" },
  english: { name: "English", bg: "#1E3A8A", accent: "#60A5FA", icon: "chatbubble-ellipses-outline" },
};

function normalizeKey(s: string) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function fallbackMaterialUi(key: string) {
  return { name: key || "Material", bg: "#0B2A4F", accent: "#22BEC8", icon: "grid-outline" };
}

// The /levels/{id}/level-materials endpoint returns all name fields as null,
// but material_id is stable. Map the known ids to localized names so cards
// render a proper label without a backend change.
const MATERIAL_ID_MAP: Record<
  number,
  { ar: string; fr: string; en: string }
> = {
  1: { ar: "رياضيات", fr: "Mathématiques", en: "Math" },
  2: { ar: "عربية", fr: "Arabe", en: "Arabic" },
  3: { ar: "فرنسية", fr: "Français", en: "French" },
  4: { ar: "إيقاظ علمي", fr: "Éveil scientifique", en: "Science" },
  5: { ar: "إنجليزية", fr: "Anglais", en: "English" },
  6: { ar: "تربية إسلامية", fr: "Éducation islamique", en: "Islamic Education" },
  7: { ar: "تربية مدنية", fr: "Éducation civique", en: "Civic Education" },
  8: { ar: "تاريخ", fr: "Histoire", en: "History" },
  9: { ar: "جغرافيا", fr: "Géographie", en: "Geography" },
};

function pickLocalMaterialName(materialId: number, want: string): string {
  const entry = MATERIAL_ID_MAP[materialId];
  if (!entry) return "";
  if (want === "fr") return entry.fr;
  if (want === "en") return entry.en;
  return entry.ar;
}

export function toMaterialUI(row: ApiLevelMaterialRow, locale: string = "ar"): MaterialUI | null {
  const levelMaterialId = Number((row as any)?.level_material_id);
  const materialId = Number((row as any)?.material_id);
  const levelId = Number((row as any)?.level_id);

  if (!Number.isFinite(levelMaterialId) || levelMaterialId <= 0) return null;
  if (!Number.isFinite(materialId) || materialId <= 0) return null;

  const rawName = String((row as any)?.material_name ?? "").trim();
  const slug = String((row as any)?.material_slug ?? "").trim() || null;

  // 1) Prefer per-locale name columns when the backend fills them.
  const want = normalizeLocale(locale);
  const localizedColumn =
    (want === "fr" && String((row as any)?.material_name_fr ?? "").trim()) ||
    (want === "en" && String((row as any)?.material_name_en ?? "").trim()) ||
    String((row as any)?.material_name_ar ?? "").trim() ||
    String((row as any)?.material_name_fr ?? "").trim() ||
    String((row as any)?.material_name_en ?? "").trim() ||
    "";

  // 2) Otherwise fall back to the `translations` relation (if ever included).
  const translations: MaterialTranslation[] = [
    ...(Array.isArray((row as any)?.translations) ? (row as any).translations : []),
    ...(Array.isArray((row as any)?.material?.translations) ? (row as any).material.translations : []),
  ];
  const translatedName = localizedColumn || pickTranslatedName(translations, locale);

  // 3) Last resort: local material_id -> localized name map, because the
  // /level-materials endpoint currently returns all name fields as null.
  const fromMap = pickLocalMaterialName(materialId, want);

  const resolvedName = translatedName || rawName || fromMap;
  const key = normalizeKey(slug || resolvedName || fromMap);

  const localColor = String((row as any)?.material_color ?? "").trim();
  const ui = MATERIAL_UI[key] ?? fallbackMaterialUi(resolvedName || key);

  const iconUrl =
    resolveUrlFromApiPath((row as any)?.icon_url ?? null) ??
    resolveUrlFromApiPath((row as any)?.icon ?? null) ??
    null;

  return {
    id: materialId,
    levelMaterialId,
    levelId: Number.isFinite(levelId) ? levelId : 0,
    name: resolvedName || ui.name,
    slug,
    bg: localColor || ui.bg,
    accent: ui.accent,
    icon: ui.icon ?? null,
    iconUrl,
  };
}

export function transformMaterialsByLevel(raw: unknown, locale: string = "ar"): MaterialUI[] {
  const rows = extractArray<ApiLevelMaterialRow>(raw as ListMaterialsApiResponse);

  const mapped = rows
    .map((row) => toMaterialUI(row, locale))
    .filter(Boolean) as MaterialUI[];

  return mapped;
}