import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookLearningResume = {
  /** ID of the book */
  bookId: number;
  /** Last page number viewed */
  pageNumber?: number;
  /** ID of the icon (video button) the child last tapped */
  iconId?: number;
  /** ID of the video the child last watched */
  videoId?: number;

  /**
   * Old field kept for backward compatibility.
   * Can still be used as fallback text if lessonTitle is missing.
   */
  materialName?: string;

  /** Human-readable lesson / chapter title shown in the card */
  lessonTitle?: string;

  /** Raw ISO timestamp string of last update */
  updatedAt?: string;

  /** Preformatted time, e.g. "14:32" */
  lastWatchedTime?: string;

  /** Preformatted relative text, e.g. "منذ يومين" */
  lastWatchedRelative?: string;
};

export type SaveBookPageResumeParams = {
  bookId: number;
  pageNumber: number;
  iconId?: number | null;
  videoId?: number | null;

  /**
   * Old param kept for compatibility with current calls.
   * If lessonTitle is not provided, we fallback to materialName.
   */
  materialName?: string | null;

  /** Better display label for the resume block */
  lessonTitle?: string | null;

  /**
   * Optional custom timestamp source.
   * If omitted, new Date().toISOString() is used.
   */
  updatedAt?: string | null;
};

// ─── Storage key ─────────────────────────────────────────────────────────────

function resumeKey(bookId: number): string {
  return `book_resume:${bookId}`;
}

// ─── Internal date helpers ───────────────────────────────────────────────────

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatTimeHM(iso?: string): string | undefined {
  if (!isValidDate(iso)) return undefined;

  const date = new Date(iso);
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function formatRelativeAr(iso?: string, now = new Date()): string | undefined {
  if (!isValidDate(iso)) return undefined;

  const target = new Date(iso);
  const diffMs = Math.max(0, now.getTime() - target.getTime());

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "الآن";

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute));
    if (minutes === 1) return "منذ دقيقة";
    if (minutes === 2) return "منذ دقيقتين";
    if (minutes <= 10) return `منذ ${minutes} دقائق`;
    return `منذ ${minutes} دقيقة`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.floor(diffMs / hour));
    if (hours === 1) return "منذ ساعة";
    if (hours === 2) return "منذ ساعتين";
    if (hours <= 10) return `منذ ${hours} ساعات`;
    return `منذ ${hours} ساعة`;
  }

  const days = Math.max(1, Math.floor(diffMs / day));
  if (days === 1) return "منذ يوم";
  if (days === 2) return "منذ يومين";
  if (days <= 10) return `منذ ${days} أيام`;
  return `منذ ${days} يومًا`;
}

function normalizePositiveNumber(value: unknown): number | undefined {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
}

function normalizeText(value: unknown): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text || undefined;
}

function normalizeResume(input: BookLearningResume): BookLearningResume {
  const updatedAt = isValidDate(input.updatedAt) ? input.updatedAt : undefined;
  const materialName = normalizeText(input.materialName);
  const lessonTitle = normalizeText(input.lessonTitle) ?? materialName;

  return {
    bookId: input.bookId,
    pageNumber: normalizePositiveNumber(input.pageNumber),
    iconId: normalizePositiveNumber(input.iconId),
    videoId: normalizePositiveNumber(input.videoId),
    materialName,
    lessonTitle,
    updatedAt,
    lastWatchedTime:
      normalizeText(input.lastWatchedTime) ?? formatTimeHM(updatedAt),
    lastWatchedRelative:
      normalizeText(input.lastWatchedRelative) ?? formatRelativeAr(updatedAt),
  };
}

// ─── Save ─────────────────────────────────────────────────────────────────────

/**
 * Persist the child's current reading / watching position for a book.
 * Called by BookScreenFile when navigating away or opening a video.
 */
