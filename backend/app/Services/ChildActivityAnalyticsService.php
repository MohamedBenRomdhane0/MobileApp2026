<?php

namespace App\Services;

use App\Enum\RoleEnum;
use App\Models\Book;
use App\Models\Course;
use App\Models\Media;
use App\Models\User;
use App\Repositories\ChildActivityRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ChildActivityAnalyticsService
{
    public function __construct(private readonly ChildActivityRepository $repo)
    {
    }

    /**
     * Build dashboard summary without loading all activities into memory.
     *
     * @param int $childId
     * @param string $tz
     * @param int|null $perPage
     * @return array
     * @throws ModelNotFoundException
     */
    public function buildDashboardSummary(int $childId, string $tz, ?int $perPage = null): array
    {
        $this->validateChildExists($childId);

        $perPage = $perPage ?? config('constants.PAGINATE.DEFAULT_PER_PAGE', 9);
        $days = 7;

        $totals = $this->repo->totalsForChild($childId);
        $recent = $this->repo->recentActivitiesForChild($childId, $perPage);

        $dailyCounts = $this->repo->dailyCountsLastDays($childId, $days, $tz);
        $dailyTime = $this->repo->dailyTimeSpentLastDays($childId, $days, $tz);

        $lastActivityAt = $this->repo->lastActivityAt($childId);
        $alertInactiveDays = $this->calculateAlertInactiveDays($lastActivityAt);

        $videoCompletion = $this->calculateVideoCompletion($childId);
        $weeklyVideoGoal = $this->calculateWeeklyVideoGoal($childId);

        $recentActivities = $this->mapRecentActivities($recent);

        return [
            'totals' => $totals,
            'daily_activity' => $dailyCounts,
            'daily_time_spent' => $dailyTime,
            'most_recent_activity' => $lastActivityAt,
            'video_completion_rate' => $videoCompletion,
            'alert_inactive_days' => $alertInactiveDays,
            'recent' => $recentActivities,
            'weekly_video_goal' => $weeklyVideoGoal,
        ];
    }

    /**
     * Validate that child exists.
     *
     * @param int $childId
     * @return void
     * @throws ModelNotFoundException
     */
    private function validateChildExists(int $childId): void
    {
        $child = User::where('id', $childId)
            ->whereHas('roles', fn ($q) => $q->where('name', RoleEnum::CHILD->value))
            ->first();

        if (!$child) {
            throw new ModelNotFoundException(__('messages.child_not_found'));
        }
    }

    /**
     * Calculate alert inactive days if threshold is met.
     *
     * @param string|null $lastActivityAt
     * @return int|null
     */
    private function calculateAlertInactiveDays(?string $lastActivityAt): ?int
    {
        if (!$lastActivityAt) {
            return null;
        }

        $inactiveDays = Carbon::parse($lastActivityAt)->diffInDays(Carbon::now('UTC'));
        $threshold = (int) config('analytics.inactive_alert_days', 3);

        return $inactiveDays >= $threshold ? $inactiveDays : null;
    }

    /**
     * Calculate video completion rate.
     *
     * @param int $childId
     * @return float
     */
    private function calculateVideoCompletion(int $childId): float
    {
        $avgVideoSeconds = (int) config('analytics.avg_video_seconds', 600);
        return $this->repo->videoCompletionRatePercent($childId, $avgVideoSeconds);
    }

    /**
     * Calculate weekly video goal progress.
     *
     * @param int $childId
     * @return array
     */
    private function calculateWeeklyVideoGoal(int $childId): array
    {
        $weeklyVideoGoal = (int) config('analytics.weekly_video_goal', 5);
        $currentWeekVideos = $this->repo->countVideosLastDays($childId, 7);

        return [
            'goal' => $weeklyVideoGoal,
            'achieved' => $currentWeekVideos,
            'progress_percent' => $weeklyVideoGoal > 0
                ? (int) round(($currentWeekVideos / $weeklyVideoGoal) * 100)
                : 0,
        ];
    }

    /**
     * Map recent activities with their titles.
     *
     * @param array $recent
     * @return array
     */
    private function mapRecentActivities(array $recent): array
    {
        $bookIds = $recent['books']->pluck('reference_id')->filter()->unique()->values()->all();
        $courseIds = $recent['courses']->pluck('reference_id')->filter()->unique()->values()->all();
        $videoIds = $recent['videos']->pluck('reference_id')->filter()->unique()->values()->all();

        $bookMap = empty($bookIds) ? collect() : Book::whereIn('id', $bookIds)->pluck('title', 'id');
        $courseMap = empty($courseIds) ? collect() : Course::whereIn('id', $courseIds)->pluck('title', 'id');
        $videoMap = empty($videoIds) ? collect() : Media::whereIn('id', $videoIds)->pluck('title', 'id');

        return [
            'navigation' => $recent['navigation'],
            'books' => $recent['books']->map(fn ($a) => [
                'reference_id' => $a->reference_id,
                'book_title' => $bookMap[$a->reference_id] ?? null,
                'created_at' => $a->created_at,
            ])->values(),
            'courses' => $recent['courses']->map(fn ($a) => [
                'reference_id' => $a->reference_id,
                'course_title' => $courseMap[$a->reference_id] ?? null,
                'created_at' => $a->created_at,
            ])->values(),
            'meetings' => $recent['meetings']->map(fn ($a) => [
                'reference_id' => $a->reference_id,
                'meeting_title' => null,
                'created_at' => $a->created_at,
            ])->values(),
            'videos' => $recent['videos']->map(fn ($a) => [
                'reference_id' => $a->reference_id,
                'video_title' => $videoMap[$a->reference_id] ?? null,
                'created_at' => $a->created_at,
            ])->values(),
        ];
    }
}
