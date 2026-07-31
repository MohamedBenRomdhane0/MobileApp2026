<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Repositories\RoleRepository;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Traits\ErrorResponse;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/admin/roles/{role}",
 *     tags={"Roles and Permissions"},
 *     summary="Get role by ID",
 *     description="Retrieve a role by its ID.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="role",
 *         in="path",
 *         required=true,
 *         description="ID of the role to retrieve",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Role retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Role retrieved successfully"),
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

class GetRoleByIdController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * Handle the incoming request.
     */
    public function __invoke(\App\Models\Role $role)
    {
        try {
            $role = RoleRepository::findById($role->id);
            return $this->successResponse(__('messages.success'), $role, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            return $this->errorResponse(__('messages.internal_server_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
