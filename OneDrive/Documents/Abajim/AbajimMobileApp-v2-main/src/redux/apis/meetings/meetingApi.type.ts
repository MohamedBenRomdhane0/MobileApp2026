import type { MeetingStatusEnum } from "@config/enums/MeetingStatus.enum";

export type MeetingOrderBy =
  | "id"
  | "name"
  | "price"
  | "created_at"
  | "updated_at";

export type MeetingDirection = "asc" | "desc";

export interface ApiSuccess<T> {
  message: string;
  data: T;
}

export interface ApiCollectionResponse<T> {
  message: string;
  data: T[];
}

export interface ApiPaginatedCollectionMeta {
  current_page: number;
  from?: number | null;
  last_page: number;
  path?: string;
  per_page: number;
  to?: number | null;
  total: number;
  links?: Array<{ url?: string | null; label?: string; active?: boolean }>;
}

export interface ApiPaginatedCollectionLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface ApiPaginatedCollectionResponse<T>
  extends ApiCollectionResponse<T> {
  meta: ApiPaginatedCollectionMeta;
  links?: ApiPaginatedCollectionLinks;
}

export type MeetingsCollectionApiResponse =
  | ApiCollectionResponse<MeetingApi>
  | ApiPaginatedCollectionResponse<MeetingApi>;

export interface GetMeetingsArgs {
  page?: number;
  perPage?: number;
  keyword?: string;
  materialId?: number;
  teacherId?: number;
  hasFreeTrial?: boolean;
  pagination?: boolean;
  orderBy?: MeetingOrderBy;
  direction?: MeetingDirection;
}

export interface MeetingTeacherApi {
  id?: number | string | null;
  full_name?: string | null;
  fullName?: string | null;
}

export interface MeetingLevelApi {
  id?: number | string | null;
  name?: string | null;
}

export interface MeetingMaterialApi {
  id?: number | string | null;
  name?: string | null;
}

export interface MeetingTimeApi {
  id?: number | string | null;
  group_id?: number | string | null;
  groupId?: number | string | null;
  meeting_date?: string | null;
  meetingDate?: string | null;
  start_time?: string | null;
  startTime?: string | null;
  end_time?: string | null;
  endTime?: string | null;
  status?: string | null;
  reschedule_details?: unknown;
  rescheduleDetails?: unknown;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MeetingGroupApi {
  id?: number | string | null;
  meeting_id?: number | string | null;
  meetingId?: number | string | null;
  name?: string | null;
  sessions_per_week?: number | string | null;
  sessionsPerWeek?: number | string | null;
  meeting_times?: MeetingTimeApi[] | null;
  meetingTimes?: MeetingTimeApi[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MeetingApi {
  id?: number | string | null;
  name?: string | null;
  description?: string | null;

  level_id?: number | string | null;
  levelId?: number | string | null;
  level_name?: string | null;
  levelName?: string | null;

  material_id?: number | string | null;
  materialId?: number | string | null;
  material_name?: string | null;
  materialName?: string | null;

  teacher_id?: number | string | null;
  teacherId?: number | string | null;
  teacher_name?: string | null;
  teacherName?: string | null;

  is_private?: boolean | number | string | null;
  isPrivate?: boolean | number | string | null;

  max_students?: number | string | null;
  maxStudents?: number | string | null;

  has_free_trial?: boolean | number | string | null;
  hasFreeTrial?: boolean | number | string | null;

  total_sessions?: number | string | null;
  totalSessions?: number | string | null;

  price?: number | string | null;
  discount?: number | string | null;
  final_price?: number | string | null;
  finalPrice?: number | string | null;

  has_discount?: boolean | number | string | null;
  hasDiscount?: boolean | number | string | null;

  groups_count?: number | string | null;
  groupsCount?: number | string | null;

  upcoming_sessions_count?: number | string | null;
  upcomingSessionsCount?: number | string | null;

  next_session_at?: string | null;
  nextSessionAt?: string | null;

  status?: MeetingStatusEnum | string | null;
  timezone?: string | null;

  created_at?: string | null;
  updated_at?: string | null;

  level?: MeetingLevelApi | null;
  material?: MeetingMaterialApi | null;
  teacher?: MeetingTeacherApi | null;

  meeting_groups?: MeetingGroupApi[] | null;
  meetingGroups?: MeetingGroupApi[] | null;
}

export interface MeetingTimeUI {
  id: number;
  groupId: number | null;
  meetingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  rescheduleDetails: unknown | null;
  startsAt: string | null;
  endsAt: string | null;
}

export interface MeetingGroupUI {
  id: number;
  meetingId: number | null;
  name: string;
  sessionsPerWeek: number;
  meetingTimes: MeetingTimeUI[];
}

export interface ScheduleLineUI {
  day: string;
  time: string;
  duration: string;
}

export interface MeetingListItemUI {
  id: number;
  name: string;

  levelId: number | null;
  levelName: string;

  materialId: number | null;
  materialName: string;

  teacherId: number | null;
  teacherName: string;

  isPrivate: boolean;
  maxStudents: number | null;
  hasFreeTrial: boolean;
  totalSessions: number;

  price: number;
  discount: number;
  finalPrice: number;
  hasDiscount: boolean;

  groupsCount: number;
  upcomingSessionsCount: number;
  nextSessionAt: string | null;

  status: MeetingStatusEnum | string;
  timezone: string;

  createdAt: string | null;
  updatedAt: string | null;
}

export interface MeetingDetailsUI extends MeetingListItemUI {
  description: string | null;
  meetingGroups: MeetingGroupUI[];
  scheduleLines: ScheduleLineUI[];
}

export interface MeetingsListPayloadUI {
  items: MeetingListItemUI[];
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  hasNextPage: boolean;
}