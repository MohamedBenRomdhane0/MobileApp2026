<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\StatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Book\CreateBookDraftRequest;
use App\Models\Book;
use App\Models\LevelMaterial;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CreateBookDraftController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(CreateBookDraftRequest $request)
    {
        $user = auth()->user();

        if (!BookAccessService::canStore($user)) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        try {
            $attributes = $request->validated();

            $levelMaterialId = $attributes['level_material_id'] ?? null;
            $levelSectionMaterialId = $attributes['level_section_material_id'] ?? null;

            if (!$levelSectionMaterialId && !$levelMaterialId) {
                $levelId = $attributes['level_id'] ?? null;
                $materialId = $attributes['material_id'] ?? null;

                if ($levelId && $materialId) {
                    $levelMaterial = LevelMaterial::where('level_id', $levelId)
                        ->where('material_id', $materialId)
                        ->first();

                    if (!$levelMaterial) {
                        return $this->returnErrorResponse(
                            __('book.level_material_not_found'),
                            ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
                        );
                    }

                    $levelMaterialId = $levelMaterial->id;
                } else {
                    return $this->returnErrorResponse(
                        __('book.level_material_required'),
                        ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
                    );
                }
            }

            if (BookAccessService::requiresValidation($user)) {
                $status = StatusEnum::INACTIVE->value;
            } else {
                $status = StatusEnum::ACTIVE->value;
            }

            $book = Book::create([
                'level_material_id'          => $levelMaterialId,
                'level_section_material_id'  => $levelSectionMaterialId,
                'title'                      => $attributes['title'] ?? $attributes['title_fr'] ?? $attributes['title_ar'] ?? $attributes['title_en'] ?? null,
                'title_en'                   => $attributes['title_en'] ?? null,
                'type'                       => $attributes['type'] ?? null,
                'user_id'                    => auth()->id(),
                'creator_id'                 => auth()->id(),
                'status'                     => $status,
                'language'                   => $attributes['language'] ?? 'en',
                'pages_total'                => $attributes['pages_total'] ?? null,
            ]);

            if (!empty($attributes['title_fr'])) {
                $book->setTranslation('title', 'fr', $attributes['title_fr']);
            }

            if (!empty($attributes['title_ar'])) {
                $book->setTranslation('title', 'ar', $attributes['title_ar']);
            }

            return $this->returnSuccessResponse(__('book.book_created'), $book, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $exception) {
            Log::error($exception);
            return $this->returnErrorResponse($exception->getMessage() ?? __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
