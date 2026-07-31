<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\CompleteMediaMultipartUploadRequest;
use App\Models\BookIcon;
use App\Repositories\MediaRepository;
use App\Services\MediaMultipartUploadService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CompleteIconMediaMultipartUploadController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(
        CompleteMediaMultipartUploadRequest $request,
        MediaMultipartUploadService $service,
        string $iconId,
    ): JsonResponse {
        try {
            $data = $request->validated();
            $icon = BookIcon::findOrFail($iconId);

            $media = DB::transaction(function () use ($data, $service, $icon) {
                $service->completeMultipartUpload(
                    key: $data['key'],
                    uploadId: $data['uploadId'],
                    parts: $data['parts'],
                );

                return MediaRepository::createMediaFromS3Object(
                    model: $icon,
                    storedPath: $data['key'],
                    originalName: $data['filename'],
                    mimeType: $data['contentType'],
                    size: (int) $data['size'],
                    title: $data['title'],
                    description: $data['description'] ?? null,
                    tag: MediaTagEnum::ICON_MEDIA->value,
                    isActive: false,
                );
            });

            return $this->returnSuccessResponse(
                'media.upload_success',
                [
                    'media_id' => $media->id,
                    'icon_id' => $iconId,
                    'media_type' => $media->media_type,
                    'file_path' => $media->file_path,
                    'status' => $media->metadata?->transcoding_status ?? 'completed',
                ],
                Response::HTTP_OK,
            );
        } catch (\Throwable $exception) {
            Log::error('Failed to complete icon media multipart upload', [
                'error' => $exception->getMessage(),
                'icon_id' => $iconId,
            ]);

            return $this->returnErrorResponse($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
