export type TimelineTrackType = "text" | "adjustment";

export type TimelineTrack = {
  id: number | string;
  type: TimelineTrackType;
  label: string;
  hasIcon?: boolean;
};

export type TimelineProps = Record<never, never>;
