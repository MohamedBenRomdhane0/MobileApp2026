<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Repositories\PlanFeatureRepository;
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
 *     path="/api/admin/plan-features",
 *     tags={"Plan"},
 *     summary="Get all plan features",
 *     description="Returns all plan features with pagination and filtering options.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Plan features retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Plan features fetched"),
 *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
 *             @OA\Property(property="pagination", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Error fetching plan features"))
 *     )
 * )
 */


class IndexPlanFeatureController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request): JsonResponse
    {
        try {
            $paginationParams = $this->getAttributes($request);
            $features = PlanFeatureRepository::index($paginationParams);

            return $this->returnSuccessPaginationResponse('plan_features_fetched', $features, ResponseAlias::HTTP_OK, $paginationParams->isPaginated());
        } catch (\Throwable $e) {
            Log::error('Error fetching plan features: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?:__('plan_feature.fetch_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

      /**
     * @param Request $request
     * @return QueryConfig
     */
    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $request->input('keyword'),
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
