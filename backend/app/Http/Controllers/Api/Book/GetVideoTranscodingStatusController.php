<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetVideoTranscodingStatusController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse;
    public function __invoke($mediaId): JsonResponse
    {
        try {
            $status = Media::with('metadata')->findOrFail($mediaId)->metadata;
            return $this->returnSuccessResponse(__('media.transcoding_status'), $status, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            Log::error('Error fetching video transcoding status', [
                'mediaId' => $mediaId,
                'error' => $e->getMessage(),
            ]);
            return $this->returnErrorResponse($e->getMessage() ?: __('media.transcoding_status_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
