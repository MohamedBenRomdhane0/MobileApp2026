export type RecordMeetingViewMode = "grid" | "list";

export type RecordMeetingSilverItem = {
  id: number | string;
  title: string;
  date: string;
  size: string;
  duration: string;
  thumbnailUri?: string;
  meetingId?: number | string;
};

export type RecordMeetingSilverProps = Record<never, never>;
