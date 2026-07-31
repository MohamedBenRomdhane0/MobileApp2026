<?php

namespace App\Http\Controllers\Api\Book;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class IndexVideosForUserController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse, PaginationParams;
    public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);
        try {
            $videos = BookRepository::indexVideos($paginationParams);
            return $this->returnSuccessPaginationResponse(__('book.videos_found'), $videos, ResponseAlias::HTTP_OK, $paginationParams->getPaginated());
        } catch (\Throwable $e) {
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.fetch_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        return (new QueryConfig())
        ->setFilters([
                'keyword' => $request->input('keyword'),
                'media_type' => $request->input('media_type'),
                'is_external' => $request->input('is_external'),
                'level_id' => $request->input('level_id'),
                'material_id' => $request->input('material_id'),
            ])
            ->setPerPage($paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated($paginationParams['PAGINATION']);
    }
}
