import type { BookDetailsUI, BookIconUI, BookPageUI } from "@redux/apis/books/bookApi.type";
import type { NormalizedPage } from "@screens/books/bookFiles/BookScreenFile.type";

type BookFileRouteParams = {
  bookId?: unknown;
  id?: unknown;
};

export function toSafeNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function pickPageImage(page: BookPageUI): string | null {
  return page.pathLg || page.pathMd || page.pathThumb || null;
}

export function normalizePages(book: BookDetailsUI | null | undefined): NormalizedPage[] {
  const pages = book?.pages ?? [];
  const normalizedPages: NormalizedPage[] = [];

  for (const page of pages) {
    const imageUrl = pickPageImage(page);
    if (!imageUrl) {
      continue;
    }

    normalizedPages.push({
      id: page.id,
      pageNumber: toSafeNumber(page.pageNumber, 1),
      imageUrl,
      width: typeof page.width === "number" ? page.width : null,
      height: typeof page.height === "number" ? page.height : null,
    });
  }

  normalizedPages.sort((a, b) => a.pageNumber - b.pageNumber);

  return normalizedPages;
}

export function groupIconsByPage(
  icons: BookIconUI[] | null | undefined
): Map<number, BookIconUI[]> {
  const map = new Map<number, BookIconUI[]>();

  for (const icon of icons ?? []) {
    const iconType = String(icon.iconType ?? "").trim().toLowerCase();
    if (iconType === "link") {
      continue;
    }

    const pageNumber = toSafeNumber(icon.pageNumber, 1);
    const currentItems = map.get(pageNumber) ?? [];
    currentItems.push(icon);
    map.set(pageNumber, currentItems);
  }

  return map;
}

export function getBookIdFromRouteParams(params?: BookFileRouteParams): number {
  const rawValue = params?.bookId ?? params?.id ?? null;
  const bookId = Number(rawValue);

  return Number.isFinite(bookId) && bookId > 0 ? bookId : 0;
}

export function getBookTitle(title: string | null | undefined, fallback: string): string {
  const safeTitle = String(title ?? "").trim();
  return safeTitle || fallback;
}

export function isArabicBook(language: string | null | undefined): boolean {
  return String(language ?? "").trim().toLowerCase().startsWith("ar");
}

export function computeIconPx(params: {
  iconSize: number;
  pageLayoutWidth: number;
  pageOriginalWidth: number | null;
}): number {
  const { iconSize, pageLayoutWidth, pageOriginalWidth } = params;

  const size = Number(iconSize);
  const layoutWidth = Number(pageLayoutWidth);

  if (!Number.isFinite(size) || size <= 0) {
    return 24;
  }

  if (!Number.isFinite(layoutWidth) || layoutWidth <= 0) {
    return 24;
  }

  if (
    typeof pageOriginalWidth === "number" &&
    Number.isFinite(pageOriginalWidth) &&
    pageOriginalWidth > 0
  ) {
    const pixelValue = (size / pageOriginalWidth) * layoutWidth;
    return clamp(pixelValue, 12, layoutWidth * 0.25);
  }

  if (size > 0 && size <= 30) {
    const pixelValue = (size / 100) * layoutWidth;
    return clamp(pixelValue, 12, layoutWidth * 0.25);
  }

  return clamp(size, 12, layoutWidth * 0.25);
}