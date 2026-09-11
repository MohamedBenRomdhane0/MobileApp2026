export type ApiSuccess<T> = {
  message: string;
  data: T;
};

export type ApiMeta = {
  current_page?: number;
  per_page?: number;
  total?: number;
};

export type ApiPaginated<T> = {
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type TeacherLevelApi = {
  id?: number | string | null;
  name?: string | null;
  name_ar?: string | null;
  nameAr?: string | null;
};

export type TeacherMaterialApi = {
  id?: number | string | null;
  name?: string | null;
  name_ar?: string | null;
  nameAr?: string | null;
  title?: string | null;
  title_ar?: string | null;
  titleAr?: string | null;
};

export type TeacherBookApi = {
  id?: number | string | null;
  title?: string | null;
  title_ar?: string | null;
  titleAr?: string | null;
  name?: string | null;
  name_ar?: string | null;
  nameAr?: string | null;
};

export type TeacherReviewApi = {
  id?: number | string | null;
  rating?: number | string | null;
  comment?: string | null;

  author_name?: string | null;
  authorName?: string | null;
  author_label?: string | null;
  authorLabel?: string | null;

  child_id?: number | string | null;

  level_id?: number | string | null;
  levelId?: number | string | null;
  level_name?: string | null;
  levelName?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

export type TeacherOwnReviewApi = {
  id?: number | string | null;
  rating?: number | string | null;
  comment?: string | null;
  teacher_id?: number | string | null;
  child_id?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TeacherApi = {
  id?: number | string | null;

  full_name?: string | null;
  fullName?: string | null;
  name?: string | null;

  about?: string | null;
  bio?: string | null;
  education?: string | null;
  experience?: string | null;

  teacher_profile?: {
    about?: string | null;
    bio?: string | null;
    education?: string | null;
    experience?: string | null;
  } | null;

  teacherProfile?: {
    about?: string | null;
    bio?: string | null;
    education?: string | null;
    experience?: string | null;
  } | null;

  avatar_url?: string | null;
  avatarUrl?: string | null;
  avatar_path?: string | null;
  avatarPath?: string | null;
  avatar?: string | null;

  trailer_url?: string | null;
  trailerUrl?: string | null;
  trailer_thumbnail?: string | null;
  trailerThumbnail?: string | null;
  trailer_mime_type?: string | null;
  trailerMimeType?: string | null;

  subject_name?: string | null;
  subjectName?: string | null;
  material_name?: string | null;
  materialName?: string | null;

  followers_count?: number | string | null;
  followersCount?: number | string | null;

  students_count?: number | string | null;
  studentsCount?: number | string | null;

  is_followed?: boolean | number | string | null;
  isFollowed?: boolean | number | string | null;

  reviews_count?: number | string | null;
  reviewsCount?: number | string | null;
  ratings_count?: number | string | null;

  rating_average?: number | string | null;
  ratingAverage?: number | string | null;
  avg_rating?: number | string | null;

  years_experience?: number | string | null;
  yearsExperience?: number | string | null;

  published_lessons_count?: number | string | null;
  publishedLessonsCount?: number | string | null;

  extra_lessons_count?: number | string | null;

  levels?: TeacherLevelApi[];
  materials?: TeacherMaterialApi[];
  books?: TeacherBookApi[];

  reviews?: TeacherReviewApi[];
  my_review?: TeacherOwnReviewApi | null;
  myReview?: TeacherOwnReviewApi | null;
};

export type TeacherReviewUI = {
  id: number;
  rating: number;
  comment: string;
  authorName: string;
  authorLabel: string;
  childId: number | null;
  levelId: number | null;
  levelName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TeacherOwnReviewUI = {
  id: number;
  rating: number;
  comment: string;
  teacherId: number | null;
  childId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TeacherUI = {
  id: number;
  fullName: string;

  about: string | null;
  bio: string | null;
  education: string | null;
  experience: string | null;

  avatarUrl: string | null;

  trailerUrl: string | null;
  trailerThumbnail: string | null;
  trailerMimeType: string | null;

  subjectName: string | null;
  materialName: string | null;

  followersCount: number;
  studentsCount: number;
  isFollowed: boolean;

  reviewsCount: number;
  ratingAverage: number | null;

  yearsExperience: number | null;
  publishedLessonsCount: number;

  levels: Array<{ id: number; name: string; nameAr: string | null }>;
  materials: Array<{
    id: number;
    name: string;
    nameAr: string | null;
    title: string | null;
    titleAr: string | null;
  }>;
  books: Array<{
    id: number;
    title: string;
    titleAr: string | null;
    name: string | null;
    nameAr: string | null;
  }>;

  reviews: TeacherReviewUI[];
  myReview: TeacherOwnReviewUI | null;
};

export type TeacherFollowerApi = {
  id?: number | string | null;
  full_name?: string | null;
  fullName?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  avatar_path?: string | null;
  avatarPath?: string | null;
  avatar?: string | null;
};

export type TeacherFollowerUI = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
};

export type FollowTeacherPayloadApi =
  | boolean
  | {
      teacher_id?: number | string | null;
      child_id?: number | string | null;
      is_followed?: boolean | number | string | null;
      isFollowed?: boolean | number | string | null;
      followed?: boolean | number | string | null;
      is_following?: boolean | number | string | null;
      following?: boolean | number | string | null;
      followers_count?: number | string | null;
      followersCount?: number | string | null;
    };

export type FollowTeacherPayloadUI = {
  teacherId: number;
  childId: number;
  isFollowed: boolean;
  followersCount: number | null;
};

export type SaveTeacherReviewPayloadApi = {
  teacher_id?: number | string | null;
  child_id?: number | string | null;
  is_created?: boolean | number | string | null;
  review?: TeacherOwnReviewApi | null;
  reviews_count?: number | string | null;
  rating_average?: number | string | null;
};

export type SaveTeacherReviewPayloadUI = {
  teacherId: number;
  childId: number;
  isCreated: boolean;
  review: TeacherOwnReviewUI | null;
  reviewsCount: number;
  ratingAverage: number | null;
};

export type SaveTeacherReviewArgs = {
  teacherId: number;
  rating: number;
  comment?: string | null;
};

export type GetTeacherFollowersArgs = {
  teacherId: number;
  page?: number;
  perPage?: number;
};

export type GetTeachersArgs = {
  page?: number;
  perPage?: number;
  materialId?: number;
  childId?: number;
};