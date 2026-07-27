import type { ImageSourcePropType } from "react-native";

export type TeacherCard = {
  id: number;
  fullName: string;
  subject: string;
  avatar: ImageSourcePropType;
  isFollowed?: boolean;
  followersCount?: number;
};

export type MeetingCard = {
  id: string;
  teacherName: string;
  subjectLabel: string;
  dayLabel: string;
  timeLabel: string;
  nextDateLabel: string;
  price: string;
  oldPrice?: string;
  isReserved?: boolean;
  bgColor: string;
  headerColor: string;
  discountLabel?: string;
  avatar: ImageSourcePropType;
};

export type LevelVideoCard = {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  duration: string;
  thumbnail: ImageSourcePropType;
};

export type DailySnippet = {
  id: "adhkar" | "hadith" | "hikma";
  labelKey: string;
  icon: any;
  textKey: string;
  sourceKey?: string;
};