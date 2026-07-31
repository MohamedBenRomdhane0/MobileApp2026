<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlanFeature\StorePlanFeatureRequest;
use App\Repositories\PlanFeatureRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/plan-features",
 *     tags={"Plan"},
 *     summary="Create a new plan feature",
 *     description="Creates a new plan feature with availability status and multilingual translations.",
 *     operationId="storePlanFeature",
 *     security={{"bearerAuth":{}}},
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
 *         response=201,
 *         description="Plan feature created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="landing_plan_created"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="The given data was invalid."),
 *             @OA\Property(property="errors", type="object", additionalProperties=@OA\Schema(type="array", @OA\Items(type="string")))
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="An unexpected error occurred.")
 *         )
 *     )
 * )
 */


class StorePlanFeatureController extends Controller
{
    use ErrorResponse, SuccessResponse;
    /**
     * Create a new Plan Feature
     * @param StorePlanFeatureRequest $request
     * @return JsonResponse
     */

    public function __invoke(StorePlanFeatureRequest $request): JsonResponse
    {
        try {
            $data = $this->getAttributes($request);
            $feature = PlanFeatureRepository::store($data);
            return $this->returnSuccessResponse('landing_plan_created', $feature, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Error creating plan feature: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage()?:__('plan_feature.create_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get attributes from the request
     *
     * @param StorePlanFeatureRequest $request
     * @return array
     */
    protected function getAttributes(StorePlanFeatureRequest $request): array
    {
        return $request->validated();
    }
}
