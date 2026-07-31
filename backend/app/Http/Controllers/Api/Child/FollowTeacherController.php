<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *   path="/api/child/teachers/{teacherId}/follow",
 *   tags={"Parent"},
 *   summary="Follow or unfollow a teacher",
 *   security={{"bearerAuth":{}}},
 *   @OA\Parameter(name="teacherId", in="path", required=true, @OA\Schema(type="integer")),
 *   @OA\Response(response=200, description="Success"),
 *   @OA\Response(response=404, description="Teacher not found"),
 *   @OA\Response(response=403, description="Unauthorized"),
 *   @OA\Response(response=500, description="Internal server error")
 * )
 */
class FollowTeacherController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $teacherId): JsonResponse
    {
        try {
            $child = $request->user();

            if (!$child instanceof User) {
                throw new AuthorizationException(__('messages.unauthorized'));
            }

            DB::beginTransaction();

            $followed = UserRepository::toggleTeacherFollow($child, $teacherId);

            DB::commit();

            return $this->returnSuccessResponse(
                __('messages.teacher_followed'),
                $followed,
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

            Log::error('Error following teacher', [
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