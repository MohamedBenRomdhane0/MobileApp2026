import type { JoinPeer } from "./JoinSessionScreen.type";

export const JOIN_HEADER_GRADIENT: readonly [string, string, string] = [
  "#0D2A52",
  "#163867",
  "#1A4A82",
];

export const JOIN_TITLE = "Join the session";
export const JOIN_LIVE = "En direct";
export const JOIN_CONNECTING = "Connexion…";
export const JOIN_CONNECTING_SUB = "Préparation de votre salle…";
export const JOIN_YOU = "Vous";
export const JOIN_LEAVE = "Quitter";

export const JOIN_SESSION_INFO = {
  subject: "Anglais",
  accent: "#22BEC8",
  teacherName: "Mrs. Ismail",
  time: "18:30 – 20:00",
  group: "Groupe B",
} as const;

export const JOIN_TEACHER: JoinPeer = {
  id: 1,
  name: "Mrs. Ismail",
  photo: require("@assets/teachers/ismail.png"),
  isTeacher: true,
};

export const JOIN_PEERS: JoinPeer[] = [
  {
    id: 2,
    name: "Adam",
    photo: require("@assets/kids/boys/boy1.png"),
  },
  {
    id: 3,
    name: "Lina",
    photo: require("@assets/kids/girls/girl1.jpg"),
  },
  {
    id: 4,
    name: "Yassine",
    photo: require("@assets/kids/boys/boy2.jpg"),
  },
];
