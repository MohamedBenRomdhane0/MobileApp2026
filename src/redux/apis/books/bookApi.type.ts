export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue | undefined };
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export type ApiListMeta = {
  current_page?: number;
  per_page?: number;
  total?: number;
};

export type SortDirection = "asc" | "desc";

export type BookMediaTag =
  | "book_pdf"
  | "book_cover"
  | "book_video"
  | "book_media"
  | "icon_media"
  | string;

export type MediaMetadataApi = JsonObject & {
  id?: number;
  media_id?: number;
  views?: number | null;
  watch_time?: number | null;
  transcoding_status?: string | null;
  progress?: number | null;
  error_message?: string | null;
  total_chunks?: number | null;
  original_filename?: string | null;
  processing_started_at?: string | null;
  processing_completed_at?: string | null;
  duration?: number | null;
  last_seen_at?: string | null;
  status?: number | null;

  url?: string | null;
  link?: string | null;
  external_url?: string | null;
  externalUrl?: string | null;
  source_url?: string | null;
  sourceUrl?: string | null;
  stream_url?: string | null;
  streamUrl?: string | null;

  thumbnail?: string | null;
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  poster?: string | null;
  poster_url?: string | null;
  posterUrl?: string | null;
  cover?: string | null;
  cover_url?: string | null;
  coverUrl?: string | null;

  mime_type?: string | null;
  media_type?: string | null;
  type?: string | null;
  durationMillis?: number | null;
  duration_ms?: number | null;
};

export type UserApi = {
  id: number;
  full_name?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type MediaApi = {
  id: number;
  creator_id?: number | string | null;
  model_type?: string | null;
  model_id?: number | string | null;
  file_name?: string | null;
  mime_type?: string | null;
  file_path?: string | null;
  file_size?: number | null;
  disk?: string | null;

  tag?: BookMediaTag | null;
  title?: string | null;
  description?: string | null;
  size?: number | null;
  thumbnail?: string | null;

  media_type?: string | null;
  is_external?: number | boolean | null;

  stream_url?: string | null;
  streamUrl?: string | null;
  url?: string | null;
  link?: string | null;
  external_url?: string | null;
  externalUrl?: string | null;
  source_url?: string | null;
  sourceUrl?: string | null;

  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  poster?: string | null;
  poster_url?: string | null;
  posterUrl?: string | null;
  cover?: string | null;
  cover_url?: string | null;
  coverUrl?: string | null;
  thumb?: string | null;
  thumb_url?: string | null;
  thumbUrl?: string | null;

  teacher_name?: string | null;

  metadata?: MediaMetadataApi | null;
  creator?: UserApi | null;
  teacher?: UserApi | null;
  user?: UserApi | null;

  views?: number | string | null;
  view_count?: number | string | null;
  views_count?: number | string | null;

  likes?: number | string | null;
  like_count?: number | string | null;
  likes_count?: number | string | null;

  is_liked?: boolean | number | string | null;
  isLiked?: boolean | number | string | null;
  likes_exists?: boolean | number | string | null;
  likesExists?: boolean | number | string | null;
  duration?: number | string | null;
  duration_ms?: number | string | null;
  durationMillis?: number | string | null;
};

export type MaterialApi = {
  id: number;
  name: string;
  /** Optional accent color sent by the API for this material. */
  color?: string | null;
};

export type LevelApi = {
  id: number;
  name: string;
};

export type LevelMaterialApi = {
  id: number;
  level_id: number;
  material_id: number;
  material?: MaterialApi;
  level?: LevelApi;
};

export type BookIconApi = {
  id: number;
  book_id?: number;
  page?: string | number | null;
  page_number?: number | null;
  x?: number | string | null;
  y?: number | string | null;
  icon_type?: string | null;
  size?: number | null;
};

export type BookTeacherApi = {
  id: number;
  full_name?: string | null;
  fullName?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  avatar?: string | null;
};

export type BookTeacherUI = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
};

export type BookModuleApi = {
  id?: number | null;
  book_id?: number | null;
  title?: string | null;
  start_page?: number | null;
  end_page?: number | null;
  order?: number | null;
  icons_total?: number | null;
  icons_filled?: number | null;
  progress?: number | null;
};

export type BookModuleUI = {
  id: number;
  bookId: number;
  title: string | null;
  startPage: number;
  endPage: number;
  order: number;
  iconsTotal: number;
  iconsFilled: number;
  progress: number;
};

export type BookLastLearningApi = {
  video_id?: number | null;
  icon_id?: number | null;
  module_id?: number | null;
  module_title?: string | null;
  lesson_title?: string | null;
  page_number?: number | null;
  last_position_sec?: number | null;
  total_seconds?: number | null;
  total_minutes?: number | null;
  last_synced_at?: string | null;
};

