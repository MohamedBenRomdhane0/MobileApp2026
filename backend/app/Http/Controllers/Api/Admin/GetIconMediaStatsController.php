<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\MediaStatsRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class GetIconMediaStatsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $avgSeconds = MediaStatsRepository::getAvgReviewSeconds();

            return $this->returnSuccessResponse(__('messages.success'), [
                'approved_today'  => MediaStatsRepository::getApprovedTodayCount(),
                'rejected'        => MediaStatsRepository::getRejectedCount(),
                'avg_review_time' => $this->formatAvgTime($avgSeconds),
            ], Response::HTTP_OK);
        } catch (\Throwable $e) {
            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.fetch_failed'),
                Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        }
    }

    private function formatAvgTime(int $seconds): string
    {
        if ($seconds <= 0) {
            return '—';
        }

        $hours   = intdiv($seconds, 3600);
        $minutes = intdiv($seconds % 3600, 60);

        if ($hours >= 24) {
            $days = intdiv($hours, 24);
            return "{$days}d";
        }

        if ($hours > 0) {
            return $minutes > 0 ? "{$hours}h {$minutes}m" : "{$hours}h";
        }

        return "{$minutes}m";
    }
}
