<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enum\MediaReviewStatusEnum;
use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Models\BookIcon;
use App\Models\Media;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class GetAllPendingIconMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $pending = Media::where('tag', MediaTagEnum::ICON_MEDIA->value)
                ->where('review_status', MediaReviewStatusEnum::PENDING->value)
                ->whereNull('deleted_at')
                ->where('model_type', BookIcon::class)
                ->with([
                    'creator:id,full_name,email',
                    'creator.media' => fn($q) => $q->where('tag', MediaTagEnum::AVATAR->value),
                    'model.book.levelMaterial',
                    'model.book.levelSectionMaterial',
                ])
                ->orderByDesc('created_at')
                ->get()
                ->map(fn(Media $m) => [
                    'id'              => $m->id,
                    'title'           => $m->title,
                    'media_type'      => $m->media_type,
                    'file_path'       => $m->file_path,
                    'thumbnail'       => $m->thumbnail,
                    'mime_type'       => $m->mime_type,
                    'is_active'       => $m->is_active,
                    'review_status'   => $m->review_status?->value,
                    'review_feedback' => $m->review_feedback,
                    'reviewed_at'     => $m->reviewed_at?->toIso8601String(),
                    'created_at'      => $m->created_at,
                    'icon'       => $m->model ? [
                        'id'        => $m->model->id,
                        'page'      => $m->model->page,
                        'icon_type' => $m->model->icon_type,
                        'title'     => $m->model->title,
                        'book'      => $m->model->book ? [
                            'id'             => $m->model->book->id,
                            'title'          => $m->model->book->title,
                            'level_material' => $m->model->book->levelMaterial ? [
                                'material' => $m->model->book->levelMaterial->material
                                    ? ['id' => $m->model->book->levelMaterial->material->id, 'name' => $m->model->book->levelMaterial->material->name, 'color' => $m->model->book->levelMaterial->material->color]
                                    : null,
                                'level' => $m->model->book->levelMaterial->level
                                    ? ['id' => $m->model->book->levelMaterial->level->id, 'name' => $m->model->book->levelMaterial->level->name]
                                    : null,
                            ] : null,
                            'level_section_material' => $m->model->book->levelSectionMaterial ? [
                                'material' => $m->model->book->levelSectionMaterial->material
                                    ? ['id' => $m->model->book->levelSectionMaterial->material->id, 'name' => $m->model->book->levelSectionMaterial->material->name, 'color' => $m->model->book->levelSectionMaterial->material->color]
                                    : null,
                                'level_section' => $m->model->book->levelSectionMaterial->levelSection ? [
                                    'level' => $m->model->book->levelSectionMaterial->levelSection->level
                                        ? ['id' => $m->model->book->levelSectionMaterial->levelSection->level->id, 'name' => $m->model->book->levelSectionMaterial->levelSection->level->name]
                                        : null,
                                    'section' => $m->model->book->levelSectionMaterial->levelSection->section
                                        ? ['id' => $m->model->book->levelSectionMaterial->levelSection->section->id, 'name' => $m->model->book->levelSectionMaterial->levelSection->section->name]
                                        : null,
                                ] : null,
                            ] : null,
                        ] : null,
                    ] : null,
                    'creator' => $m->creator ? [
                        'id'        => $m->creator->id,
                        'full_name' => $m->creator->full_name,
                        'avatar'    => $m->creator->media->first()?->file_path,
                    ] : null,
                ]);

            return $this->returnSuccessResponse(__('messages.success'), $pending, Response::HTTP_OK);
        } catch (\Throwable $e) {
            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.fetch_failed'),
                Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        }
    }
}
