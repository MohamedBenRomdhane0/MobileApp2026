<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Models\BookIcon;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class GetPendingIconMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $bookId): JsonResponse
    {
        try {
            $icons = BookIcon::where('book_id', $bookId)
                ->whereNull('deleted_at')
                ->with(['media' => function ($q) {
                    $q->where('tag', MediaTagEnum::ICON_MEDIA->value)
                      ->where('is_active', false)
                      ->whereNull('deleted_at');
                }])
                ->get()
                ->filter(fn($icon) => $icon->media->isNotEmpty())
                ->map(fn($icon) => [
                    'icon_id'   => $icon->id,
                    'page'      => $icon->page,
                    'icon_type' => $icon->icon_type,
                    'title'     => $icon->title,
                    'media'     => $icon->media->map(fn($m) => [
                        'id'         => $m->id,
                        'title'      => $m->title,
                        'media_type' => $m->media_type,
                        'file_path'  => $m->file_path,
                        'thumbnail'  => $m->thumbnail,
                        'mime_type'  => $m->mime_type,
                        'is_active'  => $m->is_active,
                        'created_at' => $m->created_at,
                    ])->values(),
                ])
                ->values();

            return $this->returnSuccessResponse(__('messages.success'), $icons, Response::HTTP_OK);
        } catch (\Throwable $e) {
            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.fetch_failed'),
                Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        }
    }
}
