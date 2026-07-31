<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Repositories\PlanRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class SyncPlanAccessibleEntitiesController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Post(
     *     path="/api/admin/plans/{planId}/accessible-entities/sync",
     *     tags={"Plan"},
     *     summary="Sync plan accessible entities",
     *     description="Sync the accessible entities for a specific plan. This will replace all existing accessible entities with the provided list.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="planId",
     *         in="path",
     *         required=true,
     *         description="ID of the plan",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"accessible_entities"},
     *             @OA\Property(
     *                 property="accessible_entities",
     *                 type="array",
     *                 description="Array of entities to make accessible with this plan",
     *                 @OA\Items(
     *                     required={"accessible_type", "accessible_id"},
     *                     @OA\Property(property="accessible_type", type="string", example="Course", description="Entity type: Course, Quiz, Book, Material, LevelMaterial"),
     *                     @OA\Property(property="accessible_id", type="integer", example=5, description="ID of the accessible entity")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Accessible entities synced successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Accessible entities updated successfully"),
     *             @OA\Property(property="data", type="object", description="Updated plan with accessible entities")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Plan not found",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Plan not found"))
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Validation failed"))
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Error syncing entities"))
     *     )
     * )
     */
    public function __invoke(Request $request, int $planId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'accessible_entities' => 'required|array',
                'accessible_entities.*.accessible_type' => 'required|string',
                'accessible_entities.*.accessible_id' => 'required|integer',
                'accessible_entities.*.material_id' => 'required|integer|exists:materials,id',
            ]);

            DB::beginTransaction();

            $plan = \App\Models\Plan::findOrFail($planId);
            PlanRepository::syncAccessibleEntities($plan, $validated['accessible_entities']);

            DB::commit();

            $plan->load('accessibleEntities.accessible');

            return $this->returnSuccessResponse(
                __('plan.accessible_entities_updated'),
                $plan,
                ResponseAlias::HTTP_OK
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return $this->returnErrorResponse(
                $e->getMessage(),
                ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('[SyncPlanAccessibleEntitiesController] Error syncing accessible entities', [
                'plan_id' => $planId,
                'error' => $e->getMessage(),
                'exception' => $e,
            ]);

            return $this->returnErrorResponse(
                __('plan.accessible_entities_update_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
