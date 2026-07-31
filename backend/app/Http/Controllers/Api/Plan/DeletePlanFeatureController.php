<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Models\PlanFeature;
use App\Repositories\PlanFeatureRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Delete(
 *     path="/api/admin/plan-features/{id}",
 *     tags={"Plan"},
 *     summary="Delete a plan feature",
 *     description="Permanently delete a plan feature and its translations.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the plan feature to delete",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=204,
 *         description="Plan feature deleted successfully"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Plan feature not found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error"
 *     )
 * )
 */
class DeletePlanFeatureController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * Handle the incoming request.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function __invoke(int $id): JsonResponse
    {
        try {
            $feature = PlanFeature::findOrFail($id);
            PlanFeatureRepository::destroy($feature);

            return response()->json(null, ResponseAlias::HTTP_NO_CONTENT);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->returnErrorResponse(__('plan_feature.not_found'), ResponseAlias::HTTP_NOT_FOUND);
        } catch (\Throwable $e) {
            Log::error('Error deleting plan feature: ' . $e->getMessage());
            return $this->returnErrorResponse(__('plan_feature.delete_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
