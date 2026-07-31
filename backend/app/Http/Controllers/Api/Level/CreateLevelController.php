<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Http\Requests\Level\CreateLevelRequest;
use App\Repositories\LevelRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/level",
 *     tags={"Admin"},
 *     summary="Create a new level",
 *     description="Create a new level with the given name.",
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string", example="Beginner")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Level created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Level created successfully"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Internal server error")
 *         )
 *     )
 *)
 */

class CreateLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * Handle the incoming request.
     */
    public function __invoke(CreateLevelRequest $request)
    {
        try 
        {
            $validatedData = $this->getAttributes($request);
            $level = LevelRepository::create($validatedData);
            return $this->returnSuccessResponse(__('create_level_success'), $level, ResponseAlias::HTTP_CREATED);
        }
        catch (\Exception $e) 
        {   
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? __('create_level_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(CreateLevelRequest $request): array
    {
        return $request->validated();
    }
}
