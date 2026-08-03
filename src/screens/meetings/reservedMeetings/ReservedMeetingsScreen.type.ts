export type ReservedSessionStatus = "confirmed" | "upcoming";

export type ReservedSession = {
  id: number;
  teacherName: string;
  subject: string;
  accent: string;
  date: number;
  dayLabel: string;
  time: string;
  group: string;
  status: ReservedSessionStatus;
  photo: number;
};

export type TeacherItem = {
  id: number;
  name: string;
  subject: string;
  accent: string;
  sessionsCount: number;
  rating: number;
  photo: number;
};

export type CalendarDay = {
  date: number;
  label: string;
  accent?: string;
  isToday: boolean;
};
