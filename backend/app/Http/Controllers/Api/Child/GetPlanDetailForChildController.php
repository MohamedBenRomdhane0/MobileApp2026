<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Repositories\PlanRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;
/**
 * @OA\Get(
 *     path="/api/child/plans/{id}/details",
 *     tags={"Parent"},
 *     summary="Get full pricing details for a plan (for child)",
 *     description="Returns all available pricing options for a plan that match the authenticated child's level. Includes translations, features, and pricing options.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the plan",
 *         @OA\Schema(type="integer", example=3)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Plan details retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="Plan details found"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 description="Plan with translations, features and pricings filtered by child level"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Child or level not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Child or child level not found for the authenticated user.")
 *         )
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
 *             @OA\Property(property="message", type="string", example="Error retrieving plan details")
 *         )
 *     )
 * )
 */

class GetPlanDetailForChildController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $id): JsonResponse
    {
        try {
            $levelId = $request->user()->childProfile?->level_id;

            if (!$levelId) {
                return $this->returnErrorResponse(__('plan.level_not_assigned'), ResponseAlias::HTTP_NOT_FOUND);
            }

            $plan = PlanRepository::getPlanDetailsForChild($id, (int) $levelId);

            return $this->returnSuccessResponse(
                __('plan.retrieved_successfully'),
                $plan,
                ResponseAlias::HTTP_OK
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? __('plan.not_found_or_unauthorized'), ResponseAlias::HTTP_NOT_FOUND);
        }
    }
}
