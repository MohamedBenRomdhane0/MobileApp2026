<?php

namespace App\Repositories;

use App\Enum\MediaReviewStatusEnum;
use App\Enum\MediaTagEnum;
use App\Models\BookIcon;
use App\Models\Media;
use Illuminate\Database\Eloquent\Builder;

class MediaStatsRepository
{
    private static function iconMediaBase(): Builder
    {
        return Media::where('tag', MediaTagEnum::ICON_MEDIA->value)
            ->where('model_type', BookIcon::class)
            ->whereNull('deleted_at');
    }

    public static function getApprovedTodayCount(): int
    {
        return self::iconMediaBase()
            ->where('review_status', MediaReviewStatusEnum::APPROVED->value)
            ->whereDate('reviewed_at', today())
            ->count();
    }

    public static function getRejectedCount(): int
    {
        return self::iconMediaBase()
            ->where('review_status', MediaReviewStatusEnum::REJECTED->value)
            ->count();
    }

    public static function getAvgReviewSeconds(): int
    {
        $avgSeconds = self::iconMediaBase()
            ->whereNotNull('reviewed_at')
            ->whereIn('review_status', [
                MediaReviewStatusEnum::APPROVED->value,
                MediaReviewStatusEnum::REJECTED->value,
                MediaReviewStatusEnum::CHANGES_REQUESTED->value,
            ])
            ->selectRaw('AVG(TIMESTAMPDIFF(SECOND, created_at, reviewed_at)) as avg_seconds')
            ->value('avg_seconds');

        return (int) ($avgSeconds ?? 0);
    }
}
