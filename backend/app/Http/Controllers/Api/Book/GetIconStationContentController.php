<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetIconStationContentController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int|string $iconId): JsonResponse
    {
        try {
            $childId = $request->integer('child_id') ?: null;
            $data = BookRepository::getIconStationContent($iconId, $childId);

            return $this->returnSuccessResponse(
                __('messages.media_found'),
                $data,
                ResponseAlias::HTTP_OK,
            );
        } catch (\Throwable $e) {
            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.fetch_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
            );
        }
    }
}
