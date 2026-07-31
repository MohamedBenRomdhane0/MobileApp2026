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

class ShowPlanController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Get(
     *     path="/api/admin/plans/{id}",
     *     tags={"Plan"},
     *     summary="Get plan by ID",
     *     description="Retrieve full plan details by its ID including translations, features, pricings, and accessible entities.",
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the plan",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Plan details retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Plan found"),
     *             @OA\Property(property="data", type="object")
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
     *             @OA\Property(property="message", type="string", example="Error retrieving plan")
     *         )
     *     )
     * )
     */
    public function __invoke(int $id): JsonResponse
    {
        try {
            $plan = PlanRepository::show($id);

            return $this->returnSuccessResponse(__('plan.found'), $plan, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            Log::error("Error retrieving plan: " . $e->getMessage(), ['exception' => $e]);
            return $this->returnErrorResponse(__('plan.not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }
    }
}
