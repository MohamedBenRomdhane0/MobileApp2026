<?php

namespace App\Repositories;

use App\Models\VideoSession;
use App\Models\VideoWatchStat;
use App\Models\Media;
use App\Models\UserTrialStatus;
use App\Models\TrialSetting;
use App\Models\Book;
use App\Models\Course;
use App\Models\PlanAccessibleEntity;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class VideoSessionRepository
{
    public static function startSession(int $userId, string $videoId): array
    {
        $session = VideoSession::updateOrCreate(
            [
                'user_id' => $userId,
                'video_id' => $videoId,
            ],
            [
                'last_synced_at' => now(),
            ]
        );

        $media = Media::find($videoId);
        if (!$media) {
            throw new \Exception('Media not found');
        }

        $accessCheck = self::canUserWatchMedia($userId, $media);
        $trialStatus = self::getUserTrialStatus($userId);

        return [
            //TODO:: make 'can_watch' => $accessCheck['can_watch'] when start the module of subscription
            'session' => $session,
            'can_watch' => 1,
            'reason' => $accessCheck['reason'],
            'requires_subscription' => $accessCheck['requires_subscription'] ?? false,
            'trial_status' => $trialStatus,
            'resume_from_sec' => $session->last_position_sec,
        ];
    }

    public static function updateProgress(
        int $userId,
        string $videoId,
        float $currentPositionSec,
        ?float $videoDurationSec = null
    ): VideoSession {
        $session = VideoSession::where('user_id', $userId)
            ->where('video_id', $videoId)
            ->firstOrFail();

        $watchSegments = $session->watch_segments ?? [];
        
        $newWatchTime = self::calculateNewWatchTime(
            $watchSegments,
            $session->last_position_sec,
            $currentPositionSec
        );

        if ($newWatchTime > 0) {
            $watchSegments = self::mergeSegments($watchSegments, [
                'start' => $session->last_position_sec,
                'end' => $currentPositionSec,
            ]);
        }

        $session->update([
            'watch_segments' => $watchSegments,
            'total_seconds' => $session->total_seconds + $newWatchTime,
            'last_position_sec' => $currentPositionSec,
            'last_synced_at' => now(),
        ]);

        if ($newWatchTime > 0) {
            self::updateUserTrialStatus($userId, $newWatchTime);
        }

        self::updateVideoWatchStats($videoId, $videoDurationSec);

        $session = $session->fresh();
        
        if ($videoDurationSec && $videoDurationSec > 0) {
            $session->completion_percentage = min(100, ($session->total_seconds / $videoDurationSec) * 100);
        }

        return $session;
    }

    public static function endSession(int $userId, string $videoId, float $finalPositionSec): VideoSession
    {
        $session = VideoSession::where('user_id', $userId)
            ->where('video_id', $videoId)
            ->firstOrFail();

        $watchSegments = $session->watch_segments ?? [];
        
        $newWatchTime = self::calculateNewWatchTime(
            $watchSegments,
            $session->last_position_sec,
            $finalPositionSec
        );

        if ($newWatchTime > 0) {
            $watchSegments = self::mergeSegments($watchSegments, [
                'start' => $session->last_position_sec,
                'end' => $finalPositionSec,
            ]);
        }

        $session->update([
            'watch_segments' => $watchSegments,
            'total_seconds' => $session->total_seconds + $newWatchTime,
            'last_position_sec' => $finalPositionSec,
            'last_synced_at' => now(),
        ]);

        if ($newWatchTime > 0) {
            self::updateUserTrialStatus($userId, $newWatchTime);
        }

        self::updateVideoWatchStats($videoId);

        return $session->fresh();
    }

    public static function getSessionProgress(int $userId, string $videoId, ?float $videoDurationSec = null): array
    {
        $session = VideoSession::where('user_id', $userId)
            ->where('video_id', $videoId)
            ->first();

        if (!$session) {
            return [
                'session' => null,
                'completion_percentage' => 0,
                'resume_from_sec' => 0,
            ];
        }

        $completionPct = 0;
        if ($videoDurationSec && $videoDurationSec > 0) {
            $completionPct = min(100, ($session->total_seconds / $videoDurationSec) * 100);
        }

        return [
            'session' => $session,
            'completion_percentage' => round($completionPct, 2),
            'resume_from_sec' => $session->last_position_sec,
        ];
    }

    private static function calculateNewWatchTime(
        array $watchSegments,
        float $lastPosition,
        float $currentPosition
    ): int {
        if ($currentPosition <= $lastPosition) {
            return 0;
        }

        $segmentDuration = $currentPosition - $lastPosition;
        
        if ($segmentDuration > 30) {
            return 0;
        }

        $alreadyWatched = self::isSegmentAlreadyWatched(
            $watchSegments,
            $lastPosition,
            $currentPosition
        );

        if ($alreadyWatched) {
            return 0;
        }

        return (int) round($segmentDuration);
    }

    private static function isSegmentAlreadyWatched(
        array $watchSegments,
        float $start,
        float $end
    ): bool {
        foreach ($watchSegments as $segment) {
            if ($start >= $segment['start'] && $end <= $segment['end']) {
                return true;
            }
        }
        return false;
    }

    private static function mergeSegments(array $segments, array $newSegment): array
    {
        $segments[] = $newSegment;
        
        usort($segments, fn($a, $b) => $a['start'] <=> $b['start']);

        $merged = [];
        $current = null;

        foreach ($segments as $segment) {
            if ($current === null) {
                $current = $segment;
                continue;
            }

            if ($segment['start'] <= $current['end']) {
                $current['end'] = max($current['end'], $segment['end']);
            } else {
                $merged[] = $current;
                $current = $segment;
            }
        }

        if ($current !== null) {
            $merged[] = $current;
        }

        return $merged;
    }

    private static function updateVideoWatchStats(string $videoId, ?float $videoDurationSec = null): void
    {
        try {
            $sessions = VideoSession::where('video_id', $videoId)->get();

            $totalSeconds = $sessions->sum('total_seconds');
            $uniqueViewers = $sessions->count();

            $avgCompletionPct = 0;
            if ($videoDurationSec && $videoDurationSec > 0 && $uniqueViewers > 0) {
                $totalCompletionPct = $sessions->sum(function ($session) use ($videoDurationSec) {
                    return min(100, ($session->total_seconds / $videoDurationSec) * 100);
                });
                $avgCompletionPct = $totalCompletionPct / $uniqueViewers;
            }

            VideoWatchStat::updateOrCreate(
                ['video_id' => $videoId],
                [
                    'total_seconds_all_users' => $totalSeconds,
                    'unique_viewers' => $uniqueViewers,
                    'avg_completion_pct' => round($avgCompletionPct, 2),
                    'last_updated_at' => now(),
                ]
            );

            $media = Media::find($videoId);
            if ($media && $media->metadata) {
                $media->metadata->update([
                    'watch_time' => $totalSeconds,
                    'views' => $uniqueViewers,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to update video watch stats', [
                'video_id' => $videoId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public static function getUserVideoStats(int $userId): array
    {
        $sessions = VideoSession::where('user_id', $userId)->get();

        return [
            'total_videos_watched' => $sessions->count(),
            'total_minutes_watched' => $sessions->sum(fn($s) => $s->total_minutes),
            'total_seconds_watched' => $sessions->sum('total_seconds'),
        ];
    }

    public static function getVideoStats(string $videoId): ?VideoWatchStat
    {
        return VideoWatchStat::where('video_id', $videoId)->first();
    }

    public static function canUserWatchMedia(int $userId, Media $media): array
    {
        $isVideo = $media->media_type === 'video';
        
        if (!$isVideo) {
            $hasAccess = self::userHasPlanAccessToMedia($userId, $media);
            return [
                'can_watch' => $hasAccess,
                'reason' => $hasAccess ? 'plan_access' : 'requires_plan_subscription',
                'requires_subscription' => !$hasAccess,
            ];
        }

        $hasAccess = self::userHasPlanAccessToMedia($userId, $media);
        
        if ($hasAccess) {
            return [
                'can_watch' => true,
                'reason' => 'plan_subscribed',
                'requires_subscription' => false,
            ];
        }

        $trialSettings = self::getTrialSettings();
        
        if (!$trialSettings->trial_enabled) {
            return [
                'can_watch' => false,
                'reason' => 'trial_disabled_requires_subscription',
                'requires_subscription' => true,
            ];
        }

        $trialStatus = UserTrialStatus::where('user_id', $userId)->first();
        $freeTrialSeconds = $trialSettings->free_trial_seconds;

        if (!$trialStatus) {
            return [
                'can_watch' => true,
                'reason' => 'free_trial_available',
                'requires_subscription' => false,
            ];
        }

        if ($trialStatus->total_watched_seconds >= $freeTrialSeconds) {
            return [
                'can_watch' => false,
                'reason' => 'trial_exhausted_requires_subscription',
                'watched_seconds' => $trialStatus->total_watched_seconds,
                'limit_seconds' => $freeTrialSeconds,
                'requires_subscription' => true,
            ];
        }

        return [
            'can_watch' => true,
            'reason' => 'free_trial_active',
            'remaining_seconds' => $freeTrialSeconds - $trialStatus->total_watched_seconds,
            'requires_subscription' => false,
        ];
    }

    private static function updateUserTrialStatus(int $userId, int $secondsWatched): void
    {
        $trialStatus = UserTrialStatus::firstOrCreate(
            ['user_id' => $userId],
            [
                'total_watched_seconds' => 0,
                'trial_exhausted' => false,
                'is_subscribed' => false,
            ]
        );

        $trialStatus->increment('total_watched_seconds', $secondsWatched);

        $trialSettings = self::getTrialSettings();
        $freeTrialSeconds = $trialSettings->free_trial_seconds;

        if (!$trialStatus->trial_exhausted && $trialStatus->total_watched_seconds >= $freeTrialSeconds) {
            $trialStatus->update([
                'trial_exhausted' => true,
                'exhausted_at' => now(),
            ]);
        }
    }

    private static function getUserTrialStatus(int $userId): array
    {
        $trialStatus = UserTrialStatus::where('user_id', $userId)->first();
        $trialSettings = self::getTrialSettings();
        $freeTrialSeconds = $trialSettings->free_trial_seconds;

        if (!$trialStatus) {
            return [
                'total_watched_seconds' => 0,
                'total_watched_minutes' => 0,
                'trial_exhausted' => false,
                'is_subscribed' => false,
                'remaining_seconds' => $freeTrialSeconds,
                'remaining_minutes' => round($freeTrialSeconds / 60, 1),
                'trial_enabled' => $trialSettings->trial_enabled,
            ];
        }

        $remainingSeconds = max(0, $freeTrialSeconds - $trialStatus->total_watched_seconds);

        return [
            'total_watched_seconds' => $trialStatus->total_watched_seconds,
            'total_watched_minutes' => round($trialStatus->total_watched_seconds / 60, 1),
            'trial_exhausted' => $trialStatus->trial_exhausted,
            'is_subscribed' => $trialStatus->is_subscribed,
            'remaining_seconds' => $remainingSeconds,
            'remaining_minutes' => round($remainingSeconds / 60, 1),
            'exhausted_at' => $trialStatus->exhausted_at,
            'trial_enabled' => $trialSettings->trial_enabled,
        ];
    }

    private static function getTrialSettings(): TrialSetting
    {
        return Cache::remember('trial_settings', 3600, function () {
            return TrialSetting::firstOrCreate(
                [],
                [
                    'free_trial_seconds' => 1200,
                    'trial_enabled' => true,
                ]
            );
        });
    }

    private static function userHasPlanAccessToMedia(int $userId, Media $media): bool
    {
        if (!$media->model_type || !$media->model_id) {
            return false;
        }

        $entityType = $media->model_type;
        $entityId = $media->model_id;

        if ($entityType === Book::class) {
            $book = Book::find($entityId);
            if (!$book || !$book->level_material_id) {
                return false;
            }
            $materialId = $book->levelMaterial->material_id ?? null;
        } elseif ($entityType === Course::class) {
            $course = Course::find($entityId);
            if (!$course) {
                return false;
            }
            $materialId = $course->material_id ?? null;
        } else {
            return false;
        }

        if (!$materialId) {
            return false;
        }

        $hasAccess = PlanAccessibleEntity::where('accessible_type', $entityType)
            ->where('accessible_id', $entityId)
            ->where('material_id', $materialId)
            ->whereHas('plan.pricings', function ($query) use ($userId) {
                $query->whereHas('subscriptions', function ($subQuery) use ($userId) {
                    $subQuery->where('user_id', $userId)
                        ->where('status', 'active')
                        ->where('expires_at', '>', now());
                });
            })
            ->exists();

        return $hasAccess;
    }
}
