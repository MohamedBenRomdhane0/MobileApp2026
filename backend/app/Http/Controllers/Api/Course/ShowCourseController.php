<?php
namespace App\Http\Controllers\Api\Course;

use App\Enum\RoleEnum;
use App\Http\Controllers\Controller;
use App\Repositories\CourseRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Exception;

/**
     * @OA\Get(
     * path="/api/admin/courses/{id}",
     * summary="Show a course by ID (Role-Based Access)",
     * description="Fetches details of a specific course with strict authorization: Admins (All), Teachers (Own), Children (Level match), Parents (Published).",
     * operationId="showCourse",
     * tags={"Admin"},
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the course to retrieve",
     * @OA\Schema(type="integer", example=5)
     * ),
     * @OA\Response(
     * response=200,
     * description="Course found successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Course retrieved successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Unauthorized access",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=false),
     * @OA\Property(property="message", type="string", example="Unauthorized access.")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Course not found",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=false),
     * @OA\Property(property="message", type="string", example="Course not found.")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal server error",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=false),
     * @OA\Property(property="message", type="string", example="An error occurred.")
     * )
     * )
     * )
 */
class ShowCourseController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $id): JsonResponse
    {
        try {
            $course = CourseRepository::findById($id);

            if (!$this->authorizeUser($request->user(), $course)) {
                return $this->returnErrorResponse(__('messages.unauthorized_access'), Response::HTTP_FORBIDDEN);
            }

            return $this->returnSuccessResponse(
                __('messages.course_retrieved'),
                $course,
                Response::HTTP_OK
            );

        } catch (Exception $e) {
            Log::error($e->getMessage());

            return $this->returnErrorResponse(
                __('messages.general_error'),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Internal authorization logic for role-based filtering.
     */
    private function authorizeUser($user, $course): bool
    {
        if (!$user) return false;

        if ($user->hasRole(RoleEnum::ADMIN)) {
            return true;
        }

        if ($user->hasRole(RoleEnum::TEACHER)) {
            return (int) $course->user_id === (int) $user->id;
        }

        return false;
    }
}