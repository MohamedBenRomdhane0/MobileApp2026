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
  childId?: number | null;
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

export interface TeacherDetailApi {
  id: number;
  full_name?: string | null;
  fullName?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  avatar?: string | null;
  about?: string | null;
  bio?: string | null;
}

export interface MeetingTeacherApi {
  id?: number | string | null;
  full_name?: string | null;
  fullName?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
}

export interface MeetingLevelApi {
  id?: number | string | null;
  name?: string | null;
}

export interface MeetingMaterialApi {
  id?: number | string | null;
  name?: string | null;
  color?: string | null;
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

export interface MeetingGroupSubscriptionApi {
  id?: number | string | null;
  cycle_start_date?: string | null;
  cycleStartDate?: string | null;
  cycle_end_date?: string | null;
  cycleEndDate?: string | null;
  status?: string | null;
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
  schedule_days?: number[] | null;
  scheduleDays?: number[] | null;
  start_time?: string | null;
  startTime?: string | null;
  end_time?: string | null;
  endTime?: string | null;
  next_session_at?: string | null;
  nextSessionAt?: string | null;

  is_private?: boolean | null;
  isPrivate?: boolean | null;
  max_students?: number | string | null;
  maxStudents?: number | string | null;
  enrolled_count?: number | string | null;
  enrolledCount?: number | string | null;
  spots_left?: number | string | null;
  spotsLeft?: number | string | null;
  unit_price?: number | string | null;
  unitPrice?: number | string | null;
  discounted_price?: number | string | null;
  discountedPrice?: number | string | null;
  has_discount?: boolean | null;
  hasDiscount?: boolean | null;

  meeting_group_subscriptions?: MeetingGroupSubscriptionApi[] | null;
  meetingGroupSubscriptions?: MeetingGroupSubscriptionApi[] | null;

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
  starting_price?: number | string | null;
  startingPrice?: number | string | null;
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

  groups?: MeetingGroupApi[] | null;
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
  scheduleDays: number[];
  startTime: string;
  endTime: string;
  nextSessionAt: string | null;
  isPrivate: boolean;
  maxStudents: number | null;
  enrolledCount: number | null;
  spotsLeft: number | null;
  unitPrice: number;
  discountedPrice: number;
  hasDiscount: boolean;
  cycleStartDate: string | null;
  cycleEndDate: string | null;
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
  materialColor: string;

  teacherId: number | null;
  teacherName: string;
  teacherAvatarUrl: string | null;

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

  meetingGroups: MeetingGroupUI[];

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

export interface ReservedMeetingTimeMeetingApi {
  id: number;
  name: string;
  status: string;
  timezone: string;
  level_id?: number | null;
  level_name?: string | null;
  material_id?: number | null;
  material_name?: string | null;
  material_color?: string | null;
  teacher_id?: number | null;
  teacher_name?: string | null;
  teacher_avatar_url?: string | null;
  teacher_avatar?: string | null;
}

export interface ReservedMeetingTimeGroupApi {
  id: number;
  name: string;
  sessions_per_week?: number | null;
  sessions_per_day?: number | null;
  unit_price?: number | string | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface ReservedMeetingTimeApi {
  id: number;
  group_id: number;
  meeting_date: string | null;
  start_time: string | null;
  end_time: string | null;
  duration?: number | null;
  day_of_week?: number | null;
  occurrence_in_day?: number | null;
  status: string;
  is_free_trial_session?: boolean | null;
  reschedule_details?: unknown;
  cancellation_reason?: string | null;
  cancellation_comment?: string | null;
  has_supports?: boolean;
  entitlement_status?: string | null;
  meeting?: ReservedMeetingTimeMeetingApi | null;
  group?: ReservedMeetingTimeGroupApi | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ReservedMeetingTimeUI {
  id: number;
  groupId: number;
  meetingDate: string | null;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  dayOfWeek: number | null;
  status: string;
  isFreeTrialSession: boolean;
  hasSupports: boolean;
  entitlementStatus: string | null;
  teacherId: number | null;
  teacherName: string | null;
  teacherAvatarUrl: string | null;
  materialName: string | null;
  materialColor: string | null;
  materialId: number | null;
  meetingName: string | null;
  groupName: string | null;
  startsAt: string | null;
  endsAt: string | null;
}

export interface SubscribeToGroupArgs {
  groupId: number;
  billingCycle?: "monthly" | "yearly";
}

export interface SubscribeToGroupResponse {
  message: string;
  data: {
    id: number;
    child_id: number;
    meeting_group_id: number;
    status: string;
    billing_cycle: string;
    created_at: string;
  };
}