<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Repositories\CourseRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Throwable;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Put(
 *     path="/api/admin/courses/{id}",
 *     summary="Update a course (Admin applies immediately, teacher submits for review)",
 *     description="Teachers submit update requests for review. Admins can update directly.",
 *     operationId="updateCourse",
 *     tags={"Courses"},
 *     security={{"bearerAuth":{}}},
 *
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Course ID to update",
 *         @OA\Schema(type="integer", example=5)
 *     ),
 *
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="title", type="string", example="Updated Physics 101"),
 *             @OA\Property(property="description", type="string", example="Updated description about energy and motion."),
 *             @OA\Property(property="type", type="integer", example=2),
 *             @OA\Property(property="level_material_id", type="integer", example=3),
 *             
 *             @OA\Property(
 *                 property="media",
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=12),
 *                 @OA\Property(property="file_name", type="string", example="updated-banner.jpg"),
 *                 @OA\Property(property="file_path", type="string", example="/uploads/media/updated-banner.jpg"),
 *                 @OA\Property(property="mime_type", type="string", example="image/jpeg"),
 *                 @OA\Property(property="title", type="string", example="New Course Banner"),
 *                 @OA\Property(property="description", type="string", example="Updated course cover"),
 *                 @OA\Property(property="size", type="integer", example=124578)
 *             ),
 *
 *             @OA\Property(
 *                 property="chapters",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="id", type="integer", example=9),
 *                     @OA\Property(property="title", type="string", example="Updated Chapter 1"),
 *                     @OA\Property(property="description", type="string", example="This chapter covers advanced topics."),
 *                     @OA\Property(property="order", type="integer", example=1),
 *                     @OA\Property(property="type", type="integer", example=1),
 *                     @OA\Property(
 *                         property="media",
 *                         type="array",
 *                         @OA\Items(
 *                             type="object",
 *                             @OA\Property(property="media_id", type="integer", example=32),
 *                             @OA\Property(property="file_name", type="string", example="lecture.mp4"),
 *                             @OA\Property(property="file_path", type="string", example="/uploads/videos/lecture.mp4"),
 *                             @OA\Property(property="mime_type", type="string", example="video/mp4"),
 *                             @OA\Property(property="title", type="string", example="Intro Video"),
 *                             @OA\Property(property="description", type="string", example="Chapter introduction"),
 *                             @OA\Property(property="size", type="integer", example=20480000)
 *                         )
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *
 *     @OA\Response(
 *         response=200,
 *         description="Course updated successfully (admin)",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Course updated successfully."),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Course update request submitted (teacher)",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Course update request submitted for review."),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Failed to update course",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Failed to update course")
 *         )
 *     )
 * )
 */


class UpdateCourseController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateCourseRequest $request, int $id): JsonResponse
    {
        try {
            $user = request()->user();
            $data = $request->validated();

            if ($user->hasRole('teacher')) {
                $updateRequest = CourseRepository::submitUpdateRequestFromTeacher($id, $data);
                return $this->returnSuccessResponse(__('messages.course_update_sent_for_review'), $updateRequest, ResponseAlias::HTTP_CREATED);
            }

            $course = CourseRepository::update($id, $data);
            return $this->returnSuccessResponse(__('messages.course_update_success'), $course, ResponseAlias::HTTP_OK);
        } catch (Throwable $e) {
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.failed_update_course'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
