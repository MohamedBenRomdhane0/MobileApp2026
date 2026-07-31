<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class ChildDashboardResource extends JsonResource
{
    public function toArray($request): array
    {
        $totals = (array) ($this->resource['totals'] ?? []);
        $recent = (array) ($this->resource['recent'] ?? []);

        return [
            'total_videos' => (int) ($totals['total_videos'] ?? 0),
            'total_books' => (int) ($totals['total_books'] ?? 0),
            'total_courses' => (int) ($totals['total_courses'] ?? 0),
            'total_meetings' => (int) ($totals['total_meetings'] ?? 0),
            'child_total_activity' => (int) ($totals['total_actions'] ?? 0),

            'total_time_spent_seconds' => (int) ($totals['total_time_spent_seconds'] ?? 0),
            'total_time_spent_minutes' => (int) ($totals['total_time_spent_minutes'] ?? 0),
            'total_time_spent_hours' => (float) ($totals['total_time_spent_hours'] ?? 0),

            'average_session_seconds' => (int) ($totals['avg_session_seconds'] ?? 0),
            'average_session_minutes' => (int) ($totals['avg_session_minutes'] ?? 0),

            'daily_activity' => $this->asList($this->resource['daily_activity'] ?? []),
            'daily_time_spent' => $this->asList($this->resource['daily_time_spent'] ?? []),

            'most_recent_activity' => $this->asNullableString($this->resource['most_recent_activity'] ?? null),
            'video_completion_rate' => (int) ($this->resource['video_completion_rate'] ?? 0),
            'alert_inactive_days' => $this->resource['alert_inactive_days'] ?? null,

            'navigation' => $this->asList($recent['navigation'] ?? []),
            'books' => $this->asList($recent['books'] ?? []),
            'courses' => $this->asList($recent['courses'] ?? []),
            'meetings' => $this->asList($recent['meetings'] ?? []),
            'videos' => $this->asList($recent['videos'] ?? []),

            'weekly_video_goal' => (array) ($this->resource['weekly_video_goal'] ?? [
                'goal' => 0,
                'achieved' => 0,
                'progress_percent' => 0,
            ]),
        ];
    }

    private function asList(mixed $value): array
    {
        if ($value instanceof Collection) {
            return $value->values()->toArray();
        }

        if (is_array($value)) {
            return array_values($value);
        }

        return [];
    }

    private function asNullableString(mixed $value): ?string
    {
        return $value === null ? null : (string) $value;
    }
}
