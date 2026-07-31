export type VideoSessionSegmentApi = {
  start?: number | string | null;
  end?: number | string | null;
};

export type VideoSessionSegmentUI = {
  start: number;
  end: number;
};

export type TrialStatusApi = {
  total_watched_seconds?: number | string | null;
  total_watched_minutes?: number | string | null;
  remaining_seconds?: number | string | null;
  remaining_minutes?: number | string | null;
  trial_exhausted?: boolean | number | string | null;
  trial_enabled?: boolean | number | string | null;
  is_subscribed?: boolean | number | string | null;
  exhausted_at?: string | null;
};

export type TrialStatusUI = {
  totalWatchedSeconds: number;
  totalWatchedMinutes: number;
  remainingSeconds: number;
  remainingMinutes: number;
  trialExhausted: boolean;
  trialEnabled: boolean;
  isSubscribed: boolean;
  exhaustedAt: string | null;
};

export type VideoSessionApi = {
  id?: number | string | null;
  session_id?: number | string | null;
  video_id?: number | string | null;
  last_position_sec?: number | string | null;
  total_seconds?: number | string | null;
  total_minutes?: number | string | null;
  completion_percentage?: number | string | null;
  watch_segments?: VideoSessionSegmentApi[] | null;
  last_synced_at?: string | null;
};

export type VideoSessionUI = {
  sessionId: number;
  videoId: string;
  lastPositionSec: number;
  totalSeconds: number;
  totalMinutes: number;
  completionPercentage: number;
  watchSegments: VideoSessionSegmentUI[];
  lastSyncedAt: string | null;
};

export type StartVideoSessionResponseApi = {
  message?: string;
  data?: {
    session_id?: number | string | null;
    video_id?: number | string | null;
    resume_from_sec?: number | string | null;
    total_seconds?: number | string | null;
    total_minutes?: number | string | null;
    can_watch?: boolean | number | string | null;
    reason?: string | null;
    requires_subscription?: boolean | number | string | null;
    trial_status?: TrialStatusApi | null;
  } | null;
};

export type StartVideoSessionResponse = {
  message?: string;
  data: {
    sessionId: number;
    videoId: string;
    resumeFromSec: number;
    totalSeconds: number;
    totalMinutes: number;
    canWatch: boolean;
    reason: string | null;
    requiresSubscription: boolean;
    trialStatus: TrialStatusUI | null;
  };
};

export type GetVideoSessionResponseApi = {
  message?: string;
  data?: {
    session?: VideoSessionApi | null;
    session_id?: number | string | null;
    video_id?: number | string | null;
    resume_from_sec?: number | string | null;
    last_position_sec?: number | string | null;
    total_seconds?: number | string | null;
    total_minutes?: number | string | null;
    watch_segments?: VideoSessionSegmentApi[] | null;
    completion_percentage?: number | string | null;
    last_synced_at?: string | null;
  } | null;
};

export type GetVideoSessionResponse = {
  message?: string;
  data: {
    session: VideoSessionUI | null;
    resumeFromSec: number;
    completionPercentage: number;
  };
};

export type UpdateVideoSessionProgressArgs = {
  videoId: number | string;
  currentPositionSec: number;
  videoDurationSec?: number;
};

export type UpdateVideoSessionProgressResponseApi = {
  message?: string;
  data?: {
    session_id?: number | string | null;
    video_id?: number | string | null;
    last_position_sec?: number | string | null;
    total_seconds?: number | string | null;
    total_minutes?: number | string | null;
    watch_segments?: VideoSessionSegmentApi[] | null;
    completion_percentage?: number | string | null;
  } | null;
};

export type UpdateVideoSessionProgressResponse = {
  message?: string;
  data: VideoSessionUI;
};

export type EndVideoSessionArgs = {
  videoId: number | string;
  finalPositionSec: number;
};

export type EndVideoSessionResponseApi = {
  message?: string;
  data?: {
    session_id?: number | string | null;
    video_id?: number | string | null;
    total_seconds?: number | string | null;
    total_minutes?: number | string | null;
    watch_segments?: VideoSessionSegmentApi[] | null;
    last_position_sec?: number | string | null;
    last_synced_at?: string | null;
  } | null;
};

export type EndVideoSessionResponse = {
  message?: string;
  data: VideoSessionUI;
};