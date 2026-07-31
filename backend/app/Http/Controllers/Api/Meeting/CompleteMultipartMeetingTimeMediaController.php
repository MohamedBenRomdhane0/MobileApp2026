<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\CompleteMediaMultipartUploadRequest;
use App\Models\MeetingTime;
use App\Repositories\MediaRepository;
use App\Services\MediaMultipartUploadService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CompleteMultipartMeetingTimeMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(
        CompleteMediaMultipartUploadRequest $request,
        MediaMultipartUploadService $service,
        int $id,
    ): JsonResponse {
        try {
            $meetingTime = MeetingTime::findOrFail($id);
            $data = $request->validated();

            $media = DB::transaction(function () use ($data, $service, $meetingTime) {
                $service->completeMultipartUpload(
                    key: $data['key'],
                    uploadId: $data['uploadId'],
                    parts: $data['parts'],
                );

                return MediaRepository::createMediaFromS3Object(
                    model: $meetingTime,
                    storedPath: $data['key'],
                    originalName: $data['filename'],
                    mimeType: $data['contentType'],
                    size: (int) $data['size'],
                    title: $data['title'],
                    description: $data['description'] ?? null,
                    tag: MediaTagEnum::MEETING_TIME_MEDIA->value,
                    isActive: true,
                );
            });

            return $this->returnSuccessResponse(
                __('media.upload_success'),
                [
                    'media_id'   => $media->id,
                    'media_type' => $media->media_type,
                    'file_path'  => $media->file_path,
                    'status'     => $media->metadata?->transcoding_status ?? 'completed',
                ],
                Response::HTTP_OK,
            );
        } catch (\Throwable $e) {
            Log::error('Failed to complete meeting time media multipart upload', [
                'error'           => $e->getMessage(),
                'meeting_time_id' => $id,
            ]);

            return $this->returnErrorResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
