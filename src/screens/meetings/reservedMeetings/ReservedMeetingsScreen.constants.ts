import type {
  CalendarDay,
  CalendarWeek,
  ReservedSession,
  TeacherItem,
} from "./ReservedMeetingsScreen.type";

export const RESERVED_HEADER_GRADIENT: readonly [string, string, string] = [
  "#0D2A52",
  "#163867",
  "#1A4A82",
];

export const RESERVED_MONTH_LABEL = "Juin";
export const RESERVED_YEAR = 2026;
/** The reserved sessions below all live in June (0-based month index). */
export const RESERVED_MONTH_INDEX = 5;

/** Mocked "today" — June 2026 starts on a Monday, so 19 is a Friday. */
export const RESERVED_TODAY = 19;

export const RESERVED_PICK_DATE_TITLE = "Choisir la date";
export const RESERVED_TEACHERS_TITLE = "Enseignants du jour";
export const RESERVED_SCHEDULE_TITLE = "Emploi du temps";
export const RESERVED_EMPTY_TITLE = "Journée libre";
export const RESERVED_EMPTY_LABEL = "Aucune séance réservée ce jour";
export const RESERVED_ALL_TEACHERS = "Tous";
export const RESERVED_LIVE_LABEL = "En direct";
export const RESERVED_LIVE_JOIN = "Rejoindre";

/** Two-letter column headers, week starting on Monday. */
export const DAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const DAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Vertical scale of the agenda: one hour of the day = 68pt. */
export const HOUR_HEIGHT = 68;
/** Hours of padding kept above the first and below the last session. */
export const TIMELINE_PADDING_HOURS = 1;

/**
 * Preview hook for the "live" state: the real device clock (August) can
 * never fall inside the June mock, so this forces the current hour used for
 * live detection. Set to `null` to use the real device clock instead.
 */
export const LIVE_PREVIEW_NOW: number | null = 14.25;

/** Decimal hour of "now", honoring the preview override above. */
export function currentNowHour(): number {
  if (LIVE_PREVIEW_NOW !== null) return LIVE_PREVIEW_NOW;
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}

export const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export function dayLabelOf(
  date: number,
  year?: number,
  month?: number,
): string {
  const y = year ?? new Date().getFullYear();
  const m = month ?? new Date().getMonth();
  const weekday = new Date(y, m, date).getDay();
  return DAY_SHORT[(weekday + 6) % 7];
}

/** "13.5" → "13:30". */
export function formatHour(value: number): string {
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const RESERVED_TEACHERS: TeacherItem[] = [
  {
    id: 1,
    name: "Mrs. Ismail",
    subject: "Anglais",
    accent: "#22BEC8",
    sessionsCount: 2,
    rating: 4.9,
    photo: require("@assets/teachers/ismail.png"),
  },
  {
    id: 2,
    name: "Mr. Tounes",
    subject: "Mathématiques",
    accent: "#7C4DCC",
    sessionsCount: 3,
    rating: 4.8,
    photo: require("@assets/teachers/tounes.png"),
  },
  {
    id: 3,
    name: "Mr. Tarek",
    subject: "Français",
    accent: "#F97316",
    sessionsCount: 2,
    rating: 4.7,
    photo: require("@assets/teachers/tarek.png"),
  },
];

export const RESERVED_SESSIONS: ReservedSession[] = [
  {
    id: 1,
    teacherId: 1,
    teacherName: "Mrs. Ismail",
    subject: "Anglais",
    accent: "#22BEC8",
    date: 19,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    dayLabel: dayLabelOf(19),
    start: 8,
    end: 9.5,
    group: "Groupe B",
    room: "Salle 204",
    status: "confirmed",
    progress: 75,
    photo: require("@assets/teachers/ismail.png"),
  },
  {
    id: 2,
    teacherId: 2,
    teacherName: "Mr. Tounes",
    subject: "Mathématiques",
    accent: "#7C4DCC",
    date: 19,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    dayLabel: dayLabelOf(19),
    start: 11,
    end: 12.5,
    group: "Groupe A",
    room: "Salle 108",
    status: "confirmed",
    progress: 100,
    photo: require("@assets/teachers/tounes.png"),
  },
  {
    id: 3,
    teacherId: 3,
    teacherName: "Mr. Tarek",
    subject: "Français",
    accent: "#F97316",
    date: 19,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    dayLabel: dayLabelOf(19),
    start: 13.5,
    end: 15,
    group: "Groupe A",
    room: "Salle 302",
    status: "upcoming",
    progress: 40,
    photo: require("@assets/teachers/tarek.png"),
  },
  {
    id: 4,
    teacherId: 2,
    teacherName: "Mr. Tounes",
    subject: "Mathématiques",
    accent: "#7C4DCC",
    date: 20,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    dayLabel: dayLabelOf(20),
    start: 14,
    end: 15.5,
    group: "Groupe A",
    room: "Salle 108",
    status: "upcoming",
    progress: 60,
    photo: require("@assets/teachers/tounes.png"),
  },
  {
    id: 5,
    teacherId: 3,
    teacherName: "Mr. Tarek",
    subject: "Français",
    accent: "#F97316",
    date: 21,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    dayLabel: dayLabelOf(21),
    start: 10,
    end: 11.5,
    group: "Groupe A",
    room: "Salle 302",
    status: "confirmed",
    progress: 85,
    photo: require("@assets/teachers/tarek.png"),
  },
  {
    id: 6,
    teacherId: 1,
    teacherName: "Mrs. Ismail",
    subject: "Anglais",
    accent: "#22BEC8",
    date: 23,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    dayLabel: dayLabelOf(23),
    start: 18.5,
    end: 20,
    group: "Groupe B",
    room: "Salle 204",
    status: "upcoming",
    progress: 30,
    photo: require("@assets/teachers/ismail.png"),
  },
];

const ACCENT_BY_DATE: Record<number, string> = RESERVED_SESSIONS.reduce(
  (acc, session) => {
    if (!acc[session.date]) acc[session.date] = session.accent;
    return acc;
  },
  {} as Record<number, string>,
);

/**
 * Month laid out as Monday-first week rows, so the strip can be paged
 * one week at a time like the reference design. Leading/trailing cells
 * outside the month are `null`.
 */
export function buildCalendarWeeks(
  year: number,
  monthIndex: number,
  sessions?: ReservedSession[],
): CalendarWeek[] {
  const accentMap: Record<number, string> = {};
  if (sessions) {
    for (const s of sessions) {
      if (s.year === year && s.month === monthIndex && !accentMap[s.date]) {
        accentMap[s.date] = s.accent;
      }
    }
  }

  const weeks: CalendarWeek[] = [];
  const offset = leadingOffset(year, monthIndex);
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === monthIndex;
  const todayDate = today.getDate();

  let week: CalendarWeek = new Array(offset).fill(null);

  for (let date = 1; date <= totalDays; date += 1) {
    const day: CalendarDay = {
      date,
      label: DAY_LABELS[(offset + date - 1) % 7],
      accent: sessions ? accentMap[date] : ACCENT_BY_DATE[date],
      isToday: isCurrentMonth && date === todayDate,
    };
    week.push(day);

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}

/** Index of the week row containing `date`, for the paged strip. */
export function weekIndexOf(
  date: number,
  year: number,
  monthIndex: number,
): number {
  return Math.floor((leadingOffset(year, monthIndex) + date - 1) / 7);
}

/** Monday-first index of the 1st of the month (Mon = 0 … Sun = 6). */
function leadingOffset(year: number, monthIndex: number): number {
  return (new Date(year, monthIndex, 1).getDay() + 6) % 7;
}
