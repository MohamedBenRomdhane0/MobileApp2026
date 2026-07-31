import { ConfigEnv } from "@config/configEnv";
import type {
  BookDetailsApi,
  BookDetailsUI,
  BookIconApi,
  BookIconUI,
  BookLastLearningApi,
  BookLastLearningUI,
  BookListItemApi,
  BookListItemUI,
  BookModuleApi,
  BookModuleUI,
  BookPageUI,
  BookTeacherApi,
  BookTeacherUI,
  IconVideoApi,
  IconVideoUI,
  LevelMaterialApi,
  MaterialApi,
  MediaApi,
} from "./bookApi.type";

type EnvConfig = {
  S3_BUCKET_URL?: string | null;
};

type MaterialNameSource = {
  material?: MaterialApi;
  material_name?: string;
  level_material?: LevelMaterialApi;
};

const env = ConfigEnv as EnvConfig;
const S3_BASE = String(env.S3_BUCKET_URL ?? "").replace(/\/+$/, "");

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function joinUrl(base: string, path: string): string {
  const normalizedBase = String(base ?? "").replace(/\/+$/, "");
  const normalizedPath = String(path ?? "").replace(/^\/+/, "");

  if (!normalizedBase || !normalizedPath) {
    return "";
  }

  return `${normalizedBase}/${normalizedPath}`;
}

export function resolveUrlFromApiPath(path?: string | null): string | null {
  const rawPath = String(path ?? "").trim();

  if (!rawPath) {
    return null;
  }

  if (isHttpUrl(rawPath)) {
    return rawPath;
  }

  if (!S3_BASE) {
    return null;
  }

  return joinUrl(S3_BASE, rawPath);
}

function looksLikeFile(path: string): boolean {
  return /\.[a-z0-9]{2,8}($|\?)/i.test(path);
}

function joinFilePath(
  filePath?: string | null,
  fileName?: string | null
): string | null {
  const normalizedPath = String(filePath ?? "").trim();
  const normalizedName = String(fileName ?? "").trim();

  if (normalizedPath && normalizedName) {
    return `${normalizedPath.replace(/\/+$/, "")}/${normalizedName.replace(/^\/+/, "")}`;
  }

  return normalizedPath || normalizedName || null;
}

function resolveUrlFromMedia(media?: MediaApi | null): string | null {
  if (!media) {
    return null;
  }

  const filePath = String(media.file_path ?? "").trim();
  const fileName = String(media.file_name ?? "").trim();

  const candidatePath =
    (filePath && looksLikeFile(filePath)
      ? filePath
      : joinFilePath(filePath || null, fileName || null)) ||
    String(media.thumbnail ?? "").trim() ||
    "";

  return resolveUrlFromApiPath(candidatePath || null);
}

function pickCoverUrl(media?: MediaApi[]): string | null {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const coverMedia =
    media.find((item) => String(item.tag ?? "").toLowerCase() === "book_cover") ??
    media.find((item) =>
      String(item.mime_type ?? "").toLowerCase().startsWith("image/")
    ) ??
    media[0];

  return resolveUrlFromMedia(coverMedia);
}

function pickPdfUrl(media?: MediaApi[]): string | null {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const pdfMedia =
    media.find((item) => String(item.tag ?? "").toLowerCase() === "book_pdf") ??
    media.find(
      (item) =>
        String(item.mime_type ?? "").toLowerCase() === "application/pdf"
    ) ??
    null;

  if (!pdfMedia) {
    return null;
  }

  const filePath = String(pdfMedia.file_path ?? "").trim();
  const fileName = String(pdfMedia.file_name ?? "").trim();

  const resolvedPath =
    filePath && looksLikeFile(filePath)
      ? filePath
      : joinFilePath(filePath || null, fileName || null);

  return resolveUrlFromApiPath(resolvedPath);
}

