export type ApiMedia = {
  id: number;
  model_type?: string | null;
  model_id?: number | null;
  file_name?: string | null;
  mime_type?: string | null;
  file_path?: string | null;
  title?: string | null;
  description?: string | null;
  size?: number | null;
  full_url?: string | null;
  url?: string | null;
};

export type ApiTeacher = {
  id: number;
  full_name?: string | null;
  avatar?: string | null;
};

export type ApiMaterialLite = {
  id: number;
  name?: string | null;
};

export type ApiChapter = {
  id: number;
  title?: string | null;
  description?: string | null;
  order?: number | null;
  media?: ApiMedia[] | null;
  files?: Array<{
    file_type?: string | null;
    type?: string | null;
    file?: string | null;
    url?: string | null;
    path?: string | null;
  }> | null;
};

export type ApiCourse = {
  id: number;
  user_id?: number | null;
  level_id?: number | null;
  material_id?: number | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  type?: number | null;

  media?: ApiMedia[] | null;
  chapters?: ApiChapter[] | null;

  teacher?: ApiTeacher | null;
  user?: ApiTeacher | null;

  material?: ApiMaterialLite | null;

  is_favorite?: boolean | null;

  created_at?: string | null;
  updated_at?: string | null;
};

export type ApiPagination = {
  current_page?: number;
  per_page?: number;
  total?: number;
};

export type ApiListResponse<T> = {
  message?: string;
  data?: T[] | { data?: T[]; meta?: ApiPagination; pagination?: ApiPagination } | any;
  meta?: ApiPagination;
  pagination?: ApiPagination;
};

export type ApiShowResponse<T> = {
  message?: string;
  data?: T;
};

export type CoursesQueryArgs = {
  keyword?: string;
  levelId?: number;
  materialId?: number;
  page?: number;
  perPage?: number;
  orderBy?: string;
  direction?: "asc" | "desc";
};

/** ---------- UI ---------- */

export type CourseTeacherUI = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
};

export type CourseListItemUI = {
  id: number;
  title: string;
  description: string | null;
  coverUrl: string | null;

  teacher: CourseTeacherUI | null;
  materialName: string | null;

  isFavorite: boolean;
};

export type CourseChapterUI = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  videoUrls: string[];
};

export type CourseDetailsUI = CourseListItemUI & {
  chapters: CourseChapterUI[];
};