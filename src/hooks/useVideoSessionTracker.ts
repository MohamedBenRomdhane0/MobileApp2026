import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import type { VideoPlayer } from "expo-video";

import {
  useEndVideoSessionMutation,
  useStartVideoSessionMutation,
  useUpdateVideoSessionProgressMutation,
} from "@redux/apis/videos/videoSessionApi";

type PlaybackStatus = {
  isLoaded: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  isBuffering: boolean;
  didJustFinish: boolean;
};

type UseVideoSessionTrackerArgs = {
  videoId: number;
  videoDurationMillis: number;
  playerRef: React.RefObject<VideoPlayer | null>;
  enabled?: boolean;
  heartbeatMs?: number;
};

type UseVideoSessionTrackerResult = {
  onPlaybackStatusUpdate: (status: PlaybackStatus) => void;
  onVideoLoad: (status: PlaybackStatus) => void;
  flushProgress: () => Promise<void>;
  endTrackingSession: () => Promise<void>;
  isSessionLoading: boolean;
  canWatch: boolean;
  isAccessBlocked: boolean;
  requiresSubscription: boolean;
  trialEnabled: boolean;
  trialExhausted: boolean;
  trialRemainingSeconds: number;
  totalWatchedSeconds: number;
  sessionReason: string | null;
};

function toSecondsFromMillis(milliseconds: number): number {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return 0;
  }

  return Math.max(0, Math.round((milliseconds / 1000) * 1000) / 1000);
}

