<?php

namespace App\Http\Controllers\Api\Child;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\PlanRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

    /**
     * @OA\Get(
     *     path="/api/child/plans",
     *     tags={"Parent"},
     *     summary="Get available plans for the authenticated child",
     *     description="Retrieve a paginated list of plans available to the child based on their level, including pricing information, features, and accessible materials. Plans can be filtered and sorted according to various criteria.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Plan details retrieved successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Plan details found"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 description="Plan with translations, features and pricings filtered by child level"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Child or level not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Child or child level not found for the authenticated user.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Plan not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Plan not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Error retrieving plan details")
     *         )
     *     )
     * )
     */
class IndexPlansForChildController extends Controller
{
        use SuccessResponse, ErrorResponse,PaginationParams;

    /**
     * Handle the incoming request.
     */
        public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);
        try {
            $levelId = $request->user()->childProfile?->level_id;
            if (!$levelId) {
                return $this->returnErrorResponse(__('plan.level_not_assigned'), ResponseAlias::HTTP_NOT_FOUND);
            }
            $plans = PlanRepository::indexPlansForChild($paginationParams, $levelId);
            return $this->returnSuccessPaginationResponse(
                __('plan_retrieved'),
                $plans,
                ResponseAlias::HTTP_OK,
                $paginationParams->isPaginated()
            );
        } catch (Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse( $exception->getMessage()?:__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
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
            'keyword' => $request->input('keyword', null),
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)->setPerPage($paginationParams['PER_PAGE'])->setOrderBy($paginationParams['ORDER_BY'])->setDirection($paginationParams['DIRECTION'])->setPaginated($paginationParams['PAGINATION']);
        return $search;
    }
}
