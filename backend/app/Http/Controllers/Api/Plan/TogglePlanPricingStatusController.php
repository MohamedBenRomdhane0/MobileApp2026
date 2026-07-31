<?php

namespace App\Http\Controllers\Api\Plan;

use App\Enum\StatusEnum;
use App\Http\Controllers\Controller;
use App\Models\PlanPricing;
use App\Repositories\PlanRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class TogglePlanPricingStatusController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Post(
     *     path="/api/admin/plan-pricings/{id}/toggle-status",
     *     tags={"Plan"},
     *     summary="Toggle plan pricing status",
     *     description="Toggle the status of a plan pricing between ACTIVE (1) and INACTIVE (0).",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the plan pricing to toggle",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Plan pricing status toggled successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Pricing status updated successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status", type="integer", example=1, description="New status: 0=INACTIVE, 1=ACTIVE")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Plan pricing not found",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Plan pricing not found"))
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Error toggling status"))
     *     )
     * )
     */
    public function __invoke(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $planPricing= PlanRepository::togglePlanPricingStatus($id);
            DB::commit();
            return $this->returnSuccessResponse(
                __('plan.pricing_status_updated'),
                $planPricing,
                ResponseAlias::HTTP_OK
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Error toggling plan pricing status: " . $e->getMessage(), ['exception' => $e]);
            return $this->returnErrorResponse(
                __('plan.pricing_status_update_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
