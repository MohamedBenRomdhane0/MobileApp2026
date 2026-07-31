<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Repositories\RoleRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Put(
 *     path="/api/admin/roles/{role}",
 *     tags={"Roles and Permissions"},
 *     summary="Update a role",
 *     description="Update the name of an existing role.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="role",
 *         in="path",
 *         required=true,
 *         description="ID of the role to update",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string", example="admin")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Role updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Role updated successfully"),
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
 *)
 */

class UpdateRoleController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdateRoleRequest $request, \App\Models\Role $role)
    {
        try {
            $updated = RoleRepository::updateWithPermissions(
                $role,
                $request->validated(),
                $request->has('permissions') ? $request->normalizedPermissions() : null
            );
            return $this->returnSuccessResponse(__('messages.update_success'), $updated, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
