import type {
  FollowTeacherPayloadApi,
  FollowTeacherPayloadUI,
  SaveTeacherReviewPayloadApi,
  SaveTeacherReviewPayloadUI,
  TeacherApi,
  TeacherFollowerApi,
  TeacherFollowerUI,
  TeacherOwnReviewApi,
  TeacherOwnReviewUI,
  TeacherReviewApi,
  TeacherReviewUI,
  TeacherUI,
} from "./teacherApi.type";

import { buildMediaUrl } from "@utils/helpers/mediaUrl.helper";
import { ConfigEnv } from "@config/configEnv";

const S3_BASE = String((ConfigEnv as any)?.S3_BUCKET_URL ?? "").replace(
  /\/+$/,
  ""
);

function safeInt(value: unknown, fallback = 0): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function safePositiveOrZeroInt(value: unknown, fallback = 0): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0
    ? numericValue
    : fallback;
}

function safeNullableNumber(value: unknown): number | null {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function safeBool(value: unknown, fallback = false): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (
      normalizedValue === "true" ||
      normalizedValue === "1" ||
      normalizedValue === "yes"
    ) {
      return true;
    }

    if (
      normalizedValue === "false" ||
      normalizedValue === "0" ||
      normalizedValue === "no"
    ) {
      return false;
    }
  }

  return fallback;
}

function pickNonEmpty(...values: Array<unknown>): string | null {
  for (const value of values) {
    const stringValue = typeof value === "string" ? value.trim() : "";
    if (stringValue) {
      return stringValue;
    }
  }

  return null;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function joinUrl(base: string, path: string): string {
  const normalizedBase = String(base ?? "").replace(/\/+$/, "");
  const normalizedPath = String(path ?? "").replace(/^\/+/, "");

  if (!normalizedBase) {
    return normalizedPath;
  }

  if (!normalizedPath) {
    return normalizedBase;
  }

  return `${normalizedBase}/${normalizedPath}`;
}

function resolveMediaUrl(raw: unknown): string | null {
  const value = typeof raw === "string" ? raw.trim() : "";

  if (!value) {
    return null;
  }

  if (isHttpUrl(value)) {
    return value;
  }

  const builtUrl = buildMediaUrl(value);
  if (typeof builtUrl === "string" && builtUrl.trim()) {
    return builtUrl.trim();
  }

  if (S3_BASE) {
    return joinUrl(S3_BASE, value);
  }

  return value;
}

function clampRating(value: unknown): number {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0;
  }

  return Math.max(1, Math.min(5, Math.round(numericValue)));
}

function toTeacherReviewUI(api: TeacherReviewApi): TeacherReviewUI {
  return {
    id: safeInt(api?.id),
    rating: clampRating(api?.rating),
    comment: pickNonEmpty(api?.comment) ?? "",
    authorName:
      pickNonEmpty(
        api?.authorName,
        api?.author_name,
        api?.authorLabel,
        api?.author_label
      ) ?? "",
    authorLabel:
      pickNonEmpty(
        api?.authorLabel,
        api?.author_label,
        api?.authorName,
        api?.author_name
      ) ?? "",
    childId: safeNullableNumber(api?.child_id),
    levelId: safeNullableNumber(api?.levelId ?? api?.level_id),
    levelName: pickNonEmpty(api?.levelName, api?.level_name) ?? null,
    createdAt: pickNonEmpty(api?.created_at) ?? null,
    updatedAt: pickNonEmpty(api?.updated_at) ?? null,
  };
}

function toTeacherOwnReviewUI(
  api: TeacherOwnReviewApi | null | undefined
): TeacherOwnReviewUI | null {
  if (!api) {
    return null;
  }

  return {
    id: safeInt(api?.id),
    rating: clampRating(api?.rating),
    comment: pickNonEmpty(api?.comment) ?? "",
    teacherId: safeNullableNumber(api?.teacher_id),
    childId: safeNullableNumber(api?.child_id),
    createdAt: pickNonEmpty(api?.created_at) ?? null,
    updatedAt: pickNonEmpty(api?.updated_at) ?? null,
  };
}