function resolveMaterialName(source: MaterialNameSource): string {
  return (
    source.material?.name ??
    source.material_name ??
    source.level_material?.material?.name ??
    ""
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizePercent(rawValue: unknown): number {
  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  if (numericValue >= 0 && numericValue <= 1.0001) {
    return clamp(numericValue * 100, 0, 100);
  }

  if (numericValue > 1 && numericValue <= 2) {
    return clamp((numericValue - 1) * 100, 0, 100);
  }

  return clamp(numericValue, 0, 100);
}

function parsePageNumber(value: unknown, indexFallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  const stringValue = String(value ?? "").trim();
  if (!stringValue) {
    return indexFallback;
  }

  const matches = stringValue.match(/(\d{1,4})/g);
  if (matches?.length) {
    const lastMatch = Number(matches[matches.length - 1]);
    if (Number.isFinite(lastMatch) && lastMatch > 0) {
      return lastMatch;
    }
  }

  return indexFallback;
}

function toSafeString(value: unknown, fallback = ""): string {
  const stringValue = String(value ?? "").trim();
  return stringValue || fallback;
}

function toSafeNumber(value: unknown, fallback = 0): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function toNullableString(value: unknown): string | null {
  const stringValue = String(value ?? "").trim();
  return stringValue || null;
}

function toValidId(value: unknown): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
}

function pickNonEmpty(...values: Array<unknown>): string | null {
  for (const value of values) {
    const stringValue = typeof value === "string" ? value.trim() : "";
    if (stringValue) {
      return stringValue;
    }
  }

  return null;
}

function pickCount(...values: Array<unknown>): number {
  for (const value of values) {
    const numericValue = Number(value);
    if (Number.isFinite(numericValue) && numericValue >= 0) {
      return numericValue;
    }
  }

  return 0;
}

function pickBool(...values: Array<unknown>): boolean {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value !== 0;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();

      if (
        normalizedValue === "true" ||
        normalizedValue === "1" ||
        normalizedValue === "yes"
      ) {
        return true;
      }

      if (
        normalizedValue === "false" ||
        normalizedValue === "0" ||
        normalizedValue === "no"
      ) {
        return false;
      }
    }
  }

  return false;
}

function toDurationMillis(...values: Array<unknown>): number {
  for (const value of values) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      continue;
    }

    return numericValue >= 1000
      ? Math.round(numericValue)
      : Math.round(numericValue * 1000);
  }

  return 0;
}

function isVideoLike(api: IconVideoApi): boolean {
  const mimeType = String(
    api.mime_type ?? api.media_type ?? api.metadata?.mime_type ?? ""
  )
    .trim()
    .toLowerCase();

  if (mimeType.startsWith("video/")) {
    return true;
  }

  const candidateUrl = String(
    api.stream_url ??
      api.streamUrl ??
      api.file_path ??
      api.url ??
      api.metadata?.stream_url ??
      api.metadata?.streamUrl ??
      api.metadata?.url ??
      ""
  )
    .trim()
    .toLowerCase();

  return (
    candidateUrl.endsWith(".mp4") ||
    candidateUrl.includes(".mp4?") ||
    candidateUrl.endsWith(".m3u8") ||
    candidateUrl.includes(".m3u8?") ||
    candidateUrl.endsWith(".mov") ||
    candidateUrl.includes(".mov?") ||
    candidateUrl.endsWith(".webm") ||
    candidateUrl.includes(".webm?")
  );
}

function toBookIconUI(api: BookIconApi, index: number): BookIconUI {
  const pageNumber = parsePageNumber(api.page ?? api.page_number, index + 1);

  return {
    id: toSafeNumber(api.id, 0),
    pageNumber,
    xPercent: normalizePercent(api.x),
    yPercent: normalizePercent(api.y),
    size: Number.isFinite(Number(api.size)) ? Number(api.size) : 24,
    iconType: toSafeString(api.icon_type, "video"),
  };
}

function toBookModuleUI(api: BookModuleApi): BookModuleUI {
  return {
    id: toSafeNumber(api.id, 0),
    bookId: toSafeNumber(api.book_id, 0),
    title: toNullableString(api.title),
    startPage: toSafeNumber(api.start_page, 0),
    endPage: toSafeNumber(api.end_page, 0),
    order: toSafeNumber(api.order, 0),
    iconsTotal: toSafeNumber(api.icons_total, 0),
    iconsFilled: toSafeNumber(api.icons_filled, 0),
    progress: toSafeNumber(api.progress, 0),
  };
}

function toBookLastLearningUI(
  api?: BookLastLearningApi | null
): BookLastLearningUI | null {
  if (!api) {
    return null;
  }

  return {
    videoId: toSafeNumber(api.video_id, 0),
    iconId: toSafeNumber(api.icon_id, 0),
    moduleId:
      api.module_id == null ? null : toSafeNumber(api.module_id, 0),
    moduleTitle: toNullableString(api.module_title),
    lessonTitle: toNullableString(api.lesson_title),
    pageNumber:
      api.page_number == null ? null : toSafeNumber(api.page_number, 0),
    lastPositionSec: toSafeNumber(api.last_position_sec, 0),
    totalSeconds: toSafeNumber(api.total_seconds, 0),
    totalMinutes: toSafeNumber(api.total_minutes, 0),
    lastSyncedAt: toNullableString(api.last_synced_at),
  };
}

export function toBookTeacherUI(api: BookTeacherApi): BookTeacherUI {
  return {
    id: toSafeNumber(api.id, 0),
    fullName: toSafeString(api.full_name ?? api.fullName ?? ""),
    avatarUrl: resolveUrlFromApiPath(
      api.avatar_url ?? api.avatarUrl ?? api.avatar ?? null
    ),
  };
}

