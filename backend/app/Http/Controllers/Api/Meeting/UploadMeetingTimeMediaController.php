<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\UploadMediaRequest;
use App\Models\MeetingTime;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class UploadMeetingTimeMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UploadMediaRequest $request, int $id): JsonResponse
    {
        try {
            $meetingTime = MeetingTime::findOrFail($id);
            $data = $request->validated();

            $media = DB::transaction(function () use ($data, $meetingTime) {
                if (isset($data['media_url'])) {
                    return MediaRepository::uploadMediaFromUrl(
                        model: $meetingTime,
                        url: $data['media_url'],
                        title: $data['title'],
                        description: $data['description'] ?? null,
                        tag: MediaTagEnum::MEETING_TIME_MEDIA->value,
                        isActive: true,
                    );
                }

                return MediaRepository::uploadMediaWithType(
                    model: $meetingTime,
                    file: $data['media'],
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
                Response::HTTP_OK
            );
        } catch (\Throwable $e) {
            Log::error('Meeting time media upload failed', [
                'error'           => $e->getMessage(),
                'meeting_time_id' => $id,
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('media.upload_failed'),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
