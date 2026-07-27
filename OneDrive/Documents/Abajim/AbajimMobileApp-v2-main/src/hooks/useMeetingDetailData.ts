import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { LEVEL_LABEL_BY_ID } from "@config/enums/Level.enum";
import { buildAvatarUri } from "@utils/helpers/mediaUrl.helper";

import { MEETING_DETAIL_UI } from "@screens/meetings/meetingDetails/MeetingdetailsScreen.constants";
import type {
  MeetingDetailsMeeting,
  MeetingDetailsTeacher,
  ScheduleLine,
} from "@screens/meetings/meetingDetails/MeetingdetailsScreen.type";
import { useMeetingSubject } from "./useMeetingSubject";

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toValidId(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function toBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

export function formatPrice(value?: number | null): string {
  return Number.isFinite(value) && Number(value) > 0
    ? Number(value).toFixed(3)
    : "0.000";
}

export function formatDateTimeLabel(value?: string | null): string {
  if (!value) return "";
  const normalized = String(value).trim().replace("T", " ");
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized.slice(0, 16);
  }
  return normalized;
}

function computeDisplayPrice(meeting: MeetingDetailsMeeting | null): number {
  if (!meeting) return 0;
  const finalPrice = toNumber(meeting.finalPrice);
  if (finalPrice > 0) return finalPrice;
  const price    = toNumber(meeting.price);
  const discount = toNumber(meeting.discount);
  if (price > 0 && discount > 0) return Math.max(price - discount, 0);
  return price;
}

function resolveLevelId(
  rawLevelId?: number | string | null,
  rawLevelName?: string | null
): number {
  const id = toValidId(rawLevelId);
  if (id) return id;
  const match = String(rawLevelName ?? "").toLowerCase().match(/(\d+)/);
  return match ? toValidId(match[1]) : 0;
}

function normalizeScheduleLines(lines?: ScheduleLine[] | null): ScheduleLine[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .map((line) => ({
      day:      String(line?.day ?? "").trim(),
      time:     formatDateTimeLabel(String(line?.time ?? "").trim()),
      duration: String(line?.duration ?? "").trim(),
    }))
    .filter((line) => Boolean(line.day || line.time || line.duration));
}

export type MeetingDetailData = {
  price:               string;
  teacherName:         string;
  avatarChar:          string;
  teacherAvatarUrl:    string | null;
  rating:              number | null;
  yearsExperienceLabel:string;
  localizedLevelName:  string;
  scheduleLines:       ScheduleLine[];
  summaryItems:        Array<{ icon: string; label: string }>;
  heroSessionCount:    number;
  teacherId:           number;
  groupsCount:         number;
  upcomingSessionsCount:number;
  totalSessions:       number;
  isPrivate:           boolean;
  subject:             ReturnType<typeof useMeetingSubject>;
};

export function useMeetingDetailData(
  meeting: MeetingDetailsMeeting | null,
  teacher: MeetingDetailsTeacher | null
): MeetingDetailData {
  const { t } = useTranslation();

  const subject = useMeetingSubject({
    materialName: meeting?.materialName,
    materialId:   meeting?.materialId ?? meeting?.material_id,
  });

  const localizedLevelName = useMemo(() => {
    const levelId = resolveLevelId(
      meeting?.levelId ?? meeting?.level_id,
      meeting?.levelName
    );
    if (levelId && LEVEL_LABEL_BY_ID[levelId]) return LEVEL_LABEL_BY_ID[levelId];
    return String(meeting?.levelName ?? "").trim();
  }, [meeting?.levelId, meeting?.level_id, meeting?.levelName]);

  const teacherName = useMemo(
    () =>
      teacher?.fullName?.trim() ||
      meeting?.teacherName?.trim() ||
      "",
    [teacher?.fullName, meeting?.teacherName]
  );

  const avatarChar = useMemo(
    () => String(teacherName ?? "").trim().charAt(0) || "أ",
    [teacherName]
  );

  const teacherAvatarUrl = useMemo(
    () =>
      buildAvatarUri({
        avatarPath: teacher?.avatarUrl ?? teacher?.avatar_url ?? null,
        avatar:     teacher?.avatar ?? null,
        media:      teacher?.media ?? null,
      }),
    [teacher?.avatarUrl, teacher?.avatar_url, teacher?.avatar, teacher?.media]
  );

  const rating = useMemo(() => {
    const value = toNumber(
      teacher?.ratingAverage ?? meeting?.rating ?? meeting?.ratingAverage
    );
    return value > 0 ? value : null;
  }, [teacher?.ratingAverage, meeting?.rating, meeting?.ratingAverage]);

  const yearsExperienceLabel = useMemo(() => {
    const years = toNumber(teacher?.yearsExperience);
    if (years <= 0) return t(MEETING_DETAIL_UI.verifiedTeacher);
    return t(MEETING_DETAIL_UI.yearsExperience, { count: years });
  }, [teacher?.yearsExperience, t]);

  const scheduleLines = useMemo<ScheduleLine[]>(() => {
    const normalized = normalizeScheduleLines(meeting?.scheduleLines);
    if (normalized.length > 0) return normalized;
    const nextSession = formatDateTimeLabel(meeting?.nextSessionAt);
    if (!nextSession) return [];
    return [{ day: t(MEETING_DETAIL_UI.nextSessionDay), time: nextSession, duration: "" }];
  }, [meeting?.scheduleLines, meeting?.nextSessionAt, t]);

  const totalSessions = useMemo(
    () => toNumber(meeting?.totalSessions) || toNumber(meeting?.total_sessions),
    [meeting?.totalSessions, meeting?.total_sessions]
  );

  const groupsCount         = toNumber(meeting?.groupsCount);
  const upcomingSessionsCount = toNumber(meeting?.upcomingSessionsCount);
  const isPrivate           = toBoolean(meeting?.isPrivate ?? meeting?.is_private);
  const teacherId           = toValidId(meeting?.teacherId ?? meeting?.teacher_id);

  const meetingModeLabel = isPrivate
    ? t(MEETING_DETAIL_UI.privateLabel)
    : t(MEETING_DETAIL_UI.onlineLabel);

  const summaryItems = useMemo(
    () =>
      [
        subject.localizedName
          ? { icon: "📘", label: subject.localizedName }
          : null,
        localizedLevelName
          ? { icon: "🎓", label: localizedLevelName }
          : null,
        totalSessions > 0
          ? { icon: "🗓️", label: `${totalSessions} ${t(MEETING_DETAIL_UI.sessionsSuffix)}` }
          : null,
        meetingModeLabel
          ? { icon: isPrivate ? "🔒" : "💻", label: meetingModeLabel }
          : null,
      ].filter(Boolean) as Array<{ icon: string; label: string }>,
    [subject.localizedName, localizedLevelName, totalSessions, meetingModeLabel, isPrivate, t]
  );

  const heroSessionCount =
    totalSessions > 0
      ? totalSessions
      : upcomingSessionsCount > 0
        ? upcomingSessionsCount
        : scheduleLines.length;

  const price = formatPrice(computeDisplayPrice(meeting));

  return {
    price,
    teacherName,
    avatarChar,
    teacherAvatarUrl,
    rating,
    yearsExperienceLabel,
    localizedLevelName,
    scheduleLines,
    summaryItems,
    heroSessionCount,
    teacherId,
    groupsCount,
    upcomingSessionsCount,
    totalSessions,
    isPrivate,
    subject,
  };
}