export function toBookListItemUI(api: BookListItemApi): BookListItemUI {
  const teachers = Array.isArray(api.teachers)
    ? api.teachers.map(toBookTeacherUI)
    : [];

  const modules = Array.isArray(api.modules)
    ? api.modules.map(toBookModuleUI)
    : [];

  return {
    id: toSafeNumber(api.id, 0),
    title: toSafeString(api.title),
    pagesTotal: toSafeNumber(api.pages_total, 0),
    videosCount: toSafeNumber(api.videos_count, 0),
    progress: toSafeNumber(api.progress, 0),
    materialName: resolveMaterialName(api),
    coverUrl: pickCoverUrl(api.media),
    teachersCount: toSafeNumber(api.teachers_count, teachers.length),
    teachers,
    modules,
    lastLearning: toBookLastLearningUI(api.last_learning),
  };
}

export function toBookDetailsUI(api: BookDetailsApi): BookDetailsUI {
  const pages: BookPageUI[] = Array.isArray(api.pages)
    ? api.pages.map((page) => ({
        id: toSafeNumber(page.id, 0),
        pageNumber: toSafeNumber(page.page_number, 0),
        pathThumb: resolveUrlFromApiPath(page.path_thumb ?? null),
        pathMd: resolveUrlFromApiPath(page.path_md ?? null),
        pathLg: resolveUrlFromApiPath(page.path_lg ?? null),
        width: typeof page.width === "number" ? page.width : null,
        height: typeof page.height === "number" ? page.height : null,
      }))
    : [];

  const icons: BookIconUI[] = Array.isArray(api.icons)
    ? api.icons.map((icon, index) => toBookIconUI(icon, index))
    : [];

  const userId = toSafeNumber(api.user?.id, 0);
  const userFullName = toSafeString(api.user?.full_name ?? api.user?.name ?? "");

  return {
    id: toSafeNumber(api.id, 0),
    title: toSafeString(api.title),
    pagesTotal: toSafeNumber(api.pages_total, 0),
    materialName: resolveMaterialName(api),
    coverUrl: pickCoverUrl(api.media),
    pdfUrl: pickPdfUrl(api.media),
    language: typeof api.language === "string" ? api.language : null,
    pages,
    icons,
    creatorId:
      api.creator_id != null ? toSafeNumber(api.creator_id, 0) : null,
    user:
      userId > 0 || userFullName
        ? {
            id: userId,
            fullName: userFullName,
          }
        : null,
  };
}

export function toIconVideoUI(api: IconVideoApi): IconVideoUI {
  const metadata = api.metadata ?? null;

  const url =
    resolveUrlFromApiPath(
      api.stream_url ??
        api.streamUrl ??
        api.file_path ??
        api.url ??
        api.source_url ??
        api.sourceUrl ??
        metadata?.stream_url ??
        metadata?.streamUrl ??
        metadata?.url ??
        metadata?.source_url ??
        metadata?.sourceUrl ??
        metadata?.external_url ??
        metadata?.externalUrl ??
        null
    ) ?? "";

  const durationMillis = toDurationMillis(
    api.durationMillis,
    api.duration_ms,
    api.duration,
    metadata?.durationMillis,
    metadata?.duration_ms,
    metadata?.duration
  );

  const thumbRaw = pickNonEmpty(
    api.thumbnail_url,
    api.thumbnailUrl,
    api.thumbnail,
    api.poster_url,
    api.posterUrl,
    api.poster,
    api.cover_url,
    api.coverUrl,
    api.cover,
    api.thumb_url,
    api.thumbUrl,
    api.thumb,
    metadata?.thumbnail_url,
    metadata?.thumbnailUrl,
    metadata?.thumbnail,
    metadata?.poster_url,
    metadata?.posterUrl,
    metadata?.poster,
    metadata?.cover_url,
    metadata?.coverUrl,
    metadata?.cover
  );

  const thumbUrl = resolveUrlFromApiPath(thumbRaw);

  const creatorId = toValidId(
    api.creator_id ?? api.teacher?.id ?? api.creator?.id ?? api.user?.id
  );

  const teacherName = pickNonEmpty(
    api.teacher_name,
    api.teacher?.full_name,
    api.teacher?.name,
    api.creator?.full_name,
    api.creator?.name,
    api.user?.full_name,
    api.user?.name
  );

  const viewsCount = pickCount(
    api.views,
    api.views_count,
    api.view_count,
    metadata?.views
  );

  const likesCount = pickCount(api.likes_count, api.like_count, api.likes);

  const isLiked = pickBool(
    api.is_liked,
    api.isLiked,
    api.likes_exists,
    api.likesExists
  );

  return {
    id: toSafeNumber(api.id, 0),
    url,
    thumbUrl,
    mimeType: toNullableString(api.mime_type),
    tag: toNullableString(api.tag),
    title: toNullableString(api.title),
    description: toNullableString(api.description),
    creatorId,
    teacherName,
    viewsCount,
    likesCount,
    isLiked,
    isVideo: isVideoLike(api),
    durationMillis,
  };
}