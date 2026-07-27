import type { MeetingsScreenMeetingItem } from "@screens/meetings/MeetingsScreen.type";
import type { TrailerTeacherItem } from "@screens/trailers/TrailersScreen.type";

type UnknownRecord = Record<string, unknown>;

export function toValidId(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function pickString(obj: UnknownRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export function pickAvatarUrl(obj: UnknownRecord): string | null {
  return pickString(obj, [
    "teacherAvatarUrl",
    "teacher_avatar_url",
    "avatarUrl",
    "avatar_url",
    "avatar",
  ]);
}

export function pickTrailerUrl(obj: UnknownRecord): string | null {
  return pickString(obj, [
    "trailerUrl",
    "trailer_url",
    "teacherTrailerUrl",
    "teacher_trailer_url",
  ]);
}

export function pickTrailerThumbnail(obj: UnknownRecord): string | null {
  return pickString(obj, [
    "trailerThumbnail",
    "trailer_thumbnail",
    "teacherTrailerThumbnail",
  ]);
}

export function pickNextBadge(obj: UnknownRecord): string | null {
  const scheduleLines = obj.scheduleLines as string[] | null | undefined;
  if (Array.isArray(scheduleLines) && scheduleLines[0]) {
    return String(scheduleLines[0]).trim().slice(0, 10);
  }

  const nextSessionAt = obj.nextSessionAt as string | null | undefined;
  if (typeof nextSessionAt === "string" && nextSessionAt.trim()) {
    return nextSessionAt.trim().slice(0, 10);
  }

  return null;
}

export function pickViewerCount(obj: UnknownRecord): number | null {
  const raw = Number(
    obj.viewerCount ??
      obj.viewer_count ??
      obj.upcomingSessionsCount ??
      obj.upcoming_sessions_count ??
      null
  );

  return Number.isFinite(raw) && raw > 0 ? raw : null;
}

export function pickScheduleText(obj: UnknownRecord): string {
  const scheduleLines = obj.scheduleLines as string[] | null | undefined;
  if (Array.isArray(scheduleLines) && scheduleLines.length > 0) {
    return scheduleLines.slice(0, 2).join(" · ");
  }

  const days = obj.days as string | null | undefined;
  if (typeof days === "string" && days.trim()) {
    return days.trim();
  }

  return "";
}

export function getTeacherInitial(name: string): string {
  const clean = String(name ?? "").trim();
  if (!clean) return "؟";

  const words = clean.split(/\s+/).filter(Boolean);
  const lastWord = words[words.length - 1];

  return lastWord?.charAt(0) || clean.charAt(0) || "؟";
}

export function getTrailerBadgeColor(item: TrailerTeacherItem): string {
  if (item.viewerCount) return "#EF4444";

  const next = String(item.nextBadge ?? "").toLowerCase();
  if (next.includes("اليوم") || next.includes("today")) return "#27AE60";
  if (next.includes("غدا") || next.includes("غداً") || next.includes("demain")) {
    return "#F5A623";
  }

  return "#22BEC8";
}

export function buildTrailerItems(
  meetings: MeetingsScreenMeetingItem[]
): TrailerTeacherItem[] {
  const seenMeetingIds = new Set<number>();
  const items: TrailerTeacherItem[] = [];

  for (const meeting of meetings) {
    const obj = meeting as unknown as UnknownRecord;

    const meetingId = toValidId(meeting.id);
    if (!meetingId || seenMeetingIds.has(meetingId)) {
      continue;
    }

    seenMeetingIds.add(meetingId);

    const teacherId = toValidId(
      obj.teacherId ??
        obj.teacher_id ??
        (obj.teacher as UnknownRecord | null | undefined)?.id
    );

    const teacherName = String(
      obj.teacherName ?? obj.teacher_name ?? ""
    ).trim();

    if (!teacherName) {
      continue;
    }

    const materialId = toValidId(obj.materialId ?? obj.material_id ?? null);
    const materialName = String(
      obj.materialName ?? obj.material_name ?? ""
    ).trim();

    const ratingRaw = Number(
      obj.rating ?? obj.averageRating ?? obj.average_rating ?? 0
    );
    const rating =
      Number.isFinite(ratingRaw) && ratingRaw > 0
        ? Math.round(ratingRaw * 10) / 10
        : 0;

    const price = Math.max(
      0,
      Number(obj.finalPrice ?? obj.final_price ?? obj.price ?? 0)
    );

    items.push({
      meetingId,
      teacherId,
      teacherName,
      subject: materialName,
      rating,
      price,
      scheduleText: pickScheduleText(obj),
      nextBadge: pickNextBadge(obj),
      viewerCount: pickViewerCount(obj),
      avatarUrl: pickAvatarUrl(obj),
      trailerUrl: pickTrailerUrl(obj),
      trailerThumbnail: pickTrailerThumbnail(obj),
      materialId: materialId || null,
      materialName,
    });
  }

  return items;
}