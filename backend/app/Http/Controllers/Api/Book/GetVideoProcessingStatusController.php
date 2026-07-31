<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetVideoProcessingStatusController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(string $mediaId): JsonResponse
    {
        try {
            $media = Media::with('metadata')
                ->where('id', $mediaId)
                ->where('creator_id', auth()->id())
                ->first();

            if (!$media) {
                return $this->returnErrorResponse(
                    __('messages.video_not_found_or_no_permission'), 
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            $metadata = $media->metadata;

            return $this->returnSuccessResponse(__('messages.video_status_retrieved_successfully'), [
                'media_id' => $media->id,
                'status' => $metadata->transcoding_status ?? 'UNKNOWN',
                'progress' => $metadata->progress ?? 0,
                'error' => $metadata->error_message,
                'hls_url' => $media->mime_type === 'application/vnd.apple.mpegurl' 
                    ? $media->file_path 
                    : null,
                'thumbnail' => $media->thumbnail,
                'duration' => $metadata->duration,
                'file_size' => $media->file_size,
                'created_at' => $media->created_at,
                'updated_at' => $metadata->updated_at ?? $media->updated_at,
            ], ResponseAlias::HTTP_OK);

        } catch (\Throwable $e) {
            return $this->returnErrorResponse(
                __('messages.failed_to_retrieve_video_status', ['error' => $e->getMessage()]),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}