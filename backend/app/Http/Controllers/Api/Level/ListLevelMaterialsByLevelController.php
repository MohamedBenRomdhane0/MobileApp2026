<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Http\Requests\Level\ListLevelMaterialsByLevelRequest;
use App\Repositories\LevelMaterialRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class ListLevelMaterialsByLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Get(
     *   path="/api/levels/{levelId}/level-materials",
     *   summary="List level_materials for a given level",
     *   tags={"Levels"},
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="levelId",
     *     in="path",
     *     required=true,
     *     description="Level ID",
     *     @OA\Schema(type="integer", example=4)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="OK",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="messages.success"),
     *       @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=422, description="Invalid level id"),
     *   @OA\Response(response=500, description="Server error")
     * )
     */
    public function __invoke(ListLevelMaterialsByLevelRequest $request, int $levelId)
    {
        try {
            $items = LevelMaterialRepository::listByLevel($levelId);

            return $this->returnSuccessResponse(
                __('messages.success'),
                $items ?? [],
                ResponseAlias::HTTP_OK
            );
        } catch (Exception $e) {
            Log::error('[ListLevelMaterialsByLevelController] ' . $e->getMessage(), ['exception' => $e]);

            return $this->returnErrorResponse(
                __('messages.error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
