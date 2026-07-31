<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Repositories\LevelRepository;
use App\Helpers\QueryConfig;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/levels",
 *     summary="Get all levels",
 *     tags={"Levels"},
 *     @OA\Response(
 *         response=200,
 *         description="Levels retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Success"),
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Level")),
 *             @OA\Property(property="pagination", type="object")
 *         )
 *     ),
 *     @OA\Response(response=500, description="Internal server error")
 * )
 */

class IndexLevelsController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;


    public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);
        try {
            $levels = LevelRepository::index($paginationParams);
            
            return $this->returnSuccessPaginationResponse(__('messages.success'), $levels, ResponseAlias::HTTP_OK, $paginationParams->isPaginated());
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?: __('general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword'      => $paginationParams['KEYWORD'] ?? '',
            'service_slug' => $request->input('service_slug'),
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)
            ->setPerPage($paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated($paginationParams['PAGINATION'])
            ->setPage($paginationParams['PAGE']);
        return $search;
    }
}
