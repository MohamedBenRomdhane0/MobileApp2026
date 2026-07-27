import { ConfigEnv } from "@config/configEnv";
import type { ApiLevelMaterialRow, ListMaterialsApiResponse, MaterialUI } from "./materialsApi.type";

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

export function toMaterialUI(row: ApiLevelMaterialRow): MaterialUI | null {
  const levelMaterialId = Number((row as any)?.level_material_id);
  const materialId = Number((row as any)?.material_id);
  const levelId = Number((row as any)?.level_id);

  if (!Number.isFinite(levelMaterialId) || levelMaterialId <= 0) return null;
  if (!Number.isFinite(materialId) || materialId <= 0) return null;

  const rawName = String((row as any)?.material_name ?? "").trim();
  const slug = String((row as any)?.material_slug ?? "").trim() || null;

  const key = normalizeKey(slug || rawName);

  const ui = MATERIAL_UI[key] ?? fallbackMaterialUi(rawName || key);

  const iconUrl =
    resolveUrlFromApiPath((row as any)?.icon_url ?? null) ??
    resolveUrlFromApiPath((row as any)?.icon ?? null) ??
    null;

  return {
    id: materialId,
    levelMaterialId,
    levelId: Number.isFinite(levelId) ? levelId : 0,
    name: rawName || ui.name,
    slug,
    bg: ui.bg,
    accent: ui.accent,
    icon: ui.icon ?? null,
    iconUrl,
  };
}

export function transformMaterialsByLevel(raw: unknown): MaterialUI[] {
  const rows = extractArray<ApiLevelMaterialRow>(raw as ListMaterialsApiResponse);

  const mapped = rows.map(toMaterialUI).filter(Boolean) as MaterialUI[];

  return mapped;
}