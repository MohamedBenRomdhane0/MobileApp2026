<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeacherProfileResource;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Get(
 *   path="/api/child/teachers/{id}",
 *   tags={"Child"},
 *   summary="Get teacher by ID",
 *   security={{"bearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     description="Teacher ID",
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(
 *     response=200,
 *     description="Teacher loaded successfully"
 *   ),
 *   @OA\Response(
 *     response=404,
 *     description="Teacher not found"
 *   ),
 *   @OA\Response(
 *     response=500,
 *     description="Internal server error"
 *   )
 * )
 */
class GetTeacherByIdController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            $teacher = UserRepository::getTeacherByIdForChild($id);

            return $this->returnSuccessResponse(
                __('messages.success'),
                new TeacherProfileResource($teacher),
                ResponseAlias::HTTP_OK
            );
        } catch (ModelNotFoundException $e) {
            return $this->returnErrorResponse(
                __('messages.teacher_not_found'),
                ResponseAlias::HTTP_NOT_FOUND
            );
        } catch (\Throwable $e) {
            Log::error('GetTeacherById failed', [
                'teacher_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->returnErrorResponse(
                __('messages.error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}