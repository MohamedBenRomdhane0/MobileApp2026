import type { TFunction } from "i18next";

import type {
  TeacherFollowerUI,
  TeacherUI,
} from "@redux/apis/teachers/teacherApi.type";

import { LevelEnum } from "@config/enums/Level.enum";
import { TEACHER_PROFILE_UI } from "@screens/teacher/TeacherProfileScreen.constants";
import type {
  FollowerVM,
  LessonItem,
  MeetingItem,
  PlanItem,
  ReviewItem,
  TeacherLevelUI,
  TeacherProfileVM,
} from "@screens/teacher/TeacherProfileScreen.type";

type TeacherLevelLike = {
  id?: unknown;
  name?: unknown;
  nameAr?: unknown;
};

const LEVEL_TRANSLATION_KEY_BY_ID: Partial<Record<LevelEnum, string>> = {
  [LevelEnum.One]: "level.year_1",
  [LevelEnum.Two]: "level.year_2",
  [LevelEnum.Three]: "level.year_3",
  [LevelEnum.Four]: "level.year_4",
  [LevelEnum.Five]: "level.year_5",
  [LevelEnum.Six]: "level.year_6",
};

const MATERIAL_TRANSLATION_KEY_BY_VALUE: Record<string, string> = {
  math: "material.math",
  maths: "material.math",
  mathematics: "material.math",
  mathematique: "material.math",
  mathematiques: "material.math",
  french: "material.french",
  francais: "material.french",
  français: "material.french",
  arabic: "material.arabic",
  arabe: "material.arabic",
  science: "material.science",
  sciences: "material.science",
  english: "material.english",
  anglais: "material.english",
};

export function toValidId(value: unknown): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
}

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pickNonEmpty(...values: Array<unknown>): string {
  for (const value of values) {
    const stringValue = pickString(value);
    if (stringValue) {
      return stringValue;
    }
  }

  return "";
}

function pickPositiveNumber(value: unknown): number | null {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
}

function toSafeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeLookup(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, "_")
    .replace(/\s+/g, "_");
}

function humanizeKey(value: string): string {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) {
    return "";
  }

  if (!/^[a-z0-9_]+$/i.test(rawValue)) {
    return rawValue;
  }

  return rawValue
    .replace(/^mat_/, "")
    .replace(/^year_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function translateLabel(t: TFunction, value: string): string {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) {
    return "";
  }

  const translatedValue = t(rawValue);
  return translatedValue === rawValue ? humanizeKey(rawValue) : translatedValue;
}

function translateKeyWithFallback(
  t: TFunction,
  key: string,
  fallback: string
): string {
  const translatedValue = t(key);
  return translatedValue === key ? fallback : translatedValue;
}

function resolveMaterialLabel(t: TFunction, value: string): string {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) {
    return "";
  }

  const normalizedValue = normalizeLookup(rawValue);
  const translationKey = MATERIAL_TRANSLATION_KEY_BY_VALUE[normalizedValue];

  if (translationKey) {
    return translateKeyWithFallback(t, translationKey, rawValue);
  }

  if (rawValue.startsWith("material.")) {
    return translateKeyWithFallback(t, rawValue, rawValue);
  }

  return translateLabel(t, rawValue);
}

function resolveLevelLabel(t: TFunction, level: TeacherLevelLike): string {
  const levelId = toValidId(level.id);
  const rawLabel = pickNonEmpty(level.nameAr, level.name);

  if (levelId) {
    const translationKey = LEVEL_TRANSLATION_KEY_BY_ID[levelId as LevelEnum];
    if (translationKey) {
      return translateKeyWithFallback(t, translationKey, rawLabel);
    }
  }

  if (rawLabel.startsWith("level.")) {
    return translateKeyWithFallback(t, rawLabel, rawLabel);
  }

  const normalizedRawLabel = normalizeLookup(rawLabel);

  if (/^year_[1-6]$/.test(normalizedRawLabel)) {
    return translateKeyWithFallback(
      t,
      `level.${normalizedRawLabel}`,
      rawLabel
    );
  }

  return translateLabel(t, rawLabel);
}

function isArabic(value: string): boolean {
  return /[\u0600-\u06FF]/.test(value);
}

export function getInitialsFromName(name?: string | null): string {
  const cleanName = String(name ?? "").trim();
  if (!cleanName) {
    return "؟";
  }

  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (isArabic(cleanName)) {
    const joined = parts.join("");
    const chars = [...joined];

    return (
      chars.slice(-2).join("") ||
      chars.slice(-1).join("") ||
      "؟"
    ).toUpperCase();
  }

  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";

  return (first + second).toUpperCase() || "؟";
}

