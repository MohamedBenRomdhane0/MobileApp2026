<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Repositories\RoleRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;


/**
 * @OA\Delete(
 *     path="/api/admin/roles/{role}",
 *     tags={"Roles and Permissions"},
 *     summary="Delete a role",
 *     description="Delete a role by its ID.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="role",
 *         in="path",
 *         required=true,
 *         description="ID of the role to delete",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Role deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Role deleted successfully"),
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

class DeleteRoleController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * Handle the incoming request.
     */
    public function __invoke(\App\Models\Role $role)
    {
        try {
            $role = RoleRepository::delete($role->id);
            return $this->returnSuccessResponse(__('messages.delete_success'), $role, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            return $this->returnErrorResponse(__('messages.internal_server_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
