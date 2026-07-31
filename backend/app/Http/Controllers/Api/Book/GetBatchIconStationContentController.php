<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetBatchIconStationContentController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        $iconIds = $request->input('icon_ids', []);

        if (empty($iconIds) || !is_array($iconIds)) {
            return $this->returnSuccessResponse(__('messages.success'), [], ResponseAlias::HTTP_OK);
        }

        try {
            $data = BookRepository::getBatchIconStationContent($iconIds);

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
