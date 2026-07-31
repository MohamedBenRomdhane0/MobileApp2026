<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Repositories\CourseRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 * path="/api/child/courses/{id}",
 * tags={"Parent"},
 * summary="Get course details for child",
 * description="Retrieves a specific course if it belongs to the child's assigned level.",
 * operationId="getChildCourseById",
 * security={{"bearerAuth":{}}},
 * @OA\Parameter(
 * name="id",
 * in="path",
 * required=true,
 * description="ID of the course",
 * @OA\Schema(type="integer")
 * ),
 * @OA\Response(
 * response=200,
 * description="Success",
 * @OA\JsonContent(
 * @OA\Property(property="success", type="boolean", example=true),
 * @OA\Property(property="message", type="string", example="Course retrieved successfully."),
 * @OA\Property(property="data", ref="#/components/schemas/Course")
 * )
 * ),
 * @OA\Response(
 * response=403,
 * description="Forbidden",
 * @OA\JsonContent(
 * @OA\Property(property="success", type="boolean", example=false),
 * @OA\Property(property="message", type="string", example="Unauthorized access.")
 * )
 * ),
 * @OA\Response(
 * response=404,
 * description="Not Found",
 * @OA\JsonContent(
 * @OA\Property(property="success", type="boolean", example=false),
 * @OA\Property(property="message", type="string", example="Course not found.")
 * )
 * ),
 * @OA\Response(
 * response=500,
 * description="Internal Server Error",
 * @OA\JsonContent(
 * @OA\Property(property="success", type="boolean", example=false),
 * @OA\Property(property="message", type="string", example="An error occurred.")
 * )
 * )
 * )
 */
class GetCourseByIdForChildController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $id): JsonResponse
    {
        try {
            $course = CourseRepository::findById($id);

            $childLevelId = $request->user()->childProfile?->level_id;

            if (!$this->isAuthorized($course, $childLevelId)) {
                return $this->returnErrorResponse(
                    __('messages.unauthorized_access'), 
                    ResponseAlias::HTTP_FORBIDDEN
                );
            }

            return $this->returnSuccessResponse(
                __('messages.course_retrieved'),
                $course,
                ResponseAlias::HTTP_OK
            );

        } catch (Exception $e) {
            Log::error("Course Access Error: {$e->getMessage()}", [
                'user_id' => $request->user()->id,
                'course_id' => $id
            ]);

            return $this->returnErrorResponse(
                __('messages.general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Encapsulate authorization logic.
     */
    private function isAuthorized($course, ?int $childLevelId): bool
    {
        return $childLevelId && 
               $course && 
               (int) $course->level_id === (int) $childLevelId;
    }
}