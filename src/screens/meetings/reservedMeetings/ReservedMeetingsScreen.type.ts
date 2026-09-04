export type ReservedSessionStatus = "confirmed" | "upcoming";

export type ReservedSession = {
  id: number;
  teacherId: number;
  teacherName: string;
  subject: string;
  accent: string;
  date: number;
  month: number;
  year: number;
  dayLabel: string;
  /** Decimal hours on a 24h clock — 13.5 means 13:30. */
  start: number;
  end: number;
  group: string;
  room: string;
  status: ReservedSessionStatus;
  /** Course completion shown on the timeline block, 0–100. */
  progress: number;
  photo?: number | string | null;
  avatarUrl?: string | null;
};

export type TeacherItem = {
  id: number;
  name: string;
  subject: string;
  accent: string;
  sessionsCount: number;
  rating: number;
  photo?: number | string | null;
  avatarUrl?: string | null;
};

export type CalendarDay = {
  date: number;
  /** Two-letter weekday header (Lu, Ma, Me…). */
  label: string;
  /** Accent of the first session booked that day, if any. */
  accent?: string;
  isToday: boolean;
};

/** A week row; `null` pads the leading/trailing days outside the month. */
export type CalendarWeek = (CalendarDay | null)[];
