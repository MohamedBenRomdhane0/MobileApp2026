<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookModule;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class GetModuleIconsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Book $book, BookModule $module): JsonResponse
    {
        $user = auth()->user();

        if (!BookAccessService::canAccess($user, $book)) {
            return $this->returnErrorResponse('unauthorized', HttpResponse::HTTP_FORBIDDEN);
        }

        $icons = $book->icons()
            ->withCount([
                'media as media_count' => fn ($q) => $q->where('tag', MediaTagEnum::ICON_MEDIA->value),
            ])
            ->where(function ($q) use ($module) {
                $q->where('book_module_id', $module->id)
                  ->orWhere(function ($q2) use ($module) {
                      $q2->whereNull('book_module_id')
                         ->whereRaw('CAST(SUBSTRING_INDEX(page, \'-\', -1) AS UNSIGNED) >= ?', [$module->start_page])
                         ->whereRaw('CAST(SUBSTRING_INDEX(page, \'-\', -1) AS UNSIGNED) <= ?', [$module->end_page]);
                  });
            })
            ->orderBy('page')
            ->get();

        return $this->returnSuccessResponse(__('messages.success'), $icons, HttpResponse::HTTP_OK);
    }
}