export function toTeacherUI(api: TeacherApi): TeacherUI {
  const avatarRaw = pickNonEmpty(
    api?.avatar_url,
    api?.avatarUrl,
    api?.avatar_path,
    api?.avatarPath,
    api?.avatar
  );

  const trailerRaw = pickNonEmpty(api?.trailer_url, api?.trailerUrl);

  const trailerThumbnailRaw = pickNonEmpty(
    api?.trailer_thumbnail,
    api?.trailerThumbnail
  );

  const fullName = pickNonEmpty(api?.full_name, api?.fullName, api?.name);

  const about = pickNonEmpty(
    api?.about,
    api?.teacher_profile?.about,
    api?.teacherProfile?.about
  );

  const bio = pickNonEmpty(
    api?.bio,
    api?.teacher_profile?.bio,
    api?.teacherProfile?.bio
  );

  const education = pickNonEmpty(
    api?.education,
    api?.teacher_profile?.education,
    api?.teacherProfile?.education
  );

  const experience = pickNonEmpty(
    api?.experience,
    api?.teacher_profile?.experience,
    api?.teacherProfile?.experience
  );

  const followersCount = safePositiveOrZeroInt(
    api?.followersCount ?? api?.followers_count,
    0
  );

  const studentsCount = safePositiveOrZeroInt(
    api?.studentsCount ?? api?.students_count,
    followersCount
  );

  const isFollowed = safeBool(api?.isFollowed ?? api?.is_followed, false);

  const reviewsCount = safePositiveOrZeroInt(
    api?.reviewsCount ?? api?.reviews_count ?? api?.ratings_count,
    0
  );

  const ratingAverageRaw = safeNullableNumber(
    api?.ratingAverage ?? api?.rating_average ?? api?.avg_rating
  );

  const ratingAverage =
    ratingAverageRaw !== null && ratingAverageRaw >= 0 ? ratingAverageRaw : null;

  const yearsExperienceRaw = safeNullableNumber(
    api?.yearsExperience ?? api?.years_experience
  );

  const yearsExperience =
    yearsExperienceRaw !== null && yearsExperienceRaw >= 0
      ? yearsExperienceRaw
      : null;

  const publishedLessonsCount = safePositiveOrZeroInt(
    api?.publishedLessonsCount ?? api?.published_lessons_count,
    0
  );

  const reviews = Array.isArray(api?.reviews)
    ? api.reviews
        .map(toTeacherReviewUI)
        .filter((item) => item.id > 0 && item.rating > 0)
    : [];

  const myReview = toTeacherOwnReviewUI(api?.myReview ?? api?.my_review ?? null);

  return {
    id: safeInt(api?.id),
    fullName: fullName ?? "",

    about,
    bio,
    education,
    experience,

    avatarUrl: resolveMediaUrl(avatarRaw),

    trailerUrl: resolveMediaUrl(trailerRaw),
    trailerThumbnail: resolveMediaUrl(trailerThumbnailRaw),
    trailerMimeType: pickNonEmpty(
      api?.trailerMimeType,
      api?.trailer_mime_type
    ),

    subjectName:
      pickNonEmpty(
        api?.subjectName,
        api?.subject_name,
        api?.materialName,
        api?.material_name
      ) ?? null,

    materialName:
      pickNonEmpty(
        api?.materialName,
        api?.material_name,
        api?.subjectName,
        api?.subject_name
      ) ?? null,

    followersCount,
    studentsCount,
    isFollowed,

    reviewsCount,
    ratingAverage,

    yearsExperience,
    publishedLessonsCount,

    levels: Array.isArray(api?.levels)
      ? api.levels.map((level) => ({
          id: safeInt(level?.id),
          name: String(level?.name ?? "").trim(),
          nameAr:
            level?.nameAr != null
              ? String(level.nameAr)
              : level?.name_ar != null
                ? String(level.name_ar)
                : null,
        }))
      : [],

    materials: Array.isArray(api?.materials)
      ? api.materials.map((material) => ({
          id: safeInt(material?.id),
          name: String(material?.name ?? "").trim(),
          nameAr:
            material?.nameAr != null
              ? String(material.nameAr)
              : material?.name_ar != null
                ? String(material.name_ar)
                : null,
          title: pickNonEmpty(material?.title, material?.name) ?? null,
          titleAr:
            pickNonEmpty(
              material?.titleAr,
              material?.title_ar,
              material?.nameAr,
              material?.name_ar
            ) ?? null,
        }))
      : [],

    books: Array.isArray(api?.books)
      ? api.books.map((book) => ({
          id: safeInt(book?.id),
          title: pickNonEmpty(book?.title, book?.name) ?? "",
          titleAr: pickNonEmpty(book?.titleAr, book?.title_ar) ?? null,
          name: pickNonEmpty(book?.name, book?.title) ?? null,
          nameAr: pickNonEmpty(book?.nameAr, book?.name_ar) ?? null,
        }))
      : [],

    reviews,
    myReview,
  };
}

export function toTeacherFollowerUI(api: TeacherFollowerApi): TeacherFollowerUI {
  const avatarRaw = pickNonEmpty(
    api?.avatar_url,
    api?.avatarUrl,
    api?.avatar_path,
    api?.avatarPath,
    api?.avatar
  );

  const fullName = pickNonEmpty(api?.full_name, api?.fullName, api?.name);

  return {
    id: safeInt(api?.id),
    fullName: fullName ?? "",
    avatarUrl: resolveMediaUrl(avatarRaw),
  };
}

export function toFollowTeacherPayloadUI(
  api: FollowTeacherPayloadApi | null | undefined
): FollowTeacherPayloadUI {
  if (typeof api === "boolean") {
    return {
      teacherId: 0,
      childId: 0,
      isFollowed: api,
      followersCount: null,
    };
  }

  return {
    teacherId: safeInt(api?.teacher_id),
    childId: safeInt(api?.child_id),
    isFollowed: safeBool(
      api?.is_followed ??
        api?.isFollowed ??
        api?.followed ??
        api?.is_following ??
        api?.following,
      false
    ),
    followersCount: safeNullableNumber(
      api?.followers_count ?? api?.followersCount
    ),
  };
}

export function toSaveTeacherReviewPayloadUI(
  api: SaveTeacherReviewPayloadApi | undefined | null
): SaveTeacherReviewPayloadUI {
  return {
    teacherId: safeInt(api?.teacher_id),
    childId: safeInt(api?.child_id),
    isCreated: safeBool(api?.is_created, false),
    review: toTeacherOwnReviewUI(api?.review),
    reviewsCount: safePositiveOrZeroInt(api?.reviews_count, 0),
    ratingAverage: safeNullableNumber(api?.rating_average),
  };
}