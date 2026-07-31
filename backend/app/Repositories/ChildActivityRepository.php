<?php

namespace App\Repositories;

use App\Models\ChildActivity;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ChildActivityRepository
{
    public function create(array $payload): void
    {
        ChildActivity::create($payload);
    }

    /**
     * Limited recent activities to avoid OOM.
     *
     * @return array{
     *   videos:\Illuminate\Support\Collection,
     *   books:\Illuminate\Support\Collection,
     *   courses:\Illuminate\Support\Collection,
     *   meetings:\Illuminate\Support\Collection,
     *   navigation:\Illuminate\Support\Collection
     * }
     */
    public function recentActivitiesForChild(int $childId, int $limit = 15): array
    {
        $limit = max(1, min($limit, 100));

        $base = $this->baseQuery($childId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $videos = $base->where('action_type', ChildActivity::TYPE_VIDEO)->values();
        $books = $base->where('action_type', ChildActivity::TYPE_BOOK)->values();
        $courses = $base->where('action_type', ChildActivity::TYPE_COURSE)->values();
        $meetings = $base->where('action_type', ChildActivity::TYPE_MEETING)->values();

        $navigation = $base->where('action_type', ChildActivity::TYPE_NAVIGATION)
            ->map(fn ($a) => [
                'screen_name' => (string) ($a->screen_name ?? ''),
                'created_at' => $a->created_at,
                'duration' => (int) ($a->duration ?? 0),
            ])
            ->values();

        return compact('videos', 'books', 'courses', 'meetings', 'navigation');
    }

    /**
     * Aggregate totals for a child (SQL, no big collections).
     */
    public function totalsForChild(int $childId): array
    {
        $query = $this->baseQuery($childId);

        $totalActions = (int) (clone $query)->count();
        $totalSeconds = (int) (clone $query)->sum('duration');

        $countsByType = (clone $query)
            ->selectRaw('action_type, COUNT(*) as c')
            ->groupBy('action_type')
            ->pluck('c', 'action_type');

        $avgSessionSeconds = (int) (clone $query)->avg('duration');

        return [
            'total_actions' => $totalActions,
            'total_time_spent_seconds' => $totalSeconds,
            'total_time_spent_minutes' => (int) floor($totalSeconds / 60),
            'total_time_spent_hours' => round($totalSeconds / 3600, 1),

            'avg_session_seconds' => $avgSessionSeconds,
            'avg_session_minutes' => (int) floor($avgSessionSeconds / 60),

            'total_videos' => (int) ($countsByType[ChildActivity::TYPE_VIDEO] ?? 0),
            'total_books' => (int) ($countsByType[ChildActivity::TYPE_BOOK] ?? 0),
            'total_courses' => (int) ($countsByType[ChildActivity::TYPE_COURSE] ?? 0),
            'total_meetings' => (int) ($countsByType[ChildActivity::TYPE_MEETING] ?? 0),
        ];
    }

    public function lastActivityAt(int $childId): ?string
    {
        $dt = $this->baseQuery($childId)->max('created_at');

        return $dt ? (string) $dt : null;
    }

    /**
     * Daily counts for last $days local days including today, zero-filled.
     */
    public function dailyCountsLastDays(int $childId, int $days, string $tz): array
    {
        $days = max(1, min($days, 60));

        $fromUtc = Carbon::now('UTC')->subDays($days - 1);
        $tzOffset = $this->tzOffsetString($tz);

        $rows = $this->baseQuery($childId)
            ->where('created_at', '>=', $fromUtc)
            ->selectRaw(
                "DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', ?), '%Y-%m-%d') as day, COUNT(id) as actions",
                [$tzOffset]
            )
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $daily = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = Carbon::now($tz)->subDays($i)->format('Y-m-d');
            $daily[] = [
                'day' => $d,
                'actions' => (int) ($rows[$d]->actions ?? 0),
            ];
        }

        return $daily;
    }

    /**
     * Daily sum(duration) for last $days local days including today, zero-filled.
     */
    public function dailyTimeSpentLastDays(int $childId, int $days, string $tz): array
    {
        $days = max(1, min($days, 60));

        $fromUtc = Carbon::now('UTC')->subDays($days - 1);
        $tzOffset = $this->tzOffsetString($tz);

        $rows = $this->baseQuery($childId)
            ->where('created_at', '>=', $fromUtc)
            ->selectRaw(
                "DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', ?), '%Y-%m-%d') as day, COALESCE(SUM(duration),0) as total_seconds",
                [$tzOffset]
            )
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $daily = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = Carbon::now($tz)->subDays($i)->format('Y-m-d');
            $seconds = (int) ($rows[$d]->total_seconds ?? 0);

            $daily[] = [
                'day' => $d,
                'seconds' => $seconds,
                'minutes' => (int) floor($seconds / 60),
            ];
        }

        return $daily;
    }

    public function videoCompletionRatePercent(int $childId, int $avgVideoSeconds): int
    {
        $avgVideoSeconds = max(1, $avgVideoSeconds);

        $avgRate = (float) $this->baseQuery($childId)
            ->where('action_type', ChildActivity::TYPE_VIDEO)
            ->selectRaw('AVG(COALESCE(duration,0) / ?) as r', [$avgVideoSeconds])
            ->value('r');

        if ($avgRate <= 0) {
            return 0;
        }

        return min(100, (int) round($avgRate * 100));
    }

    public function countVideosLastDays(int $childId, int $days): int
    {
        $days = max(1, min($days, 60));

        return (int) $this->baseQuery($childId)
            ->where('action_type', ChildActivity::TYPE_VIDEO)
            ->where('created_at', '>=', Carbon::now('UTC')->subDays($days))
            ->count();
    }

    /**
     * Keep if other parts need it; avoid using it for dashboard.
     *
     * @return \Illuminate\Support\Collection<\App\Models\ChildActivity>
     */
    public function allForChild(int $childId): Collection
    {
        return $this->baseQuery($childId)
            ->orderByDesc('created_at')
            ->get();
    }

    private function baseQuery(int $childId): Builder
    {
        return ChildActivity::query()->forChild($childId);
    }

    /**
     * Convert timezone name into a MySQL offset string (+01:00).
     * If timezone is invalid, fallback to UTC.
     */
    private function tzOffsetString(string $tz): string
    {
        try {
            return Carbon::now($tz)->format('P'); 
        } catch (\Throwable) {
            return '+00:00';
        }
    }
}
