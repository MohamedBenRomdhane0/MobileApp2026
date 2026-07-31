import type {
  EndVideoSessionResponse,
  EndVideoSessionResponseApi,
  GetVideoSessionResponse,
  GetVideoSessionResponseApi,
  StartVideoSessionResponse,
  StartVideoSessionResponseApi,
  TrialStatusApi,
  TrialStatusUI,
  UpdateVideoSessionProgressResponse,
  UpdateVideoSessionProgressResponseApi,
  VideoSessionApi,
  VideoSessionSegmentApi,
  VideoSessionSegmentUI,
  VideoSessionUI,
} from "./videoSessionApi.type";

function toNumber(value: unknown, fallback = 0): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function toPositiveInt(value: unknown, fallback = 0): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0
    ? Math.round(numericValue)
    : fallback;
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
}

function toNullableString(value: unknown): string | null {
  const stringValue = String(value ?? "").trim();
  return stringValue || null;
}

function toSegmentUI(segment: VideoSessionSegmentApi): VideoSessionSegmentUI {
  return {
    start: Math.max(0, toNumber(segment.start, 0)),
    end: Math.max(0, toNumber(segment.end, 0)),
  };
}

function toSegmentsUI(
  segments: VideoSessionSegmentApi[] | null | undefined
): VideoSessionSegmentUI[] {
  if (!Array.isArray(segments)) {
    return [];
  }

  return segments
    .map(toSegmentUI)
    .filter((segment) => segment.end >= segment.start);
}

export function toTrialStatusUI(
  api: TrialStatusApi | null | undefined
): TrialStatusUI | null {
  if (!api) {
    return null;
  }

  return {
    totalWatchedSeconds: Math.max(0, toNumber(api.total_watched_seconds, 0)),
    totalWatchedMinutes: Math.max(0, toNumber(api.total_watched_minutes, 0)),
    remainingSeconds: Math.max(0, toNumber(api.remaining_seconds, 0)),
    remainingMinutes: Math.max(0, toNumber(api.remaining_minutes, 0)),
    trialExhausted: toBoolean(api.trial_exhausted, false),
    trialEnabled: toBoolean(api.trial_enabled, true),
    isSubscribed: toBoolean(api.is_subscribed, false),
    exhaustedAt: toNullableString(api.exhausted_at),
  };
}

export function toVideoSessionUI(
  api: VideoSessionApi | null | undefined
): VideoSessionUI | null {
  if (!api) {
    return null;
  }

  return {
    sessionId: toPositiveInt(api.session_id ?? api.id, 0),
    videoId: String(api.video_id ?? "").trim(),
    lastPositionSec: Math.max(0, toNumber(api.last_position_sec, 0)),
    totalSeconds: Math.max(0, Math.round(toNumber(api.total_seconds, 0))),
    totalMinutes: Math.max(0, toNumber(api.total_minutes, 0)),
    completionPercentage: Math.max(
      0,
      Math.min(100, toNumber(api.completion_percentage, 0))
    ),
    watchSegments: toSegmentsUI(api.watch_segments),
    lastSyncedAt: toNullableString(api.last_synced_at),
  };
}

export function toStartVideoSessionResponse(
  response: StartVideoSessionResponseApi
): StartVideoSessionResponse {
  const data = response.data ?? {};

  return {
    message: response.message,
    data: {
      sessionId: toPositiveInt(data.session_id, 0),
      videoId: String(data.video_id ?? "").trim(),
      resumeFromSec: Math.max(0, toNumber(data.resume_from_sec, 0)),
      totalSeconds: Math.max(0, Math.round(toNumber(data.total_seconds, 0))),
      totalMinutes: Math.max(0, toNumber(data.total_minutes, 0)),
      canWatch: toBoolean(data.can_watch, false),
      reason: toNullableString(data.reason),
      requiresSubscription: toBoolean(data.requires_subscription, false),
      trialStatus: toTrialStatusUI(data.trial_status),
    },
  };
}

export function toGetVideoSessionResponse(
  response: GetVideoSessionResponseApi
): GetVideoSessionResponse {
  const raw = response.data ?? {};
  const nestedSession = toVideoSessionUI(raw.session);

  const fallbackSession =
    nestedSession ??
    toVideoSessionUI({
      session_id: raw.session_id,
      video_id: raw.video_id,
      last_position_sec: raw.last_position_sec,
      total_seconds: raw.total_seconds,
      total_minutes: raw.total_minutes,
      watch_segments: raw.watch_segments,
      completion_percentage: raw.completion_percentage,
      last_synced_at: raw.last_synced_at,
    });

  return {
    message: response.message,
    data: {
      session: fallbackSession,
      resumeFromSec: Math.max(
        0,
        toNumber(raw.resume_from_sec, fallbackSession?.lastPositionSec ?? 0)
      ),
      completionPercentage: Math.max(
        0,
        Math.min(
          100,
          toNumber(
            raw.completion_percentage,
            fallbackSession?.completionPercentage ?? 0
          )
        )
      ),
    },
  };
}

export function toUpdateVideoSessionProgressResponse(
  response: UpdateVideoSessionProgressResponseApi
): UpdateVideoSessionProgressResponse {
  const data = response.data ?? {};

  return {
    message: response.message,
    data: {
      sessionId: toPositiveInt(data.session_id, 0),
      videoId: String(data.video_id ?? "").trim(),
      lastPositionSec: Math.max(0, toNumber(data.last_position_sec, 0)),
      totalSeconds: Math.max(0, Math.round(toNumber(data.total_seconds, 0))),
      totalMinutes: Math.max(0, toNumber(data.total_minutes, 0)),
      completionPercentage: Math.max(
        0,
        Math.min(100, toNumber(data.completion_percentage, 0))
      ),
      watchSegments: toSegmentsUI(data.watch_segments),
      lastSyncedAt: null,
    },
  };
}

export function toEndVideoSessionResponse(
  response: EndVideoSessionResponseApi
): EndVideoSessionResponse {
  const data = response.data ?? {};

  return {
    message: response.message,
    data: {
      sessionId: toPositiveInt(data.session_id, 0),
      videoId: String(data.video_id ?? "").trim(),
      lastPositionSec: Math.max(0, toNumber(data.last_position_sec, 0)),
      totalSeconds: Math.max(0, Math.round(toNumber(data.total_seconds, 0))),
      totalMinutes: Math.max(0, toNumber(data.total_minutes, 0)),
      completionPercentage: 0,
      watchSegments: toSegmentsUI(data.watch_segments),
      lastSyncedAt: toNullableString(data.last_synced_at),
    },
  };
}