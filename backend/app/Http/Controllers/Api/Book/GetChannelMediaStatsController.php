<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetChannelMediaStatsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $stats = BookRepository::getChannelMediaStats();
            return $this->returnSuccessResponse('messages.stats_retrieved', $stats, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: 'messages.fetch_failed', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
