<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Repositories\CourseFavoriteRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class ToggleCourseFavoriteController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Post(
     *   path="/api/child/courses/{course}/favorite",
     *   tags={"Parent"},
     *   summary="Toggle favorite state for a course",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="course",
     *     in="path",
     *     required=true,
     *     description="Course ID",
     *     @OA\Schema(type="integer")
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Favorite toggled successfully"
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=404, description="Course not found")
     * )
     */
    public function __invoke(Request $request, Course $course)
    {
        try {
            DB::beginTransaction();
            $user = $request->user();

            $isFavorite = CourseFavoriteRepository::toggle($user, (int) $course->id);
            DB::commit();
            
            return $this->returnSuccessResponse(
            __('messages.success'),
            [
                'course_id'   => (int) $course->id,
                'is_favorite' => (bool) $isFavorite,
            ],
            ResponseAlias::HTTP_OK
        );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse($e->getMessage(), $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
