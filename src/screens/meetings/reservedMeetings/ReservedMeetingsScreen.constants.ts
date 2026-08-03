import type {
  CalendarDay,
  ReservedSession,
  TeacherItem,
} from "./ReservedMeetingsScreen.type";

export const RESERVED_HEADER_GRADIENT: readonly [string, string, string] = [
  "#0D2A52",
  "#163867",
  "#1A4A82",
];

export const RESERVED_MONTH_LABEL = "Juin 2026";
export const RESERVED_WEEK_TITLE = "Enseignants cette semaine";
export const RESERVED_LIST_TITLE = "Mes séances réservées";
export const RESERVED_EMPTY_LABEL = "Aucune séance ce jour";

const SESSION_DATE_ACCENT: Record<number, string> = {
  19: "#22BEC8",
  20: "#7C4DCC",
  21: "#F97316",
  23: "#22BEC8",
};

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

// June 2026 starts on a Monday (index 0).
export function buildCalendarDays(): CalendarDay[] {
  const days: CalendarDay[] = [];
  for (let i = 1; i <= 30; i += 1) {
    days.push({
      date: i,
      label: DAY_LABELS[(i - 1) % 7],
      accent: SESSION_DATE_ACCENT[i],
      isToday: i === 19,
    });
  }
  return days;
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
    sessionsCount: 1,
    rating: 4.7,
    photo: require("@assets/teachers/tarek.png"),
  },
];

export const RESERVED_SESSIONS: ReservedSession[] = [
  {
    id: 1,
    teacherName: "Mrs. Ismail",
    subject: "Anglais",
    accent: "#22BEC8",
    date: 19,
    dayLabel: "Mer",
    time: "18:30 – 20:00",
    group: "Groupe B",
    status: "confirmed",
    photo: require("@assets/teachers/ismail.png"),
  },
  {
    id: 2,
    teacherName: "Mr. Tounes",
    subject: "Mathématiques",
    accent: "#7C4DCC",
    date: 20,
    dayLabel: "Jeu",
    time: "14:00 – 15:30",
    group: "Groupe A",
    status: "upcoming",
    photo: require("@assets/teachers/tounes.png"),
  },
  {
    id: 3,
    teacherName: "Mr. Tarek",
    subject: "Français",
    accent: "#F97316",
    date: 21,
    dayLabel: "Ven",
    time: "10:00 – 11:30",
    group: "Groupe A",
    status: "confirmed",
    photo: require("@assets/teachers/tarek.png"),
  },
  {
    id: 4,
    teacherName: "Mrs. Ismail",
    subject: "Anglais",
    accent: "#22BEC8",
    date: 23,
    dayLabel: "Dim",
    time: "18:30 – 20:00",
    group: "Groupe B",
    status: "upcoming",
    photo: require("@assets/teachers/ismail.png"),
  },
];
