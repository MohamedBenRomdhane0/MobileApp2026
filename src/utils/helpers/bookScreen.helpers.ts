import type {
  BookLastLearningUI,
  BookListItemUI,
  BookModuleUI,
} from "@redux/apis/books/bookApi.type";
import { buildAvatarUri } from "@utils/helpers/mediaUrl.helper";
import type { BookLearningResume } from "@utils/helpers/bookLearningResume.helpers";
import type {
  BookCardResolvedProgress,
  BooksFileParams,
  ResumeMap,
  RichBookTeacher,
} from "@screens/books/BooksScreen.type";
import {
  MATERIAL_COLOR,
  MATERIAL_GRADIENT,
  MATERIAL_LABELS,
} from "@screens/books/BooksScreen.constants";

const AVATAR_BG_CYCLE = [
  "#14B8A6",
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
] as const;

export function getTeacherInitials(name: string): string {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export function isValidPositiveId(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function itemId(book: BookListItemUI): number {
  return isValidPositiveId(book.id) ? book.id : 0;
}

export function areResumeMapsEqual(prev: ResumeMap, next: ResumeMap): boolean {
  const pk = Object.keys(prev);
  const nk = Object.keys(next);
  if (pk.length !== nk.length) return false;

  for (const key of nk) {
    const p = prev[Number(key)];
    const n = next[Number(key)];

    if (!p && !n) continue;
    if (!p || !n) return false;

    if (
      p.bookId !== n.bookId ||
      p.iconId !== n.iconId ||
      p.videoId !== n.videoId ||
      p.pageNumber !== n.pageNumber ||
      p.materialName !== n.materialName ||
      p.lessonTitle !== n.lessonTitle ||
      p.updatedAt !== n.updatedAt ||
      p.lastWatchedTime !== n.lastWatchedTime ||
      p.lastWatchedRelative !== n.lastWatchedRelative
    ) {
      return false;
    }
  }

  return true;
}

export function resolveMaterialKey(materialName?: string | null): string {
  const lower = String(materialName ?? "").trim().toLowerCase();

  if (
    lower.includes("math") ||
    lower.includes("رياض") ||
    lower.includes("mathématique")
  ) {
    return "mat_math";
  }

  if (
    lower.includes("arab") ||
    lower.includes("عرب") ||
    lower.includes("lecture arabe")
  ) {
    return "mat_arabic";
  }

  if (
    lower.includes("french") ||
    lower.includes("français") ||
    lower.includes("فرن")
  ) {
    return "mat_french";
  }

  if (
    lower.includes("science") ||
    lower.includes("sciences") ||
    lower.includes("علوم") ||
    lower.includes("إيقاظ")
  ) {
    return "mat_science";
  }

  if (lower.includes("social") || lower.includes("اجتما")) {
    return "mat_social";
  }

  if (
    lower.includes("english") ||
    lower.includes("eng") ||
    lower.includes("إنجل")
  ) {
    return "mat_english";
  }

  return "default";
}

export function getGradient(
  key: string,
  apiColor?: string | null
): readonly [string, string] {
  const base = MATERIAL_GRADIENT[key] ?? MATERIAL_GRADIENT.default;
  const hex = String(apiColor ?? "").trim();
  if (hex) {
    return [base[0], hex];
  }
  return base;
}

export function getAccent(key: string, apiColor?: string | null): string {
  const hex = String(apiColor ?? "").trim();
  if (hex) {
    return hex;
  }
  return MATERIAL_COLOR[key] ?? MATERIAL_COLOR.default;
}

export function getLabel(key: string): { ar: string; fr: string } {
  return MATERIAL_LABELS[key] ?? MATERIAL_LABELS.default;
}

export function resolveTeacherAvatar(teacher: RichBookTeacher): string | null {
  return buildAvatarUri({
    avatarPath: teacher.avatarUrl ?? teacher.avatar_url ?? null,
    avatar: null,
    media: teacher.media ?? null,
  });
}

export function formatRating(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return n.toFixed(1);
}

function hasLocalRichResume(resume?: BookLearningResume | null): boolean {
  if (!resume) return false;

  const hasTitle = Boolean(
    String(resume.lessonTitle ?? "").trim() ||
      String(resume.materialName ?? "").trim()
  );

  const hasTime = Boolean(
    String(resume.lastWatchedTime ?? "").trim() ||
      String(resume.lastWatchedRelative ?? "").trim()
  );

  const hasTarget =
    isValidPositiveId(resume.iconId) ||
    isValidPositiveId(resume.videoId) ||
    (typeof resume.pageNumber === "number" && resume.pageNumber > 0);

  return hasTarget || (hasTime && hasTitle);
}

function formatSecondsToClock(totalSeconds?: number | null): string {
  const value = Number(totalSeconds ?? 0);
  if (!Number.isFinite(value) || value <= 0) return "";

  const safe = Math.max(0, Math.floor(value));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function resolveCurrentModule(
  modules?: BookModuleUI[] | null,
  pageNumber?: number | null
): BookModuleUI | null {
  if (!Array.isArray(modules) || modules.length === 0) {
    return null;
  }

  if (typeof pageNumber === "number" && pageNumber > 0) {
    const matched = modules.find(
      (module) =>
        module.startPage > 0 &&
        module.endPage > 0 &&
        pageNumber >= module.startPage &&
        pageNumber <= module.endPage
    );

    if (matched) return matched;
  }

  const firstUnfinished = modules.find(
    (module) => Number(module.progress ?? 0) < 100
  );
  if (firstUnfinished) return firstUnfinished;

  return modules[0] ?? null;
}

function buildBackendMetaLine(
  lastLearning?: BookLastLearningUI | null,
  modules?: BookModuleUI[] | null
): string {
  if (!lastLearning) return "";

  const currentModule =
    resolveCurrentModule(modules, lastLearning.pageNumber) ??
    (lastLearning.moduleId
      ? modules?.find((module) => module.id === lastLearning.moduleId) ?? null
      : null);

  const positionLabel = formatSecondsToClock(lastLearning.lastPositionSec);
  const watchedLabel = formatSecondsToClock(lastLearning.totalSeconds);

  return [
    currentModule?.title ?? lastLearning.moduleTitle ?? "",
    typeof lastLearning.pageNumber === "number" && lastLearning.pageNumber > 0
      ? `صفحة ${lastLearning.pageNumber}`
      : "",
    positionLabel,
    watchedLabel ? `مشاهدة ${watchedLabel}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function toTimestamp(value?: string | null): number {
  if (typeof value !== "string" || !value.trim()) return 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function getPreferredResumeSource(
  resume?: BookLearningResume | null,
  lastLearning?: BookLastLearningUI | null
): "local" | "backend" | "none" {
  const localHasTarget = Boolean(
    resume &&
      ((typeof resume.pageNumber === "number" && resume.pageNumber > 0) ||
        isValidPositiveId(resume.iconId) ||
        isValidPositiveId(resume.videoId))
  );

  const backendHasTarget = Boolean(
    lastLearning &&
      ((typeof lastLearning.pageNumber === "number" &&
        lastLearning.pageNumber > 0) ||
        isValidPositiveId(lastLearning.iconId) ||
        isValidPositiveId(lastLearning.videoId))
  );

  if (localHasTarget && backendHasTarget) {
    const localTs = toTimestamp(resume?.updatedAt);
    const backendTs = toTimestamp(lastLearning?.lastSyncedAt);
    return localTs >= backendTs ? "local" : "backend";
  }

  if (localHasTarget) return "local";
  if (backendHasTarget) return "backend";
  return "none";
}

export function resolveBookCardProgress(
  book: BookListItemUI,
  resumeMap: ResumeMap,
  fallbackTitle: string
): BookCardResolvedProgress {
  const bookId = itemId(book);
  const resume = bookId > 0 ? resumeMap[bookId] : null;
  const lastLearning = book.lastLearning ?? null;
  const modules = book.modules ?? [];

  const preferredSource = getPreferredResumeSource(resume, lastLearning);

  if (preferredSource === "local" && resume) {
    return {
      title:
        String(resume.lessonTitle ?? "").trim() ||
        String(resume.materialName ?? "").trim() ||
        resolveCurrentModule(modules, resume.pageNumber)?.title ||
        fallbackTitle,
      metaLine: [
        typeof resume.pageNumber === "number" && resume.pageNumber > 0
          ? `صفحة ${resume.pageNumber}`
          : "",
        String(resume.lastWatchedTime ?? "").trim(),
        String(resume.lastWatchedRelative ?? "").trim(),
      ]
        .filter(Boolean)
        .join(" · "),
      focusIconId: isValidPositiveId(resume.iconId) ? resume.iconId : undefined,
      focusVideoId: isValidPositiveId(resume.videoId)
        ? resume.videoId
        : undefined,
      openFromResume:
        isValidPositiveId(resume.iconId) ||
        isValidPositiveId(resume.videoId) ||
        (typeof resume.pageNumber === "number" && resume.pageNumber > 0),
      pageNumber:
        typeof resume.pageNumber === "number" && resume.pageNumber > 0
          ? resume.pageNumber
          : undefined,
      lessonTitle: resume.lessonTitle ?? null,
      moduleTitle: resolveCurrentModule(modules, resume.pageNumber)?.title ?? null,
    };
  }

  if (preferredSource === "backend" && lastLearning) {
    const currentModule =
      resolveCurrentModule(modules, lastLearning.pageNumber) ??
      (lastLearning.moduleId
        ? modules.find((module) => module.id === lastLearning.moduleId) ?? null
        : null);

    return {
      title:
        String(lastLearning.lessonTitle ?? "").trim() ||
        currentModule?.title ||
        String(resume?.lessonTitle ?? "").trim() ||
        String(resume?.materialName ?? "").trim() ||
        fallbackTitle,
      metaLine: buildBackendMetaLine(lastLearning, modules),
      focusIconId: isValidPositiveId(lastLearning.iconId)
        ? lastLearning.iconId
        : undefined,
      focusVideoId: isValidPositiveId(lastLearning.videoId)
        ? lastLearning.videoId
        : undefined,
      openFromResume:
        isValidPositiveId(lastLearning.iconId) ||
        isValidPositiveId(lastLearning.videoId) ||
        (typeof lastLearning.pageNumber === "number" &&
          lastLearning.pageNumber > 0),
      pageNumber:
        typeof lastLearning.pageNumber === "number" &&
        lastLearning.pageNumber > 0
          ? lastLearning.pageNumber
          : undefined,
      moduleTitle: currentModule?.title ?? lastLearning.moduleTitle ?? null,
      lessonTitle: lastLearning.lessonTitle ?? null,
      lastPositionSec: Number(lastLearning.lastPositionSec ?? 0),
      totalSeconds: Number(lastLearning.totalSeconds ?? 0),
      totalMinutes: Number(lastLearning.totalMinutes ?? 0),
      lastSyncedAt: lastLearning.lastSyncedAt ?? null,
    };
  }

  if (hasLocalRichResume(resume)) {
    return {
      title:
        String(resume?.lessonTitle ?? "").trim() ||
        String(resume?.materialName ?? "").trim() ||
        fallbackTitle,
      metaLine: [
        typeof resume?.pageNumber === "number" && resume.pageNumber > 0
          ? `صفحة ${resume.pageNumber}`
          : "",
        String(resume?.lastWatchedTime ?? "").trim(),
        String(resume?.lastWatchedRelative ?? "").trim(),
      ]
        .filter(Boolean)
        .join(" · "),
      focusIconId: isValidPositiveId(resume?.iconId) ? resume?.iconId : undefined,
      focusVideoId: isValidPositiveId(resume?.videoId)
        ? resume?.videoId
        : undefined,
      openFromResume:
        isValidPositiveId(resume?.iconId) ||
        isValidPositiveId(resume?.videoId) ||
        (typeof resume?.pageNumber === "number" && resume.pageNumber > 0),
      pageNumber:
        typeof resume?.pageNumber === "number" && resume.pageNumber > 0
          ? resume.pageNumber
          : undefined,
      lessonTitle: resume?.lessonTitle ?? null,
      moduleTitle: resolveCurrentModule(modules, resume?.pageNumber)?.title ?? null,
    };
  }

  const fallbackModule = resolveCurrentModule(modules, null);

  return {
    title: fallbackModule?.title ?? fallbackTitle,
    metaLine: fallbackModule?.title
      ? `الوحدة الحالية · ${fallbackModule.title}`
      : "",
    openFromResume: false,
    moduleTitle: fallbackModule?.title ?? null,
  };
}

export function shouldShowBookCardProgress(
  book: BookListItemUI,
  resumeMap: ResumeMap
): boolean {
  const bookId = itemId(book);
  const resume = bookId > 0 ? resumeMap[bookId] : null;

  if (book.lastLearning) return true;
  return hasLocalRichResume(resume);
}

export function buildBooksFileParams(
  book: BookListItemUI,
  resumeMap: ResumeMap
): BooksFileParams | null {
  const bookId = itemId(book);
  if (!isValidPositiveId(bookId)) return null;

  const resume = resumeMap[bookId];
  const lastLearning = book.lastLearning ?? null;
  const preferredSource = getPreferredResumeSource(resume, lastLearning);

  if (preferredSource === "local" && resume) {
    return {
      bookId,
      pageNumber:
        typeof resume.pageNumber === "number" && resume.pageNumber > 0
          ? resume.pageNumber
          : 1,
      focusIconId: isValidPositiveId(resume.iconId) ? resume.iconId : undefined,
      focusVideoId: isValidPositiveId(resume.videoId) ? resume.videoId : undefined,
      openFromResume:
        isValidPositiveId(resume.iconId) ||
        isValidPositiveId(resume.videoId) ||
        (typeof resume.pageNumber === "number" && resume.pageNumber > 0),
    };
  }

  if (preferredSource === "backend" && lastLearning) {
    return {
      bookId,
      pageNumber:
        typeof lastLearning.pageNumber === "number" && lastLearning.pageNumber > 0
          ? lastLearning.pageNumber
          : 1,
      focusIconId: isValidPositiveId(lastLearning.iconId)
        ? lastLearning.iconId
        : undefined,
      focusVideoId: isValidPositiveId(lastLearning.videoId)
        ? lastLearning.videoId
        : undefined,
      openFromResume:
        isValidPositiveId(lastLearning.iconId) ||
        isValidPositiveId(lastLearning.videoId) ||
        (typeof lastLearning.pageNumber === "number" &&
          lastLearning.pageNumber > 0),
    };
  }

  return {
    bookId,
    pageNumber: 1,
    openFromResume: false,
  };
}

export function getAvatarBg(index: number): string {
  return AVATAR_BG_CYCLE[index % AVATAR_BG_CYCLE.length];
}