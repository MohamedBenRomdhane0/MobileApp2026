import { useMemo } from "react";
import { useGetMeetingsQuery } from "@redux/apis/meetings/meetingApi";
import { getMaterialEmoji } from "@utils/helpers/materialIcon.helper";
import type { MeetingsScreenMeetingItem } from "@screens/meetings/MeetingsScreen.type";

export interface PlanTeacherItem {
  id:        number;
  name:      string;
  subject:   string;
  rating:    number;
  emoji:     string;
  price:     number;
  avatarUrl: string | null;
}

function pickAvatarUrl(obj: Record<string, unknown>): string | null {
  const keys = ["teacherAvatarUrl", "teacher_avatar_url", "avatarUrl", "avatar_url", "avatar"];
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickPrice(obj: Record<string, unknown>): number {
  const raw = Number(obj.finalPrice ?? obj.final_price ?? obj.price ?? 0);
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
}

function pickRating(obj: Record<string, unknown>): number {
  const raw = Number(obj.rating ?? obj.average_rating ?? obj.averageRating ?? 0);
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw * 10) / 10 : 0;
}

/**
 * Derives a deduplicated list of teachers from the meetings API.
 * Pass skip=true until the child session is ready (handled by the caller).
 */
export function usePlanTeachers(skip = false): {
  teachers:  PlanTeacherItem[];
  isLoading: boolean;
  isError:   boolean;
} {
  const { data, isLoading, isError } = useGetMeetingsQuery(
    { page: 1, perPage: 50, pagination: true, orderBy: "created_at", direction: "desc" },
    { skip, refetchOnMountOrArgChange: false }
  );

  const teachers = useMemo<PlanTeacherItem[]>(() => {
    const raw   = data?.data?.items ?? data?.data ?? [];
    const items = Array.isArray(raw) ? (raw as MeetingsScreenMeetingItem[]) : [];

    const seen: Set<number>         = new Set();
    const result: PlanTeacherItem[] = [];

    for (const item of items) {
      const obj = item as unknown as Record<string, unknown>;

      const teacherIdRaw =
        obj.teacherId ?? obj.teacher_id ??
        (obj.teacher as Record<string, unknown> | null)?.id ??
        (obj.user    as Record<string, unknown> | null)?.id;

      const teacherId = Number(teacherIdRaw);
      if (!Number.isFinite(teacherId) || teacherId <= 0) continue;
      if (seen.has(teacherId)) continue;
      seen.add(teacherId);

      const name    = String(obj.teacherName ?? obj.teacher_name ?? "").trim();
      const subject = String(obj.materialName ?? obj.material_name ?? "").trim();
      if (!name) continue;

      result.push({
        id:        teacherId,
        name,
        subject,
        rating:    pickRating(obj),
        emoji:     "🧑‍🏫",
        price:     pickPrice(obj),
        avatarUrl: pickAvatarUrl(obj),
      });
    }

    return result;
  }, [data]);

  return { teachers, isLoading, isError };
}
