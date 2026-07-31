<?php

namespace App\Http\Controllers\Api\Material;

use App\Http\Controllers\Controller;
use App\Http\Requests\Material\AssignMaterialsToLevelRequest;
use App\Repositories\MaterialRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/levels/{level_id}/assign-materials",
 *     summary="Assign materials to a level",
 *     tags={"Levels"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="level_id",
 *         in="path",
 *         required=true,
 *         description="ID of the level to assign materials to",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"material_ids"},
 *             @OA\Property(property="material_ids", type="array", @OA\Items(type="integer"))
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Materials assigned successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Materials assigned to level successfully"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validation error")
 *)
 */

class AssignMaterialsToLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * @param AssignMaterialsToLevelRequest $request
     * @param int $levelId
     * @return JsonResponse
     */
    public function __invoke(AssignMaterialsToLevelRequest $request, int $levelId): JsonResponse
    {
        try {
            $data = $this->getAttributes($request);
            $result = MaterialRepository::assignToLevel($levelId, $data['material_ids']);
            return $this->successResponse(__('messages.materials_assigned_to_level'), $result, ResponseAlias::HTTP_OK);
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());

            return $this->errorResponse($exception->getMessage() ?: __('messages.materials_assigned_to_level_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(AssignMaterialsToLevelRequest $request): array
    {
        return $request->validated();
    }
}