export type BookLastLearningUI = {
  videoId: number;
  iconId: number;
  moduleId: number | null;
  moduleTitle: string | null;
  lessonTitle: string | null;
  pageNumber: number | null;
  lastPositionSec: number;
  totalSeconds: number;
  totalMinutes: number;
  lastSyncedAt: string | null;
};

export type BookListItemApi = {
  id: number;
  level_material_id: number;
  title: string;
  type: number;
  pages_total: number;
  ingest_status?: string;
  pages_rendered?: number;
  status?: string | number;

  language?: string;
  icons_total_count?: number;
  icons_with_media_count?: number;
  videos_count?: number;
  progress?: number;

  material?: MaterialApi;
  material_id?: number;
  material_name?: string;

  teachers?: BookTeacherApi[];
  teachers_count?: number;

  modules?: BookModuleApi[] | null;
  last_learning?: BookLastLearningApi | null;

  user?: UserApi | null;
  level_material?: LevelMaterialApi;

  media?: MediaApi[];
  icons?: BookIconApi[];
};

export type BookPageApi = {
  id: number;
  book_id: number;
  page_number: number;
  disk?: string | null;
  path_thumb?: string | null;
  path_md?: string | null;
  path_lg?: string | null;
  width?: number | null;
  height?: number | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  checksum?: string | null;
  meta?: JsonObject | JsonValue[] | null;
};

export type BookDetailsApi = {
  id: number;
  level_material_id: number;
  title: string;
  type: number;
  pages_total: number;

  ingest_status?: string;
  pages_rendered?: number;
  status?: string | number;

  user_id?: number | null;
  creator_id?: number | null;
  user?: UserApi | null;

  language?: string;
  is_valid?: number | boolean;
  conversion_status?: string;

  level_material?: LevelMaterialApi;
  media?: MediaApi[];
  icons?: BookIconApi[];
  pages?: BookPageApi[];
  modules?: BookModuleApi[] | null;
};

export type GetBooksQueryArgs = {
  page?: number;
  perPage?: number;
  keyword?: string;
  childId?: number;
  materialId?: number;
  levelId?: number;
  levelMaterialId?: number;
  type?: number;
  orderBy?: string;
  direction?: SortDirection;
};

export type GetBooksResponseApi = {
  message: string;
  data: BookListItemApi[];
  meta?: ApiListMeta;
};

export type GetBookByIdResponseApi = {
  message: string;
  data: BookDetailsApi;
};

export type BookListItemUI = {
  id: number;
  title: string;
  pagesTotal: number;
  videosCount: number;
  progress: number;
  materialName: string;
  /** Optional accent color provided by the API for the book's material. */
  materialColor: string | null;
  coverUrl: string | null;
  teachersCount: number;
  teachers: BookTeacherUI[];
  modules: BookModuleUI[];
  lastLearning: BookLastLearningUI | null;
  type: number;
};

export type BookPageUI = {
  id: number;
  pageNumber: number;
  pathThumb: string | null;
  pathMd: string | null;
  pathLg: string | null;
  width: number | null;
  height: number | null;
};

export type BookIconUI = {
  id: number;
  pageNumber: number;
  xPercent: number;
  yPercent: number;
  size: number;
  iconType: string;
};

export type BookUserUI = {
  id: number;
  fullName: string;
};

export type BookDetailsUI = {
  id: number;
  title: string;
  pagesTotal: number;
  materialName: string;
  coverUrl: string | null;
  pdfUrl: string | null;
  language: string | null;
  pages: BookPageUI[];
  icons: BookIconUI[];
  modules: BookModuleUI[];
  user: BookUserUI | null;
  creatorId: number | null;
};

export type GetBooksResponse = {
  message: string;
  data: BookListItemUI[];
  meta?: ApiListMeta;
};

export type GetBookByIdResponse = {
  message: string;
  data: BookDetailsUI;
};

export type IconVideoApi = MediaApi;

export type GetIconVideosResponse = {
  message?: string;
  data: IconVideoUI[];
  meta?: ApiListMeta;
};

export type IconVideoUI = {
  id: number;
  url: string;
  thumbUrl: string | null;
  mimeType: string | null;
  tag: string | null;
  title: string | null;
  description: string | null;

  creatorId: number;
  teacherName: string | null;

  viewsCount: number;
  likesCount: number;
  isLiked: boolean;
  isVideo: boolean;
  durationMillis: number;
};

export type LikeMediaResponseApi = {
  message?: string;
  data?: JsonValue | null;
};

export type LikeMediaResponse = {
  message?: string;
  data?: JsonValue | null;
};

export type LikeMediaArgs = {
  iconId: number;
  mediaId: number;
};

export type TrackMediaViewArgs = {
  iconId: number;
  mediaId: number;
};

export type TrackMediaViewResponseApi = {
  message?: string;
  data?: {
    media_id?: number;
    counted_as_view?: boolean;
    views?: number;
  };
};

export type TrackMediaViewResponse = {
  message?: string;
  data?: {
    mediaId: number;
    countedAsView: boolean;
    views: number;
  };
};