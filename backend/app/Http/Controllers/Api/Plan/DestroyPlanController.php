<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Repositories\PlanRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class DestroyPlanController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Delete(
     *     path="/api/admin/plans/{id}",
     *     tags={"Plan"},
     *     summary="Delete a plan",
     *     description="Deletes a plan by its ID (soft delete)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the plan to delete",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Plan deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Plan not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Plan not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Plan deletion failed")
     *         )
     *     )
     * )
     */
    public function __invoke(int $id): JsonResponse
    {
        try {
            $deleted = PlanRepository::destroy($id);

            if ($deleted) {
                return $this->returnSuccessResponse(__('plan.deleted'), null, ResponseAlias::HTTP_NO_CONTENT);
            }

            return $this->returnErrorResponse(__('plan.not_found'), ResponseAlias::HTTP_NOT_FOUND);
        } catch (\Throwable $e) {
            Log::error("Error deleting plan: " . $e->getMessage(), ['exception' => $e]);
            return $this->returnErrorResponse( $e->getMessage() ?? __('plan.deletion_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
