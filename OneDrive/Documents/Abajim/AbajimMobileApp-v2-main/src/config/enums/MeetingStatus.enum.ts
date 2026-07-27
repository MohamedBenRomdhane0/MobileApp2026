export enum MeetingStatusEnum {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export const MEETING_STATUS_LABEL: Record<MeetingStatusEnum, string> = {
  [MeetingStatusEnum.Draft]: "meetings.status_draft",
  [MeetingStatusEnum.Published]: "meetings.status_published",
  [MeetingStatusEnum.Archived]: "meetings.status_archived",
};

export function isMeetingStatus(value: unknown): value is MeetingStatusEnum {
  return Object.values(MeetingStatusEnum).includes(value as MeetingStatusEnum);
}

export function normalizeMeetingStatus(
  value?: string | null
): MeetingStatusEnum {
  if (isMeetingStatus(value)) return value;
  return MeetingStatusEnum.Published;
}
