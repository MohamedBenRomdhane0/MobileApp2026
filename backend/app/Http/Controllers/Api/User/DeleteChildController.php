<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Annotations as OA;

class DeleteChildController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __construct(protected UserRepository $userRepository) {}

    /**
     * @OA\Delete(
     *     path="/api/parent/children/{childId}",
     *     summary="Delete a child account",
     *     tags={"Parent"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="childId",
     *         in="path",
     *         required=true,
     *         description="ID of the child user",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Child deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Child deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Unauthorized"),
     *     @OA\Response(response=404, description="Child not found")
     * )
     */
    public function __invoke(int $childId): JsonResponse
    {
        try {
            DB::beginTransaction();
            $result = $this->userRepository->deleteChild($childId);
            DB::commit();
            return $this->returnSuccessResponse(__('messages.child_deleted'), $result, Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
