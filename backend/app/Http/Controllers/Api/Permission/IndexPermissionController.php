<?php

namespace App\Http\Controllers\Api\Permission;

use App\Http\Controllers\Controller;
use App\Repositories\PermissionRepository;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\Request;
use App\Helpers\QueryConfig;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Get(
 *     path="/api/admin/permissions",
 *     tags={"Roles and Permissions"},
 *     summary="Get a list of permissions",
 *     description="Retrieve a list of permissions with optional filters.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="keyword",
 *         in="query",
 *         required=false,
 *         description="Keyword to filter permissions by name",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Permissions retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Permissions retrieved successfully"),
 *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Internal server error")
 *         )
 *     )
 *)
 */


class IndexPermissionController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request)
    {
        try {
            $queryConfig = $this->getAttributes($request);

            $permissions = PermissionRepository::index($queryConfig);

            return $this->returnSuccessPaginationResponse(
                __('messages.found'),
                $permissions,
                ResponseAlias::HTTP_OK,
                $queryConfig->getPaginated()
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.fetch_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $params = $this->getPaginationParams($request);

        return (new QueryConfig())
            ->setFilters(['keyword' => $request->input('keyword')])
            ->setPage($params['PAGE'])
            ->setPerPage($params['PER_PAGE'])
            ->setOrderBy($params['ORDER_BY'])
            ->setDirection($params['DIRECTION'])
            ->setPaginated($params['PAGINATION']);
    }
}

