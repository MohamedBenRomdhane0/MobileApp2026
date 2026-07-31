<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\AssignRoleRequest;
use App\Models\User;
use App\Repositories\RoleRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/roles/assign/{user}",
 *     tags={"Roles and Permissions"},
 *     summary="Assign a role to a user",
 *     description="Assign a role to a user by their ID.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="user_id",
 *         in="path",
 *         required=true,
 *         description="ID of the user to assign the role to",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"role"},
 *             @OA\Property(property="role", type="string", example="admin")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Role assigned successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Role assigned successfully"),
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

class AssignRoleToUserController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(AssignRoleRequest $request, User $user)
    {
        try {
            $updatedUser = RoleRepository::assignRoleToUser($user, $request->role_ids);
            return $this->returnSuccessResponse(__('messages.role_assigned'), $updatedUser, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            return $this->returnErrorResponse(__('messages.role_assign_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
