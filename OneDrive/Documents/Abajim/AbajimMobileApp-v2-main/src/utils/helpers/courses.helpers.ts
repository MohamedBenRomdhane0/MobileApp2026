import type { CourseListItemUI } from "@redux/apis/courses/coursesApi.type";

export function toValidId(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function normalizeMaterialKey(raw: string): string | null {
  const s = String(raw ?? "").trim().toLowerCase();
  if (!s) return null;
  if (s.startsWith("mat_")) return s.slice(4).replace(/\s+/g, "_");
  if (/^[a-z0-9_ -]+$/i.test(s)) return s.replace(/\s+/g, "_");
  return null;
}

export function getCourseMaterialLabel(
  t: (k: string, opt?: any) => string,
  course: CourseListItemUI
): string | null {
  const raw = String(course.materialName ?? "").trim();
  if (!raw) return null;

  const key = normalizeMaterialKey(raw);
  if (!key) return raw;

  return t(`material.${key}`, { defaultValue: raw });
}