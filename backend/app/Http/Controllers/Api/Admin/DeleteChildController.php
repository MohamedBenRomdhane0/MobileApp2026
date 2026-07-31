<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteChildController extends Controller
{
    use SuccessResponse, ErrorResponse;
public function __construct(protected UserRepository $userRepository) {}

  /**
     * @OA\Delete(
     * path="/api/admin/children/{childId}",
     * summary="Delete a child account",
     * description="Allows an admin to permanently delete a child account.",
     * tags={"Admin"},
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="childId",
     * in="path",
     * required=true,
     * description="ID of the child user",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Child deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Child deleted successfully"),
     * @OA\Property(property="data", type="null")
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
     * description="Unauthorized access",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="User does not have the right permissions.")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Child not found",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Child not found.")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="An error occurred while deleting the child.")
     * )
     * )
     * )
     */
        public function __invoke(int $childId): JsonResponse
    {
        try {
            $result = $this->userRepository->deleteChild($childId);
            return $this->returnSuccessResponse(__('messages.child_deleted_successfully'), $result, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_BAD_REQUEST);
        }
    }
}

