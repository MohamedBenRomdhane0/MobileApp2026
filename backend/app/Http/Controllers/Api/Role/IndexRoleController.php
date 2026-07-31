<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Repositories\RoleRepository;
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
 *     path="/api/admin/roles",
 *     tags={"Roles and Permissions"},
 *     summary="Get all roles",
 *     security={{"bearerAuth":{}}},
 *     description="Retrieve a list of all roles with optional filtering, sorting, and pagination.",
 *     @OA\Parameter(
 *         name="keyword",
 *         in="query",
 *         description="Keyword to filter roles by name",
 *         required=false,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Roles retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Roles found"),
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Role")),
 *             @OA\Property(property="pagination", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Failed to fetch roles")
 *         )
 *     )
 * )
 */

class IndexRoleController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request)
    {
        try {
            $queryConfig = $this->getAttributes($request);

            $roles = RoleRepository::index($queryConfig);

            return $this->returnSuccessPaginationResponse(__('message.found'), $roles, ResponseAlias::HTTP_OK, $queryConfig->getPaginated());
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.fetch_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
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
