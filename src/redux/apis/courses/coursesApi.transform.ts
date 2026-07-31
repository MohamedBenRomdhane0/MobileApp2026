import type {
  ApiCourse,
  ApiChapter,
  ApiListResponse,
  ApiPagination,
  ApiShowResponse,
  CourseDetailsUI,
  CourseListItemUI,
  CourseTeacherUI,
} from "./coursesApi.type";
import { buildMediaUrl } from "@utils/helpers/mediaUrl.helper";

function toNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function extractArray<T = any>(payload: any): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload?.data)) return payload.data as T[];
  if (Array.isArray(payload?.data?.data)) return payload.data.data as T[];
  return [];
}

function extractPagination(payload: any): ApiPagination | undefined {
  const p = payload?.pagination ?? payload?.meta ?? payload?.data?.meta ?? payload?.data?.pagination;
  if (!p || typeof p !== "object") return undefined;
  return {
    current_page: toNum(p.current_page) || undefined,
    per_page: toNum(p.per_page) || undefined,
    total: toNum(p.total) || undefined,
  };
}

export function pickCourseCoverUrl(course?: Partial<ApiCourse> | null): string | null {
  const m = (course as any)?.media?.[0];
  const direct = String(m?.full_url ?? m?.url ?? "").trim();
  if (direct) return buildMediaUrl(direct);

  const fp = String(m?.file_path ?? "").trim();
  if (fp) return buildMediaUrl(fp);

  return null;
}

function toTeacherUI(course: ApiCourse): CourseTeacherUI | null {
  const t = (course as any)?.teacher ?? (course as any)?.user ?? null;
  const id = toNum(t?.id);
  if (!id) return null;

  const fullName = String(t?.full_name ?? "").trim() || "—";
  const avatarPath = String(t?.avatar ?? "").trim();
  const avatarUrl = avatarPath ? buildMediaUrl(avatarPath) : null;

  return { id, fullName, avatarUrl };
}

function normalizeVideoUrl(u?: string | null): string | null {
  const s = String(u ?? "").trim();
  if (!s) return null;
  return buildMediaUrl(s);
}

function chapterToUI(ch: ApiChapter) {
  const id = toNum(ch?.id);
  const title = String(ch?.title ?? "").trim() || "—";
  const description = String(ch?.description ?? "").trim() || null;
  const order = toNum(ch?.order) || 0;

  const mediaVideos =
    Array.isArray(ch?.media) ? ch!.media!.filter((m) => String(m?.mime_type ?? "").includes("video/")) : [];

  const urlsFromMedia = mediaVideos
    .map((m) => normalizeVideoUrl(String(m?.full_url ?? m?.url ?? m?.file_path ?? "")))
    .filter(Boolean) as string[];

  const files = Array.isArray((ch as any)?.files) ? (ch as any).files : [];
  const urlsFromFiles = files
    .filter((f: any) => String(f?.file_type ?? f?.type ?? "").toLowerCase() === "video")
    .map((f: any) => normalizeVideoUrl(f?.file ?? f?.url ?? f?.path))
    .filter(Boolean) as string[];

  const videoUrls = [...urlsFromMedia, ...urlsFromFiles];

  return { id, title, description, order, videoUrls };
}

export function courseToListItemUI(course: ApiCourse): CourseListItemUI {
  const id = toNum(course?.id);
  const title = String(course?.title ?? "").trim() || "—";
  const description = String(course?.description ?? "").trim() || null;

  const coverUrl = pickCourseCoverUrl(course);
  const teacher = toTeacherUI(course);
  const materialName = String((course as any)?.material?.name ?? "").trim() || null;

  const isFavorite = Boolean((course as any)?.is_favorite);

  return { id, title, description, coverUrl, teacher, materialName, isFavorite };
}

export function transformCoursesList(raw: unknown): { items: CourseListItemUI[]; pagination?: ApiPagination } {
  const rows = extractArray<ApiCourse>(raw as ApiListResponse<ApiCourse>);
  const items = rows.map(courseToListItemUI);
  const pagination = extractPagination(raw);
  return { items, pagination };
}

export function transformCourseDetails(raw: unknown): CourseDetailsUI | null {
  const payload = raw as ApiShowResponse<ApiCourse>;

  const c = (payload?.data as any) ?? (raw as any)?.data?.data ?? (raw as any)?.data ?? null;
  if (!c || typeof c !== "object") return null;

  const base = courseToListItemUI(c as ApiCourse);

  const chaptersRaw = Array.isArray((c as any)?.chapters) ? ((c as any).chapters as ApiChapter[]) : [];
  const chapters = chaptersRaw
    .map(chapterToUI)
    .filter((x) => x.id > 0)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return { ...base, chapters };
}
export type ApiCoursesByMaterialGroup = {
  material?: { id?: number; name?: string | null } | null;
  courses?: ApiCourse[] | null;
  total?: number | null;
};

function extractByMaterialGroups(payload: any): ApiCoursesByMaterialGroup[] {
  const d = payload?.data ?? payload?.data?.data ?? payload;
  if (Array.isArray(d)) return d as ApiCoursesByMaterialGroup[];
  if (Array.isArray(d?.data)) return d.data as ApiCoursesByMaterialGroup[];
  return [];
}

export function transformCoursesByMaterial(raw: unknown): {
  groups: { material: { id: number; name: string | null }; courses: CourseListItemUI[]; total: number }[];
} {
  const groupsRaw = extractByMaterialGroups(raw as any);

  const groups = groupsRaw.map((g) => {
    const materialId = toNum(g?.material?.id);
    const materialName = String(g?.material?.name ?? "").trim() || null;

    const coursesRaw = Array.isArray(g?.courses) ? g.courses : [];
    const courses = coursesRaw.map(courseToListItemUI);

    const total = toNum(g?.total);

    return {
      material: { id: materialId, name: materialName },
      courses,
      total,
    };
  });

  return { groups };
}