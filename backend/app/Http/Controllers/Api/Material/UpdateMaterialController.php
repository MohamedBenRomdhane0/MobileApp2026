<?php

namespace App\Http\Controllers\Api\Material;

use App\Http\Controllers\Controller;
use App\Http\Requests\Material\CreateMaterialRequest;
use App\Repositories\MaterialRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Patch(
 *     path="/api/admin/material/{materialId}",
 *     summary="Update a material",
 *     tags={"Admin"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="materialId",
 *         in="path",
 *         required=true,
 *         description="ID of the material to update",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name", "description"},
 *             @OA\Property(property="name", type="string", example="Updated Material Name"),
 *             @OA\Property(property="description", type="string", example="Updated Material Description")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Material updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Material updated successfully"),
 *             @OA\Property(property="material", type="object")
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validation error")
 *)
 */

class UpdateMaterialController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * @param CreateMaterialRequest $request
     * @param int $material_id
     * @return JsonResponse
     * 
     */
    public function __invoke($material_id, CreateMaterialRequest $request): JsonResponse
    {
        try {
            $data = $this->getAttributes($request);
            $material = MaterialRepository::update($material_id, $data);
            return $this->returnSuccessResponse(__('messages.material_updated'), $material, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error updating material: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage()??__('messages.material_update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * @param Request $request
     * @return array
     */
    protected function getAttributes(CreateMaterialRequest $request): array
    {
        return $request->validated();
    }
}
