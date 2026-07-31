import { I18nManager, type ImageSourcePropType } from "react-native";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";
import type { CourseListItemUI } from "@redux/apis/courses/coursesApi.type";

const COURSE_PLACEHOLDER = require("@assets/images/default_courses.png");

export function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function progressToPct(b: BookListItemUI): number {
  const pRaw = Number((b as any)?.progress ?? 0);
  if (!Number.isFinite(pRaw) || pRaw < 0) return 0;
  const p = pRaw > 1 ? clamp01(pRaw / 100) : clamp01(pRaw);
  return Math.round(p * 100);
}

export function toValidId(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function normalizeMaterialKey(rawName: string): string {
  const s = String(rawName ?? "").toLowerCase().trim();
  if (!s) return "";
  if (s.startsWith("mat_")) return s.slice(4);
  return s.replace(/\s+/g, "_");
}

export function pickCourseCoverUrl(course: CourseListItemUI): string | null {
  const direct = String((course as any)?.coverUrl ?? (course as any)?.cover_url ?? "").trim();
  if (direct) return direct;

  const media0 = (course as any)?.media?.[0];
  const fromMedia = String(media0?.file_path ?? media0?.filePath ?? media0?.url ?? "").trim();
  return fromMedia || null;
}

export function courseCoverSource(course: CourseListItemUI): ImageSourcePropType {
  const url = pickCourseCoverUrl(course);
  return url ? { uri: url } : COURSE_PLACEHOLDER;
}

export function getLastRowStartIndex(itemsLen: number, columns: number): number {
  const rem = itemsLen % columns;
  if (rem === 0) return -1;
  return itemsLen - rem;
}

export function chevronIconName() {
  return I18nManager.isRTL ? "chevron-back" : "chevron-forward";
}