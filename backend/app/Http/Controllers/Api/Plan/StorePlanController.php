<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plan\StorePlanRequest;
use App\Repositories\PlanRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class StorePlanController extends Controller
{
    use SuccessResponse, ErrorResponse;

/**
 * @OA\Post(
 *     path="/api/admin/plans",
 *     tags={"Plan"},
 *     summary="Create a new plan",
 *     description="Create a new plan with optional features, translations, and pricing entries.",
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"is_popular", "plan_type", "level_id", "translations"},
 *             @OA\Property(property="is_popular", type="boolean", example=true),
 *             @OA\Property(property="plan_type", type="string", example="ANNEE_SCOLAIRE", description="Plan type enum: ANNEE_SCOLAIRE or CONCOURS"),
 *             @OA\Property(property="level_id", type="integer", example=1, description="Level ID associated with the plan"),
 *             
 *             @OA\Property(
 *                 property="feature_ids",
 *                 type="array",
 *                 @OA\Items(type="integer", example=1)
 *             ),
 *
 *             @OA\Property(
 *                 property="translations",
 *                 type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="locale", type="string", example="en"),
 *                     @OA\Property(property="text", type="string", example="Premium Plan")
 *                 )
 *             ),
 *
 *             @OA\Property(
 *                 property="pricings",
 *                 type="array",
 *                 description="Array of pricing options for the plan",
 *                 @OA\Items(
 *                     @OA\Property(property="months", type="integer", example=12, description="Duration in months"),
 *                     @OA\Property(property="price", type="number", format="float", example=99.99, description="Price amount (for total pricing type)"),
 *                     @OA\Property(property="discount", type="number", format="float", example=10.00, description="Discount percentage"),
 *                     @OA\Property(property="is_highlighted", type="boolean", example=false, description="Whether this pricing is highlighted"),
 *                     @OA\Property(property="status", type="integer", example=1, description="Status: 0=INACTIVE, 1=ACTIVE"),
 *                     @OA\Property(property="start_date", type="string", format="date", example="2025-07-01", nullable=true, description="Pricing start date"),
 *                     @OA\Property(property="end_date", type="string", format="date", example="2025-12-31", nullable=true, description="Pricing end date"),
 *                     @OA\Property(property="pricing_type", type="string", example="total", description="Pricing type: total or per_material"),
 *                     @OA\Property(
 *                         property="material_pricings",
 *                         type="array",
 *                         description="Array of material pricing details (required when pricing_type is per_material)",
 *                         @OA\Items(
 *                             @OA\Property(property="material_id", type="integer", example=5, description="Material ID"),
 *                             @OA\Property(property="price", type="number", format="float", example=25.99, description="Material price"),
 *                             @OA\Property(property="discount", type="number", format="float", example=5.00, description="Material discount")
 *                         )
 *                     )
 *                 )
 *             ),
 *
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
 *         response=201,
 *         description="Plan created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Plan created successfully"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Error creating plan")
 *         )
 *     )
 * )
 */

public function __invoke(StorePlanRequest $request): JsonResponse
{
    try {
        DB::beginTransaction();
        $plan = PlanRepository::store($request->validated());
        DB::commit();
        return $this->returnSuccessResponse(__('plan.created'), $plan, ResponseAlias::HTTP_CREATED);
    } catch (\Throwable $e) {
        DB::rollBack();
        Log::error('Error creating plan: ' . $e->getMessage(), ['exception' => $e]);
        return $this->returnErrorResponse($e->getMessage() ?? __('plan.creation_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
    }
}

}
