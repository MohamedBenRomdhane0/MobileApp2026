<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plan\UpdatePlanRequest;
use App\Repositories\PlanRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class UpdatePlanController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Post(
     *     path="/api/admin/plans/{id}",
     *     tags={"Plan"},
     *     summary="Update a plan",
     *     description="Update plan details, features, and translations.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the plan to update",
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"is_popular", "plan_type", "level_id", "translations"},
     *             @OA\Property(property="is_popular", type="boolean", example=true),
     *             @OA\Property(property="plan_type", type="string", example="ANNEE_SCOLAIRE", description="Plan type enum: ANNEE_SCOLAIRE or CONCOURS"),
     *             @OA\Property(property="level_id", type="integer", example=1, description="Level ID associated with the plan"),
     *             @OA\Property(
     *                 property="feature_ids",
     *                 type="array",
     *                 @OA\Items(type="integer", example=1)
     *             ),
     *             @OA\Property(
     *                 property="translations",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="locale", type="string", example="en"),
     *                     @OA\Property(property="key", type="string", example="title", description="Translation key: title or description"),
     *                     @OA\Property(property="text", type="string", example="Premium Plan")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="pricings",
     *                 type="array",
     *                 description="Array of pricing options for the plan",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1, nullable=true, description="Pricing ID for updates"),
     *                     @OA\Property(property="months", type="integer", example=12, description="Duration in months"),
     *                     @OA\Property(property="price", type="number", format="float", example=99.99, description="Price amount"),
     *                     @OA\Property(property="discount", type="number", format="float", example=10.00, description="Discount percentage"),
     *                     @OA\Property(property="is_highlighted", type="boolean", example=false, description="Whether this pricing is highlighted"),
     *                     @OA\Property(property="status", type="integer", example=1, description="Status: 0=INACTIVE, 1=ACTIVE"),
     *                     @OA\Property(property="start_date", type="string", format="date", example="2025-07-01", nullable=true, description="Pricing start date"),
     *                     @OA\Property(property="end_date", type="string", format="date", example="2025-12-31", nullable=true, description="Pricing end date")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="accessible_entities",
     *                 type="array",
     *                 description="Array of entities accessible with this plan",
     *                 @OA\Items(
     *                     @OA\Property(property="accessible_type", type="string", example="Course", description="Entity type: Course, Quiz, Book, Material, LevelMaterial"),
     *                     @OA\Property(property="accessible_id", type="integer", example=5, description="ID of the accessible entity")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Plan updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Plan updated successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Plan not found",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Plan not found"))
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Update failed",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Plan update failed"))
     *     )
     * )
     */
    public function __invoke(UpdatePlanRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $plan = PlanRepository::update($id, $request->validated());
            DB::commit();

            return $this->returnSuccessResponse(__('plan.updated'), $plan, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error updating plan: " . $e->getMessage(), ['exception' => $e]);
            return $this->returnErrorResponse( $e->getMessage() ??__('plan.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
