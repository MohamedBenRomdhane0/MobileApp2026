<?php

namespace App\Http\Controllers\Api\Material;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Repositories\MaterialRepository;
use OpenApi\Annotations as OA;
/**
 * @OA\Get(
 *     path="/api/materials",
 *     summary="Get all materials",
 *     tags={"Materials"},
 *     @OA\Response(
 *         response=200,
 *         description="Materials retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Success"),
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Material")),
 *             @OA\Property(property="pagination", type="object")
 *         )
 *     ),
 *     @OA\Response(response=500, description="Internal server error")
 * )
 */

class IndexMaterialsController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;
    /**
     *  @param Request $request
     *  @return JsonResponse
     * 
     */
    public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);
        try {
            $materials = MaterialRepository::index($paginationParams);
            return $this->returnSuccessPaginationResponse(__('messages.success'), $materials, ResponseAlias::HTTP_OK, $paginationParams->isPaginated());
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?: __('general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $paginationParams['KEYWORD'] ?? '',
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)->setPerPage($paginationParams['PER_PAGE'])->setOrderBy($paginationParams['ORDER_BY'])->setDirection($paginationParams['DIRECTION'])->setPaginated($paginationParams['PAGINATION'])->setPage($paginationParams['PAGE']);
        return $search;
    }
}
