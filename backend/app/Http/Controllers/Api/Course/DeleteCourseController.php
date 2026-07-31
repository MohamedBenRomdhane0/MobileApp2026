<?php
namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Repositories\CourseRepository;
use App\Models\Course;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;
use App\Enum\CourseStatusEnum;

/**
 * @OA\Delete(
 *     path="/api/admin/courses/{id}",
 *     summary="Delete a course (Admin or Teacher if draft)",
 *     description="Admins can delete any course. Teachers can delete only their own draft courses.",
 *     operationId="deleteCourse",
 *     tags={"Courses"},
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the course to delete",
 *         @OA\Schema(type="integer", example=5)
 *     ),
 *
 *     @OA\Response(
 *         response=200,
 *         description="Course deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Course deleted successfully")
 *         )
 *     ),
 *
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized deletion attempt",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="You are not allowed to delete this course")
 *         )
 *     ),
 *
 *     @OA\Response(
 *         response=404,
 *         description="Course not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Course not found")
 *         )
 *     ),
 *
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="An error occurred while deleting the course")
 *         )
 *     )
 * )
 */
class DeleteCourseController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            $user = request()->user();
            $course = Course::find($id);

            if (!$course) {
                return $this->returnErrorResponse(trans('messages.course_not_found_or_could_not_be_deleted'), Response::HTTP_NOT_FOUND);
            }

            if (!$user->hasRole('admin')) {
                //---> Teachers can only delete their own draft courses
                if (
                    !$user->hasRole('teacher') ||
                    $course->user_id !== $user->id ||
                    $course->status !== CourseStatusEnum::DRAFT->value
                ) {
                    return $this->returnErrorResponse(trans('messages.not_allowed_to_delete_course'), Response::HTTP_FORBIDDEN);
                }
            }

            $deleted = CourseRepository::delete($id);

            if (!$deleted) {
                return $this->returnErrorResponse(trans('messages.course_not_found_or_could_not_be_deleted'), Response::HTTP_NOT_FOUND);
            }

            return $this->returnSuccessResponse(trans('messages.course_deleted_successfully'), null, Response::HTTP_OK);
        } catch (Throwable $e) {
            Log::error('Error deleting course: ' . $e->getMessage(), [
                'course_id' => $id,
                'user_id' => auth()->id(),
            ]);
            return $this->returnErrorResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}