export function useVideoSessionTracker({
  videoId,
  videoDurationMillis,
  playerRef,
  enabled = true,
  heartbeatMs = 30_000,
}: UseVideoSessionTrackerArgs): UseVideoSessionTrackerResult {
  const [startVideoSession, { isLoading: isStartingSession }] =
    useStartVideoSessionMutation();
  const [updateVideoSessionProgress] = useUpdateVideoSessionProgressMutation();
  const [endVideoSession] = useEndVideoSessionMutation();

  const [canWatch, setCanWatch] = useState(true);
  const [requiresSubscription, setRequiresSubscription] = useState(false);
  const [trialEnabled, setTrialEnabled] = useState(false);
  const [trialExhausted, setTrialExhausted] = useState(false);
  const [trialRemainingSeconds, setTrialRemainingSeconds] = useState(0);
  const [totalWatchedSeconds, setTotalWatchedSeconds] = useState(0);
  const [sessionReason, setSessionReason] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const isPlayingRef = useRef(false);
  const hasStartedSessionRef = useRef(false);
  const playerLoadedRef = useRef(false);
  const resumeAppliedRef = useRef(false);
  const lastKnownPositionSecRef = useRef(0);
  const lastFlushedPositionSecRef = useRef(-1);
  const pendingResumeSecRef = useRef(0);
  const endingRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const canWatchRef = useRef(true);

  const videoDurationSec = useMemo(
    () => toSecondsFromMillis(videoDurationMillis),
    [videoDurationMillis]
  );

  const applyPendingResume = useCallback(async () => {
    if (
      !enabled ||
      !playerLoadedRef.current ||
      resumeAppliedRef.current ||
      pendingResumeSecRef.current <= 0 ||
      !playerRef.current ||
      !canWatchRef.current
    ) {
      return;
    }

    resumeAppliedRef.current = true;

    try {
      playerRef.current.currentTime = pendingResumeSecRef.current;
    } catch {
      resumeAppliedRef.current = false;
    }
  }, [enabled, playerRef]);

  const flushProgress = useCallback(async () => {
    if (
      !enabled ||
      !hasStartedSessionRef.current ||
      endingRef.current ||
      videoId <= 0 ||
      !canWatchRef.current
    ) {
      return;
    }

    const nextPositionSec = Math.max(0, lastKnownPositionSecRef.current);

    if (Math.abs(nextPositionSec - lastFlushedPositionSecRef.current) < 1) {
      return;
    }

    try {
      const response = await updateVideoSessionProgress({
        videoId,
        currentPositionSec: nextPositionSec,
        ...(videoDurationSec > 0 ? { videoDurationSec } : {}),
      }).unwrap();

      if (!isMountedRef.current) {
        return;
      }

      lastFlushedPositionSecRef.current = nextPositionSec;
      lastKnownPositionSecRef.current = response.data.lastPositionSec;
      setTotalWatchedSeconds(response.data.totalSeconds);
    } catch {
      // noop
    }
  }, [enabled, updateVideoSessionProgress, videoDurationSec, videoId]);

  const endTrackingSession = useCallback(async () => {
    if (
      !enabled ||
      !hasStartedSessionRef.current ||
      endingRef.current ||
      videoId <= 0
    ) {
      return;
    }

    endingRef.current = true;

    try {
      const response = await endVideoSession({
        videoId,
        finalPositionSec: Math.max(0, lastKnownPositionSecRef.current),
      }).unwrap();

      if (isMountedRef.current) {
        setTotalWatchedSeconds(response.data.totalSeconds);
      }
    } catch {
      // noop
    } finally {
      hasStartedSessionRef.current = false;
      isPlayingRef.current = false;
      playerLoadedRef.current = false;
      resumeAppliedRef.current = false;
      pendingResumeSecRef.current = 0;
      lastFlushedPositionSecRef.current = -1;
      endingRef.current = false;
    }
  }, [enabled, endVideoSession, videoId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setCanWatch(true);
    canWatchRef.current = true;
    setRequiresSubscription(false);
    setTrialEnabled(false);
    setTrialExhausted(false);
    setTrialRemainingSeconds(0);
    setTotalWatchedSeconds(0);
    setSessionReason(null);

    hasStartedSessionRef.current = false;
    playerLoadedRef.current = false;
    resumeAppliedRef.current = false;
    pendingResumeSecRef.current = 0;
    lastKnownPositionSecRef.current = 0;
    lastFlushedPositionSecRef.current = -1;
    endingRef.current = false;

    if (!enabled || videoId <= 0) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const response = await startVideoSession(videoId).unwrap();

        if (cancelled || !isMountedRef.current) {
          return;
        }

        const {
          canWatch: nextCanWatch,
          requiresSubscription: nextRequiresSubscription,
          trialStatus,
          reason,
          resumeFromSec,
          totalSeconds,
        } = response.data;

        hasStartedSessionRef.current = true;
        canWatchRef.current = nextCanWatch;

        setCanWatch(nextCanWatch);
        setRequiresSubscription(nextRequiresSubscription);
        setTrialEnabled(Boolean(trialStatus?.trialEnabled ?? false));
        setTrialExhausted(Boolean(trialStatus?.trialExhausted ?? false));
        setTrialRemainingSeconds(
          Math.max(0, trialStatus?.remainingSeconds ?? 0)
        );
        setTotalWatchedSeconds(Math.max(0, totalSeconds));
        setSessionReason(reason);

        pendingResumeSecRef.current = Math.max(0, resumeFromSec);
        lastKnownPositionSecRef.current = Math.max(0, resumeFromSec);

        if (!nextCanWatch) {
          try {
            playerRef.current?.pause();
          } catch {
            // noop
          }
        }

        await applyPendingResume();
      } catch {
        if (!cancelled && isMountedRef.current) {
          setCanWatch(true);
          canWatchRef.current = true;
          setRequiresSubscription(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      void endTrackingSession();
    };
  }, [applyPendingResume, enabled, endTrackingSession, playerRef, startVideoSession, videoId]);

  useEffect(() => {
    if (!enabled || videoId <= 0) {
      return;
    }

    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      const movedToBackground =
        previousState === "active" &&
        (nextState === "inactive" || nextState === "background");

      if (movedToBackground) {
        void flushProgress();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [enabled, flushProgress, videoId]);

  useEffect(() => {
    if (!enabled || videoId <= 0) {
      return;
    }

    const timer = setInterval(() => {
      if (isPlayingRef.current) {
        void flushProgress();
      }
    }, heartbeatMs);

    return () => {
      clearInterval(timer);
    };
  }, [enabled, flushProgress, heartbeatMs, videoId]);

  useEffect(() => {
    if (!enabled || !trialEnabled || trialExhausted || !canWatch) {
      return;
    }

    const countdown = setInterval(() => {
      if (!isPlayingRef.current) {
        return;
      }

      setTrialRemainingSeconds((previousState) => {
        const nextValue = Math.max(0, previousState - 1);
        return nextValue;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [canWatch, enabled, trialEnabled, trialExhausted]);

  useEffect(() => {
    if (trialRemainingSeconds <= 0 && trialEnabled) {
      setTrialExhausted(true);
    }
  }, [trialEnabled, trialRemainingSeconds]);

  const onVideoLoad = useCallback(
    (status: PlaybackStatus) => {
      if (!status.isLoaded) {
        return;
      }

      playerLoadedRef.current = true;
      void applyPendingResume();
    },
    [applyPendingResume]
  );

  const onPlaybackStatusUpdate = useCallback(
    (status: PlaybackStatus) => {
      if (!status.isLoaded) {
        return;
      }

      const nextPositionSec = Math.max(
        0,
        toSecondsFromMillis(Number(status.positionMillis ?? 0))
      );

      lastKnownPositionSecRef.current = nextPositionSec;
      isPlayingRef.current = Boolean(status.isPlaying);

      if (!status.isPlaying && hasStartedSessionRef.current && canWatchRef.current) {
        void flushProgress();
      }

      if (status.didJustFinish) {
        lastKnownPositionSecRef.current =
          videoDurationSec > 0 ? videoDurationSec : nextPositionSec;
        void endTrackingSession();
      }
    },
    [endTrackingSession, flushProgress, videoDurationSec]
  );

  return {
    onPlaybackStatusUpdate,
    onVideoLoad,
    flushProgress,
    endTrackingSession,
    isSessionLoading: isStartingSession,
    canWatch,
    isAccessBlocked: !canWatch,
    requiresSubscription,
    trialEnabled,
    trialExhausted,
    trialRemainingSeconds,
    totalWatchedSeconds,
    sessionReason,
  };
}