export async function saveBookPageResume(
  params: SaveBookPageResumeParams
): Promise<void> {
  const {
    bookId,
    pageNumber,
    iconId,
    videoId,
    materialName,
    lessonTitle,
    updatedAt,
  } = params;

  if (!bookId || bookId <= 0) return;

  try {
    const existing = await loadBookResume(bookId);
    const effectiveUpdatedAt =
      isValidDate(updatedAt) ? updatedAt : new Date().toISOString();

    const nextLessonTitle =
      normalizeText(lessonTitle) ??
      normalizeText(materialName) ??
      existing?.lessonTitle ??
      existing?.materialName;

    const normalizedPageNumber =
      typeof pageNumber === "number" && pageNumber > 0
        ? pageNumber
        : existing?.pageNumber;

    const updated: BookLearningResume = normalizeResume({
      ...existing,
      bookId,
      pageNumber: normalizedPageNumber,
      iconId:
        typeof iconId === "number" && iconId > 0
          ? iconId
          : existing?.iconId,
      videoId:
        typeof videoId === "number" && videoId > 0
          ? videoId
          : existing?.videoId,
      materialName:
        normalizeText(materialName) ?? existing?.materialName,
      lessonTitle: nextLessonTitle,
      updatedAt: effectiveUpdatedAt,
      lastWatchedTime: formatTimeHM(effectiveUpdatedAt),
      lastWatchedRelative: formatRelativeAr(effectiveUpdatedAt),
    });

    await AsyncStorage.setItem(resumeKey(bookId), JSON.stringify(updated));
  } catch {
    // Silent best-effort
  }
}

// ─── Optional utility for richer resume updates ──────────────────────────────

/**
 * Update only the lesson/title metadata for an existing book resume.
 * Useful after discovering the exact lesson title from a video or icon payload.
 */
export async function patchBookResumeDetails(params: {
  bookId: number;
  lessonTitle?: string | null;
  materialName?: string | null;
  iconId?: number | null;
  videoId?: number | null;
}): Promise<void> {
  const { bookId, lessonTitle, materialName, iconId, videoId } = params;

  if (!bookId || bookId <= 0) return;

  try {
    const existing = await loadBookResume(bookId);
    if (!existing) return;

    const effectiveUpdatedAt = new Date().toISOString();

    const updated = normalizeResume({
      ...existing,
      iconId:
        typeof iconId === "number" && iconId > 0 ? iconId : existing.iconId,
      videoId:
        typeof videoId === "number" && videoId > 0 ? videoId : existing.videoId,
      materialName:
        normalizeText(materialName) ?? existing.materialName,
      lessonTitle:
        normalizeText(lessonTitle) ??
        existing.lessonTitle ??
        existing.materialName,
      updatedAt: effectiveUpdatedAt,
      lastWatchedTime: formatTimeHM(effectiveUpdatedAt),
      lastWatchedRelative: formatRelativeAr(effectiveUpdatedAt),
    });

    await AsyncStorage.setItem(resumeKey(bookId), JSON.stringify(updated));
  } catch {
    // Silent
  }
}

// ─── Load single ─────────────────────────────────────────────────────────────

export async function loadBookResume(
  bookId: number
): Promise<BookLearningResume | null> {
  try {
    const raw = await AsyncStorage.getItem(resumeKey(bookId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as BookLearningResume;
    if (!parsed?.bookId || parsed.bookId <= 0) return null;

    return normalizeResume(parsed);
  } catch {
    return null;
  }
}

// ─── Load map for multiple books ─────────────────────────────────────────────

/**
 * Load resume data for all given bookIds in a single batch.
 * Used by BooksScreen to display "آخر موقف" on every card.
 */
export async function getBooksLearningResumeMap(
  bookIds: number[]
): Promise<Record<number, BookLearningResume>> {
  if (!bookIds.length) return {};

  try {
    const keys = bookIds.map(resumeKey);
    const pairs = await AsyncStorage.multiGet(keys);

    const result: Record<number, BookLearningResume> = {};

    for (const [, raw] of pairs) {
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw) as BookLearningResume;

        if (parsed?.bookId && parsed.bookId > 0) {
          result[parsed.bookId] = normalizeResume(parsed);
        }
      } catch {
        // Skip malformed entry
      }
    }

    return result;
  } catch {
    return {};
  }
}

// ─── Clear (for logout / child switch) ───────────────────────────────────────

export async function clearBookResume(bookId: number): Promise<void> {
  try {
    await AsyncStorage.removeItem(resumeKey(bookId));
  } catch {
    // Silent
  }
}

export async function clearAllBookResumes(bookIds: number[]): Promise<void> {
  if (!bookIds.length) return;

  try {
    await AsyncStorage.multiRemove(bookIds.map(resumeKey));
  } catch {
    // Silent
  }
}