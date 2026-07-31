<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlanFeature\UpdatePlanFeatureRequest;
use App\Models\PlanFeature;
use App\Repositories\PlanFeatureRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/plan-features/{id}",
 *     summary="Update a plan feature",
 *     description="Updates the specified plan feature with translations and availability status.",
 *     operationId="updatePlanFeature",
 *     tags={"Plan"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the plan feature to update",
 *         required=true,
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"translations", "is_available"},
 *             @OA\Property(
 *                 property="translations",
 *                 type="array",
 *                 @OA\Items(
 *                     required={"locale", "text", "key"},
 *                     @OA\Property(property="locale", type="string", example="en"),
 *                     @OA\Property(property="text", type="string", example="Unlimited sites"),
 *                     @OA\Property(property="key", type="string", example="title")
 *                 )
 *             ),
 *             @OA\Property(property="is_available", type="boolean", example=true)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Plan feature updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="success"),
 *             @OA\Property(property="message", type="string", example="plan_feature_updated"),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Max Users"),
 *                 @OA\Property(property="value", type="integer", example=100)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Plan feature not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="error"),
 *             @OA\Property(property="message", type="string", example="plan_feature_not_found")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="error"),
 *             @OA\Property(property="message", type="string", example="plan_feature.update_error")
 *         )
 *     )
 * )
 */
class UpdatePlanFeatureController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * Handle the incoming request.
     *
     * @param UpdatePlanFeatureRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function __invoke(UpdatePlanFeatureRequest $request, int $id): JsonResponse
    {
        try {
            $feature = PlanFeature::findOrFail($id);
            $updated = PlanFeatureRepository::update($feature, $request->validated());
            return $this->returnSuccessResponse('plan_feature_updated', $updated, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            Log::error('Error updating plan feature: ' . $e->getMessage());
            return $this->returnErrorResponse(__('plan_feature.update_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
