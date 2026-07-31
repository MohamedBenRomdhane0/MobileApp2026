<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Http\Requests\Child\StoreTeacherReviewRequest;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *   path="/api/child/teachers/{teacherId}/review",
 *   tags={"Parent"},
 *   summary="Create or update a child review for a teacher",
 *   security={{"bearerAuth":{}}},
 *   @OA\Parameter(name="teacherId", in="path", required=true, @OA\Schema(type="integer")),
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(
 *       required={"rating"},
 *       @OA\Property(property="rating", type="integer", example=5),
 *       @OA\Property(property="comment", type="string", nullable=true, example="Excellent teacher")
 *     )
 *   ),
 *   @OA\Response(response=200, description="Success"),
 *   @OA\Response(response=404, description="Teacher not found"),
 *   @OA\Response(response=403, description="Unauthorized"),
 *   @OA\Response(response=422, description="Validation failed"),
 *   @OA\Response(response=500, description="Internal server error")
 * )
 */
class StoreTeacherReviewController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreTeacherReviewRequest $request, int $teacherId): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $result = UserRepository::saveTeacherReviewForChild($request->user(), $teacherId, $validated);

            DB::commit();

            $message = !empty($result['is_created'])
                ? __('messages.review_created')
                : __('messages.review_updated');

            return $this->returnSuccessResponse(
                $message,
                $result,
                ResponseAlias::HTTP_OK
            );
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->returnErrorResponse(
                __('messages.teacher_not_found'),
                ResponseAlias::HTTP_NOT_FOUND
            );
        } catch (AuthorizationException $e) {
            DB::rollBack();

            return $this->returnErrorResponse(
                __('messages.unauthorized'),
                ResponseAlias::HTTP_FORBIDDEN
            );
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Error saving teacher review', [
                'teacher_id' => $teacherId,
                'error' => $e->getMessage(),
            ]);

            return $this->returnErrorResponse(
                __('messages.error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}