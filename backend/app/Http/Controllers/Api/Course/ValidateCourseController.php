<?php
namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Repositories\CourseRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/courses/{id}/validate",
 *     summary="Validate a course and publish it",
 *     description="Admin-only endpoint. If the course has a pending update request, the changes will be applied. If it's a new course, it will be marked as published.",
 *     operationId="validateCourse",
 *     tags={"Courses"},
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the course to validate",
 *         @OA\Schema(type="integer", example=8)
 *     ),
 *
 *     @OA\Response(
 *         response=200,
 *         description="Course validated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Course validated and published successfully."),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *
 *     @OA\Response(
 *         response=404,
 *         description="Course not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Course not found.")
 *         )
 *     ),
 *
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error during course validation",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Failed to validate course.")
 *         )
 *     )
 * )
 */


class ValidateCourseController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            $course = CourseRepository::validateCourse($id);

            if (!$course) {
                return $this->returnErrorResponse(__('messages.course_not_found'), Response::HTTP_NOT_FOUND);
            }
            return $this->returnSuccessResponse(__('messages.course_validated_successfully'), $course, Response::HTTP_OK);
        } catch (Throwable $e) {
            Log::error('Error validating course: ' . $e->getMessage(), [
                'course_id' => $id,
                'user_id' => auth()->id(),
            ]);
            return $this->returnErrorResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
