<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\UploadMediaRequest;
use App\Models\BookIcon;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class UploadIconMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UploadMediaRequest $request, string $iconId): JsonResponse
    {
        try {
            $icon = BookIcon::where('id', $iconId)->firstOrFail();
            $data = $request->validated();
            
            $media = DB::transaction(function () use ($data, $icon) {
                if (isset($data['media_url'])) {
                    return MediaRepository::uploadMediaFromUrl(
                        model: $icon,
                        url: $data['media_url'],
                        title: $data['title'],
                        description: $data['description'] ?? null,
                        tag: MediaTagEnum::ICON_MEDIA->value,
                        isActive: false,
                    );
                }
                
                return MediaRepository::uploadMediaWithType(
                    model: $icon,
                    file: $data['media'],
                    title: $data['title'],
                    description: $data['description'] ?? null,
                    tag: MediaTagEnum::ICON_MEDIA->value,
                    isActive: false,
                );
            });

            return $this->returnSuccessResponse(
                __('media.upload_success'),
                [
                    'media_id' => $media->id,
                    'icon_id' => $iconId,
                    'media_type' => $media->media_type,
                    'file_path' => $media->file_path,
                    'status' => $media->metadata?->transcoding_status ?? 'completed',
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $e) {
            Log::error('Icon media upload failed', [
                'error' => $e->getMessage(),
                'icon_id' => $iconId,
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('media.upload_failed'),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
