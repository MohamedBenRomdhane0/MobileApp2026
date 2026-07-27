import type { MeetingStatusEnum } from "@config/enums/MeetingStatus.enum";

import type {
  MeetingApi,
  MeetingDetailsUI,
  MeetingGroupApi,
  MeetingGroupUI,
  MeetingListItemUI,
  MeetingsCollectionApiResponse,
  MeetingTimeApi,
  MeetingTimeUI,
  MeetingsListPayloadUI,
  ScheduleLineUI,
} from "./meetingApi.type";

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toStringSafe = (value: unknown, fallback = ""): string => {
  return typeof value === "string" ? value : fallback;
};

const toNullableString = (value: unknown): string | null => {
  return typeof value === "string" && value.trim() !== "" ? value : null;
};

const toBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["1", "true", "yes", "on"].includes(normalized)) return true;
    if (["0", "false", "no", "off"].includes(normalized)) return false;
  }

  return fallback;
};

const toArray = <T>(value: T[] | null | undefined): T[] => {
  return Array.isArray(value) ? value : [];
};

const buildDateTime = (
  date?: string | null,
  time?: string | null
): string | null => {
  if (!date || !time) return null;
  return `${date} ${time}`;
};

const normalizeMeetingStatus = (
  value: unknown
): MeetingStatusEnum | string => {
  const normalized = toStringSafe(value, "").trim().toLowerCase();

  if (!normalized) return "draft";

  if (
    normalized === "draft" ||
    normalized === "published" ||
    normalized === "archived"
  ) {
    return normalized as MeetingStatusEnum;
  }

  return normalized;
};

const computeFinalPrice = (
  price: number,
  discount: number,
  finalPrice: number
): number => {
  if (finalPrice > 0) return finalPrice;
  if (price > 0 && discount > 0) return Math.max(price - discount, 0);
  return price;
};

const computeHasDiscount = (
  price: number,
  discount: number,
  finalPrice: number,
  hasDiscount: boolean
): boolean => {
  if (hasDiscount) return true;
  if (discount > 0) return true;
  return price > 0 && finalPrice > 0 && finalPrice < price;
};

const parseTimeToMinutes = (time?: string | null): number | null => {
  if (!time) return null;

  const match = String(time).trim().match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
};

const computeDurationMinutes = (
  startTime?: string | null,
  endTime?: string | null
): number | null => {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);

  if (start === null || end === null || end <= start) return null;
  return end - start;
};

const buildScheduleLine = (item: MeetingTimeUI): ScheduleLineUI => {
  const durationMinutes = computeDurationMinutes(item.startTime, item.endTime);

  return {
    day: item.meetingDate,
    time:
      item.startTime && item.endTime
        ? `${item.startTime} - ${item.endTime}`
        : item.startTime || item.endTime || "",
    duration: durationMinutes ? String(durationMinutes) : "",
  };
};

type DerivedMeetingStats = {
  groupsCount: number;
  upcomingSessionsCount: number;
  nextSessionAt: string | null;
  scheduleLines: ScheduleLineUI[];
};

const deriveMeetingStats = (groups: MeetingGroupUI[]): DerivedMeetingStats => {
  const allTimes = groups.flatMap((group) => group.meetingTimes);

  const sortableTimes = allTimes
    .map((item) => {
      const startsAt = item.startsAt ? item.startsAt.replace(" ", "T") : null;
      const timestamp = startsAt ? new Date(startsAt).getTime() : NaN;

      return {
        ...item,
        timestamp: Number.isFinite(timestamp) ? timestamp : null,
      };
    })
    .filter((item) => item.status.toLowerCase() !== "cancelled");

  const sorted = [...sortableTimes].sort((a, b) => {
    if (a.timestamp === null && b.timestamp === null) return 0;
    if (a.timestamp === null) return 1;
    if (b.timestamp === null) return -1;
    return a.timestamp - b.timestamp;
  });

  const now = Date.now();

  const future = sorted.filter((item) => {
    if (item.timestamp === null) return false;
    return item.timestamp >= now;
  });

  const referenceList = future.length > 0 ? future : sorted;

  return {
    groupsCount: groups.length,
    upcomingSessionsCount: future.length,
    nextSessionAt: referenceList[0]?.startsAt ?? null,
    scheduleLines: referenceList.map(buildScheduleLine),
  };
};

export const toMeetingTimeUI = (item: MeetingTimeApi): MeetingTimeUI => {
  const meetingDate = toStringSafe(item.meeting_date ?? item.meetingDate, "");
  const startTime = toStringSafe(item.start_time ?? item.startTime, "");
  const endTime = toStringSafe(item.end_time ?? item.endTime, "");

  return {
    id: toNumber(item.id, 0),
    groupId: toNullableNumber(item.group_id ?? item.groupId),
    meetingDate,
    startTime,
    endTime,
    status: toStringSafe(item.status, ""),
    rescheduleDetails: item.reschedule_details ?? item.rescheduleDetails ?? null,
    startsAt: buildDateTime(meetingDate, startTime),
    endsAt: buildDateTime(meetingDate, endTime),
  };
};

