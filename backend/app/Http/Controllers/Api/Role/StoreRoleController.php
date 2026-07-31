<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\RoleStoreRequest;
use App\Repositories\RoleRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Post(
 *     path="/api/admin/roles",
 *     tags={"Roles and Permissions"},
 *     summary="Create a new role",
 *     description="Create a new role with the given name.",
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string", example="admin")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Role created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Role created successfully"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Internal server error")
 *         )
 *     )
 * )
 */


class StoreRoleController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * Handle the incoming request.
     */
    public function __invoke(RoleStoreRequest $request)
    {
        try {
            $role = RoleRepository::createWithPermissions(
                $request->string('name'),
                $request->normalizedPermissions()
            );
            return $this->returnSuccessResponse(__('messages.create_success'), $role, ResponseAlias::HTTP_CREATED);
        } catch (\Throwable $e) {
            return $this->returnErrorResponse(__('messages.create_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
