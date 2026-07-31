<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Http\Requests\Level\UpdateLevelRequest;
use App\Repositories\LevelRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Js;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Annotations as OA;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Patch(
 *     path="/api/admin/levels/{levelId}",
 *     summary="Update a level",
 *     tags={"Admin"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="levelId",
 *         in="path",
 *         required=true,
 *         description="ID of the level to update",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", example="New Level Name"),
 *             @OA\Property(property="description", type="string", example="Updated description")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Level updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Level updated successfully"),
 *             @OA\Property(property="level", type="object")
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validation error")
 * )
 */

class UpdateLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * @param CreateLevelRequest $request
     * @param int $level_id
     * @return JsonResponse
     */
    public function __invoke(UpdateLevelRequest $request, int $level_id): JsonResponse
    {
        $data = $this->getAttributes($request);

        try {
            $level = LevelRepository::update($level_id, $data);
            return $this->returnSuccessResponse(__('messages.success'), $level, ResponseAlias::HTTP_OK);
        }
        catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?: __('general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(UpdateLevelRequest $request): array
    {
        return $request->validated();
    }
}
