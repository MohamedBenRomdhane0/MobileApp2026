import type { BookDetailsUI, IconVideoUI } from "@redux/apis/books/bookApi.type";
import { buildAvatarUri } from "@utils/helpers/media.helpers";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null
    ? (value as UnknownRecord)
    : null;
}

export function toValidId(value: unknown): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
}

export function toNonNegativeNumber(value: unknown, fallback = 0): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0
    ? numericValue
    : fallback;
}

export function toBoolean(value: unknown, fallback = false): boolean {
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

  return fallback;
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    const result = Math.round((value / 1_000_000) * 10) / 10;
    return `${result}M`;
  }

  if (value >= 1_000) {
    const result = Math.round((value / 1_000) * 10) / 10;
    return `${result}K`;
  }

  return String(value);
}

export function formatMillis(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function humanizeLabel(value: unknown): string {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) {
    return "";
  }

  const normalizedValue = rawValue
    .replace(/^mat_/i, "")
    .replace(/_/g, " ")
    .trim();

  if (!normalizedValue) {
    return rawValue;
  }

  return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
}

export function pickViews(
  video: Pick<IconVideoUI, "viewsCount"> | null | undefined
): number {
  return toNonNegativeNumber(video?.viewsCount, 0);
}

export function pickLikesCount(
  video: Pick<IconVideoUI, "likesCount"> | null | undefined
): number {
  return toNonNegativeNumber(video?.likesCount, 0);
}

export function pickIsLiked(
  video: Pick<IconVideoUI, "isLiked"> | null | undefined
): boolean {
  return Boolean(video?.isLiked);
}

export function pickTeacherIdFromVideo(
  video: Pick<IconVideoUI, "creatorId"> | null | undefined
): number {
  return toValidId(video?.creatorId);
}

export function pickTeacherId(
  video: IconVideoUI | null,
  book: BookDetailsUI | null
): number {
  return (
    pickTeacherIdFromVideo(video) ||
    toValidId(book?.user?.id) ||
    toValidId(book?.creatorId)
  );
}

export function pickTeacherNameFromVideo(
  video: Pick<IconVideoUI, "teacherName"> | null | undefined
): string {
  return String(video?.teacherName ?? "").trim();
}

export function pickVideoUri(
  video: Pick<IconVideoUI, "url"> | null | undefined
): string {
  return String(video?.url ?? "").trim();
}

export function pickTitle(
  video: Pick<IconVideoUI, "title"> | null | undefined
): string {
  return String(video?.title ?? "").trim();
}

export function pickThumbUri(
  video: Pick<IconVideoUI, "thumbUrl"> | null | undefined
): string | null {
  const rawValue = String(video?.thumbUrl ?? "").trim();
  return rawValue || null;
}

export function pickDurationMillis(
  video: Pick<IconVideoUI, "durationMillis"> | null | undefined
): number {
  return toNonNegativeNumber(video?.durationMillis, 0);
}

export function pickTeacherFullName(teacher: unknown): string {
  const record = asRecord(teacher);
  if (!record) {
    return "";
  }

  const rawValue =
    record["fullName"] ??
    record["full_name"] ??
    record["name"] ??
    "";

  return typeof rawValue === "string" ? rawValue.trim() : "";
}

export function pickTeacherAvatarUrl(teacher: unknown): string | null {
  const record = asRecord(teacher);
  if (!record) {
    return null;
  }

  return buildAvatarUri({
    avatarPath:
      (record["avatarUrl"] as string | null | undefined) ??
      (record["avatar_url"] as string | null | undefined) ??
      null,
    avatar: (record["avatar"] as string | null | undefined) ?? null,
  });
}

export function pickTeacherRating(teacher: unknown): number {
  const record = asRecord(teacher);
  if (!record) {
    return 0;
  }

  return toNonNegativeNumber(
    record["rating"] ??
      record["avg_rating"] ??
      record["average_rating"],
    0
  );
}

export function pickTeacherFollowersCount(teacher: unknown): number {
  const record = asRecord(teacher);
  const stats = asRecord(record?.["stats"]);

  return toNonNegativeNumber(
    record?.["followersCount"] ??
      record?.["followers_count"] ??
      stats?.["followers"],
    0
  );
}

export function pickTeacherIsFollowed(teacher: unknown): boolean {
  const record = asRecord(teacher);

  return toBoolean(
    record?.["isFollowed"] ?? record?.["is_followed"],
    false
  );
}