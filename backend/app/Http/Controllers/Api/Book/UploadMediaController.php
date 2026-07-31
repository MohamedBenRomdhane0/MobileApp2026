<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\UploadMediaRequest;
use App\Models\Book;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class UploadMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UploadMediaRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $book = new Book();
            
            $media = DB::transaction(function () use ($data, $book) {
                $thumbnailUrl = null;
                if (isset($data['thumbnail']) && $data['thumbnail'] instanceof \Illuminate\Http\UploadedFile) {
                    $thumbnailUrl = MediaRepository::handleUploadedFile(
                        model: new Book(),
                        file: $data['thumbnail'],
                        disk: \App\Enum\DiskEnum::S3->value,
                        folder: 'thumbnails',
                        title: $data['title'] ?? null,
                        description: $data['description'] ?? null,
                        tag: 'THUMBNAIL',
                        store: false
                    );
                }

                if (isset($data['media_url'])) {
                    $created = MediaRepository::uploadMediaFromUrl(
                        model: $book,
                        url: $data['media_url'],
                        title: $data['title'],
                        description: $data['description'] ?? null,
                        tag: MediaTagEnum::BOOK_MEDIA->value
                    );

                    if ($thumbnailUrl) {
                        $created->thumbnail = $thumbnailUrl;
                        $created->save();
                    }

                    return $created;
                }
                
                $created = MediaRepository::uploadMediaWithType(
                    model: $book,
                    file: $data['media'],
                    title: $data['title'],
                    description: $data['description'] ?? null,
                    tag: MediaTagEnum::BOOK_MEDIA->value
                );

                if ($thumbnailUrl) {
                    $created->thumbnail = $thumbnailUrl;
                    $created->save();
                }

                return $created;
            });

            return $this->returnSuccessResponse(
                __('media.upload_success'),
                [
                    'media_id' => $media->id,
                    'media_type' => $media->media_type,
                    'file_path' => $media->file_path,
                    'status' => $media->metadata?->transcoding_status ?? 'completed',
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $e) {
            Log::error('Media upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('media.upload_failed'),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
