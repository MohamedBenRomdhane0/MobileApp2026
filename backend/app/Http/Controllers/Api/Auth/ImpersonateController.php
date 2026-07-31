<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ImpersonateController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * @OA\Post(
     * path="/api/admin/impersonate/{userId}",
     * summary="Impersonate a user",
     * description="Allows an admin to generate an authentication token for a specific user to log in on their behalf.",
     * tags={"Auth"},
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="userId",
     * in="path",
     * required=true,
     * description="ID of the user to impersonate",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Impersonation started successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Impersonation started successfully."),
     * @OA\Property(
     * property="data",
     * type="object",
     * @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."),
     * @OA\Property(property="user", type="object")
     * )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Unauthorized",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="You do not have permission to impersonate users.")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="User not found",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="User not found.")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Failed to impersonate user.")
     * )
     * )
     * )
     */

    public function __invoke(int $userId): \Illuminate\Http\JsonResponse
    {
        try {
            $data = AuthRepository::impersonate($userId);

            return $this->returnSuccessResponse(__('messages.impersonation_started'), $data, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error("Failed to impersonate user {$userId}: " . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
