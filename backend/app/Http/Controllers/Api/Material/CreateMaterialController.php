<?php

namespace App\Http\Controllers\Api\Material;

use App\Http\Controllers\Controller;
use App\Http\Requests\Material\CreateMaterialRequest;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Repositories\MaterialRepository;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/material",
 *     summary="Create a new material",
 *     tags={"Admin"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name", "description"},
 *             @OA\Property(property="name", type="string", example="Material Name"),
 *             @OA\Property(property="description", type="string", example="Material Description")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Material created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Material created successfully"),
 *             @OA\Property(property="material", type="object")
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validation error")
 *)
 */

class CreateMaterialController extends Controller
{
    use SuccessResponse, ErrorResponse;
    
    /**
     * @param CreateMaterialRequest $request
     * @return JsonResponse
     */
    public function __invoke(CreateMaterialRequest $request): JsonResponse
    {
        try {
            $data = $this->getAttributes($request);
            $material = MaterialRepository::create($data);
            return $this->returnSuccessResponse(__('messages.material_created'), $material, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Error creating material: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? __('messages.failed_create_material'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * @param CreateMaterialRequest $request
     * @return array
     * @throws \Illuminate\Validation\ValidationException
     */
    private function getAttributes(CreateMaterialRequest $request): array
    {   
        return $request->validated();
    }

}