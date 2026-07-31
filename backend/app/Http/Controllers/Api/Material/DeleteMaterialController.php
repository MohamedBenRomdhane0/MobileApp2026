<?php

namespace App\Http\Controllers\Api\Material;

use App\Http\Controllers\Controller;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Repositories\MaterialRepository;
use OpenApi\Annotations as OA;


/**
 * @OA\Delete(
 *     path="/api/admin/material/{materialId}",
 *     summary="Delete a material",
 *     tags={"Admin"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="materialId",
 *         in="path",
 *         required=true,
 *         description="ID of the material to delete",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Material deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Material deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Material not found"
 *     )
 *)
 */

class DeleteMaterialController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected $materialRepository;

    public function __construct(MaterialRepository $materialRepository)
    {
        $this->materialRepository = $materialRepository;
    }
    /**
     * @param int $material_id
     * @return JsonResponse
     */
    public function __invoke($material_id)
    {
        try {
            $this->materialRepository->delete($material_id);
            return $this->returnSuccessResponse(__('messages.material_deleted'), null, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error deleting material: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage()??__('messages.material_delete_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