export const toMeetingGroupUI = (item: MeetingGroupApi): MeetingGroupUI => {
  const meetingTimes = toArray(
    item.meeting_times ?? item.meetingTimes
  ).map(toMeetingTimeUI);

  return {
    id: toNumber(item.id, 0),
    meetingId: toNullableNumber(item.meeting_id ?? item.meetingId),
    name: toStringSafe(item.name, ""),
    sessionsPerWeek: toNumber(item.sessions_per_week ?? item.sessionsPerWeek, 0),
    meetingTimes,
  };
};

export const toMeetingListItemUI = (item: MeetingApi): MeetingListItemUI => {
  const meetingGroups = toArray(
    item.meeting_groups ?? item.meetingGroups
  ).map(toMeetingGroupUI);

  const derivedStats = deriveMeetingStats(meetingGroups);

  const price = toNumber(item.price, 0);
  const discount = toNumber(item.discount, 0);
  const rawFinalPrice = toNumber(item.final_price ?? item.finalPrice, 0);
  const finalPrice = computeFinalPrice(price, discount, rawFinalPrice);
  const hasDiscount = computeHasDiscount(
    price,
    discount,
    finalPrice,
    toBoolean(item.has_discount ?? item.hasDiscount, false)
  );

  const groupsCount =
    toNumber(item.groups_count ?? item.groupsCount, 0) ||
    derivedStats.groupsCount;

  const upcomingSessionsCount =
    toNumber(item.upcoming_sessions_count ?? item.upcomingSessionsCount, 0) ||
    derivedStats.upcomingSessionsCount;

  const nextSessionAt =
    toNullableString(item.next_session_at ?? item.nextSessionAt) ??
    derivedStats.nextSessionAt;

  return {
    id: toNumber(item.id, 0),
    name: toStringSafe(item.name, ""),

    levelId: toNullableNumber(item.level_id ?? item.levelId ?? item.level?.id),
    levelName: toStringSafe(
      item.level_name ?? item.levelName ?? item.level?.name,
      ""
    ),

    materialId: toNullableNumber(
      item.material_id ?? item.materialId ?? item.material?.id
    ),
    materialName: toStringSafe(
      item.material_name ?? item.materialName ?? item.material?.name,
      ""
    ),

    teacherId: toNullableNumber(
      item.teacher_id ?? item.teacherId ?? item.teacher?.id
    ),
    teacherName: toStringSafe(
      item.teacher_name ??
        item.teacherName ??
        item.teacher?.full_name ??
        item.teacher?.fullName,
      ""
    ),

    isPrivate: toBoolean(item.is_private ?? item.isPrivate, false),
    maxStudents: toNullableNumber(item.max_students ?? item.maxStudents),
    hasFreeTrial: toBoolean(item.has_free_trial ?? item.hasFreeTrial, false),
    totalSessions: toNumber(item.total_sessions ?? item.totalSessions, 0),

    price,
    discount,
    finalPrice,
    hasDiscount,

    groupsCount,
    upcomingSessionsCount,
    nextSessionAt,

    status: normalizeMeetingStatus(item.status),
    timezone: toStringSafe(item.timezone, "Africa/Tunis"),

    createdAt: toNullableString(item.created_at),
    updatedAt: toNullableString(item.updated_at),
  };
};

export const toMeetingDetailsUI = (item: MeetingApi): MeetingDetailsUI => {
  const base = toMeetingListItemUI(item);
  const meetingGroups = toArray(
    item.meeting_groups ?? item.meetingGroups
  ).map(toMeetingGroupUI);

  const derivedStats = deriveMeetingStats(meetingGroups);

  return {
    ...base,
    description: toNullableString(item.description),
    meetingGroups,
    scheduleLines: derivedStats.scheduleLines,
  };
};

export const toMeetingsListPayloadUI = (
  payload: MeetingsCollectionApiResponse
): MeetingsListPayloadUI => {
  const items = toArray(payload.data).map(toMeetingListItemUI);

  if ("meta" in payload && payload.meta) {
    const page = toNumber(payload.meta.current_page, 1);
    const lastPage = toNumber(payload.meta.last_page, 1);
    const perPage = toNumber(payload.meta.per_page, items.length);
    const total = toNumber(payload.meta.total, items.length);

    return {
      items,
      page,
      perPage,
      total,
      lastPage,
      hasNextPage: page < lastPage,
    };
  }

  return {
    items,
    page: 1,
    perPage: items.length,
    total: items.length,
    lastPage: 1,
    hasNextPage: false,
  };
};