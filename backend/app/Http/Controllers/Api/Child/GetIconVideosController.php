<?php

namespace App\Http\Controllers\Api\Child;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Get(
 *     path="/api/child/{iconId}/videos",
 *     tags={"Parent"},
 *     summary="Get videos for a specific icon",
 *     description="Fetches all videos associated with a specific icon.",
 *     security={{"bearerAuth": {}}},
 *     @OA\Parameter(
 *         name="iconId",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(response=200, description="Videos found successfully"),
 *     @OA\Response(response=403, description="Forbidden"),
 *     @OA\Response(response=401, description="Unauthenticated"),
 *     @OA\Response(response=500, description="Failed to fetch videos")
 * )
 */

class GetIconVideosController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(int $iconId, Request $request): JsonResponse
    {

        $paginationParams = $this->getAttributes($request);

        try {
            $videos = BookRepository::getMediaForIcon($iconId, $paginationParams);

            return $this->returnSuccessPaginationResponse(
                __('book.videos_found'),
                $videos,
                ResponseAlias::HTTP_OK,
                $paginationParams->getPaginated()
            );
        } catch (\Throwable $e) {

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.fetch_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'icon_id' => $request->input('icon_id', null),
            'keyword' => $request->input('keyword', ''),
            'user_id' => optional($request->user())->id,
        ];

        $search = new QueryConfig();
        $search
            ->setFilters($filters)
            ->setPerPage($paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated($paginationParams['PAGINATION'])
            ->setPage($paginationParams['PAGE']);

        return $search;
    }
}