export function formatRating(value: number | null): string {
  if (value == null || value <= 0) {
    return "—";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatLevels(t: TFunction, levels: TeacherUI["levels"]): string {
  const safeLevels = toSafeArray(levels);

  if (!safeLevels.length) {
    return t(TEACHER_PROFILE_UI.noLevels);
  }

  const labels = safeLevels
    .map((level) => resolveLevelLabel(t, level))
    .filter(Boolean);

  return labels.join(" • ") || t(TEACHER_PROFILE_UI.noLevels);
}

function toReviewItems(teacher: TeacherUI, t: TFunction): ReviewItem[] {
  const reviewList = toSafeArray(teacher.reviews);
  const levels = toSafeArray(teacher.levels);

  return reviewList
    .map((review, index) => {
      const numericRating = clampNumber(Number(review?.rating || 0), 1, 5);

      const reviewLevelLabel = pickNonEmpty(review?.levelName);

      return {
        id: String(review?.id || `review-${index + 1}`),
        rating: numericRating,
        authorLabel:
          pickNonEmpty(review?.authorLabel, review?.authorName) ||
          t(TEACHER_PROFILE_UI.defaultReviewAuthorPupil),
        levelLabel: reviewLevelLabel
          ? resolveLevelLabel(t, { name: reviewLevelLabel, nameAr: reviewLevelLabel })
          : levels[0]
            ? resolveLevelLabel(t, levels[0])
            : "",
        comment: pickNonEmpty(review?.comment),
      };
    })
    .filter((item) => Boolean(item.comment));
}

function toLessonItems(teacher: TeacherUI): LessonItem[] {
  const bookList = toSafeArray(teacher.books);

  return bookList.slice(0, 3).map((book, index) => ({
    id: String(book?.id || `lesson-${index + 1}`),
    title: pickNonEmpty(book?.title, book?.name),
    viewsText: "",
    durationText: "",
    index: index + 1,
  }));
}

function buildBadges(
  t: TFunction,
  subject: string,
  yearsExperience: number | null,
  ratingAverage: number | null
): TeacherProfileVM["badges"] {
  const items: TeacherProfileVM["badges"] = [];

  if (subject) {
    items.push({
      emoji: "📘",
      label: subject,
    });
  }

  if (yearsExperience) {
    items.push({
      emoji: "⏳",
      label: t(TEACHER_PROFILE_UI.yearsExperienceLabel, {
        count: yearsExperience,
      }),
    });
  }

  if (ratingAverage && ratingAverage >= 4) {
    items.push({
      emoji: "⭐",
      label: t(TEACHER_PROFILE_UI.excellentRating),
    });
  }

  return items.slice(0, 3);
}

export function buildStaticPlanItems(t: TFunction): PlanItem[] {
  const advancedSummary = t(TEACHER_PROFILE_UI.planSessionsSummary, {
    monthly: 8,
    weekly: 2,
  });

  return [
    {
      id: "starter",
      title: t(TEACHER_PROFILE_UI.planStarterTitle),
      priceText: "60 DT",
      unitPriceText: t(TEACHER_PROFILE_UI.planUnitPrice, { price: "15 DT" }),
      summaryText: t(TEACHER_PROFILE_UI.planSessionsSummary, {
        monthly: 4,
        weekly: 1,
      }),
      autoBookingText: t(TEACHER_PROFILE_UI.planAutoBooking),
      isFeatured: false,
      scheduleGroups: [],
    },
    {
      id: "advanced",
      title: t(TEACHER_PROFILE_UI.planAdvancedTitle),
      priceText: "80 DT",
      unitPriceText: t(TEACHER_PROFILE_UI.planUnitPrice, { price: "10 DT" }),
      summaryText: advancedSummary,
      autoBookingText: t(TEACHER_PROFILE_UI.planAutoBooking),
      isFeatured: true,
      scheduleGroups: [
        {
          id: "g01",
          groupCode: "G01",
          summaryText: advancedSummary,
          occupancyText: "5/8",
          occupancyProgress: 0.625,
          isHighlighted: false,
          isSelected: false,
          times: [
            {
              id: "g01-mon",
              dayLabel: t(TEACHER_PROFILE_UI.dayMonday),
              timeText: "10:00–11:00",
            },
            {
              id: "g01-wed",
              dayLabel: t(TEACHER_PROFILE_UI.dayWednesday),
              timeText: "10:00–11:00",
            },
          ],
        },
        {
          id: "g02",
          groupCode: "G02",
          summaryText: advancedSummary,
          occupancyText: "7/8",
          occupancyProgress: 0.875,
          isHighlighted: true,
          isSelected: true,
          times: [
            {
              id: "g02-tue",
              dayLabel: t(TEACHER_PROFILE_UI.dayTuesday),
              timeText: "14:00–15:00",
            },
            {
              id: "g02-thu",
              dayLabel: t(TEACHER_PROFILE_UI.dayThursday),
              timeText: "14:00–15:00",
            },
          ],
        },
      ],
    },
    {
      id: "intensive",
      title: t(TEACHER_PROFILE_UI.planIntensiveTitle),
      priceText: "100 DT",
      unitPriceText: t(TEACHER_PROFILE_UI.planUnitPrice, { price: "8 DT" }),
      summaryText: t(TEACHER_PROFILE_UI.planSessionsSummary, {
        monthly: 12,
        weekly: 3,
      }),
      autoBookingText: t(TEACHER_PROFILE_UI.planAutoBooking),
      isFeatured: false,
      scheduleGroups: [],
    },
  ];
}

export function buildStaticMeetingItems(t: TFunction): MeetingItem[] {
  return [
    {
      id: "meeting-1",
      title: t(TEACHER_PROFILE_UI.meetingTitle1),
      subtitle: t(TEACHER_PROFILE_UI.meetingSubtitle1),
      dayLabel: t(TEACHER_PROFILE_UI.dayMonday),
      timeText: "18:00",
      statusText: t(TEACHER_PROFILE_UI.meetingStatusAvailable),
      seatsText: "6/12",
      isSoon: false,
    },
    {
      id: "meeting-2",
      title: t(TEACHER_PROFILE_UI.meetingTitle2),
      subtitle: t(TEACHER_PROFILE_UI.meetingSubtitle2),
      dayLabel: t(TEACHER_PROFILE_UI.dayThursday),
      timeText: "17:30",
      statusText: t(TEACHER_PROFILE_UI.meetingStatusSoon),
      seatsText: "9/12",
      isSoon: true,
    },
  ];
}

export function mapTeacherProfileVM(
  rawTeacher: TeacherUI | null | undefined,
  t: TFunction
): TeacherProfileVM | null {
  if (!rawTeacher) {
    return null;
  }

  const levels = toSafeArray(rawTeacher.levels);
  const reviewItems = toReviewItems(rawTeacher, t);
  const lessonItems = toLessonItems(rawTeacher);

  const fullName =
    pickNonEmpty(rawTeacher.fullName) || t(TEACHER_PROFILE_UI.unknownTeacher);

  const subject =
    resolveMaterialLabel(
      t,
      pickNonEmpty(rawTeacher.subjectName, rawTeacher.materialName)
    ) || t(TEACHER_PROFILE_UI.subjectFallback);

  const studentsCount = pickPositiveNumber(rawTeacher.studentsCount) ?? 0;
  const followersCount = pickPositiveNumber(rawTeacher.followersCount) ?? 0;
  const reviewsCount =
    pickPositiveNumber(rawTeacher.reviewsCount) ?? reviewItems.length;

  const ratingAverage = pickPositiveNumber(rawTeacher.ratingAverage);
  const yearsExperience = pickPositiveNumber(rawTeacher.yearsExperience);

  const safeLevels: TeacherLevelUI[] = levels.map((level) => ({
    id: toValidId(level?.id),
    name: pickNonEmpty(level?.name),
    nameAr: pickNonEmpty(level?.nameAr) || null,
  }));

  return {
    id: toValidId(rawTeacher.id),
    fullName,
    avatarUrl: pickNonEmpty(rawTeacher.avatarUrl) || null,
    initials: getInitialsFromName(fullName),

    subject,

    isFollowed: Boolean(rawTeacher.isFollowed),
    followersCount,

    studentsCount,
    reviewsCount,
    ratingAverage,
    yearsExperience,

    levels: safeLevels,
    levelsText: formatLevels(t, levels),

    publishedLessonsCount:
      pickPositiveNumber(rawTeacher.publishedLessonsCount) ?? lessonItems.length,

    aboutText:
      pickNonEmpty(rawTeacher.about, rawTeacher.bio) ||
      t(TEACHER_PROFILE_UI.noAbout),
    bioText: pickNonEmpty(rawTeacher.bio) || t(TEACHER_PROFILE_UI.noBio),
    educationText:
      pickNonEmpty(rawTeacher.education) || t(TEACHER_PROFILE_UI.noEducation),
    experienceText:
      pickNonEmpty(rawTeacher.experience) || t(TEACHER_PROFILE_UI.noExperience),

    reviewItems,
    lessonItems,
    badges: buildBadges(t, subject, yearsExperience, ratingAverage),
  };
}

export function mapFollowers(list: TeacherFollowerUI[]): FollowerVM[] {
  return toSafeArray(list).map((item, index) => {
    const fullName = pickNonEmpty(item?.fullName) || "—";

    return {
      id: toValidId(item?.id) || index + 1,
      fullName,
      avatarUrl: pickNonEmpty(item?.avatarUrl) || null,
      initials: getInitialsFromName(fullName),
    };
  });
}