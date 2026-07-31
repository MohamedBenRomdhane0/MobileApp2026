<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Repositories\LevelRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Delete(
 *     path="/api/admin/levels/{levelId}",
 *     summary="Delete a level",
 *     tags={"Admin"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="levelId",
 *         in="path",
 *         required=true,
 *         description="ID of the level to delete",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Level deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Level deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Level not found"
 *     )
 *)
 */

class DeleteLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;

        protected $levelRepository;

    public function __construct(LevelRepository $levelRepository)
    {
        $this->levelRepository = $levelRepository;
    }
    /**
     * @param $level_id
     * @return JsonResponse
     */
    public function __invoke($level_id):  JsonResponse
    {
        try {
            $this->levelRepository->delete($level_id);
            return $this->returnSuccessResponse(__('messages.level_deleted'), null, ResponseAlias::HTTP_OK);
        }
        catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?: __('general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
