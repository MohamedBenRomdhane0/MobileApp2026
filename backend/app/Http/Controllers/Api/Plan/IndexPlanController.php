<?php

namespace App\Http\Controllers\Api\Plan;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\PlanRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class IndexPlanController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    /**
     * @OA\Get(
     *     path="/api/admin/plans",
     *     tags={"Plan"},
     *     summary="List all plans (admin)",
     *     description="Returns a paginated list of all plans with optional filters and sorting. Includes translations, features, and highlighted pricing.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="keyword",
     *         in="query",
     *         description="Filter plans by translated name or other text",
     *         required=false,
     *         @OA\Schema(type="string", example="premium")
     *     ),
     *     @OA\Parameter(
     *         name="feature",
     *         in="query",
     *         description="Filter plans by feature ID",
     *         required=false,
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Parameter(
     *         name="order_by",
     *         in="query",
     *         description="Field to sort by",
     *         required=false,
     *         @OA\Schema(type="string", example="created_at")
     *     ),
     *     @OA\Parameter(
     *         name="direction",
     *         in="query",
     *         description="Sort direction (asc or desc)",
     *         required=false,
     *         @OA\Schema(type="string", example="desc")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of plans",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Plans retrieved"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="pagination", type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="total", type="integer", example=45),
     *                 @OA\Property(property="per_page", type="integer", example=10)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error retrieving plans",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Internal server error")
     *         )
     *     )
     * )
     */
    public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);

        try {
            $plans = PlanRepository::index($paginationParams);

            return $this->returnSuccessPaginationResponse(
                __('plan.retrieved'),
                $plans,
                ResponseAlias::HTTP_OK,
                $paginationParams->isPaginated()
            );
        } catch (\Exception $e) {
            Log::error('Error retrieving plans: ' . $e->getMessage(), ['exception' => $e]);

            return $this->returnErrorResponse($e->getMessage() ?: __('plan.error_retrieving'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $request->input('keyword'),
        ];

        return (new QueryConfig())
            ->setFilters($filters)
            ->setPerPage($paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated($paginationParams['PAGINATION']);
    }
}
