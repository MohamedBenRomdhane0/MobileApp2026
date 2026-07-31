<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Repositories\CourseRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;
use OpenApi\Annotations as OA;

 /**
 * @OA\Post(
 *     path="/api/admin/courses",
 *     summary="Create a new course with chapters and media",
 *     tags={"Courses"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 required={"title", "type"},
 *                 
 *                 @OA\Property(property="title", type="string", example="Physics for Beginners"),
 *                 @OA\Property(property="description", type="string", example="Course description"),
 *                 @OA\Property(property="type", type="integer", example=1),
 *                 @OA\Property(property="level_material_id", type="integer", example=2),
 *                 
 *                 @OA\Property(
 *                     property="media",
 *                     type="string",
 *                     format="binary",
 *                     description="Main course media (e.g., video or PDF)"
 *                 ),

 *                 @OA\Property(
 *                     property="chapters[0][title]",
 *                     type="string",
 *                     example="Chapter 1"
 *                 ),
 *                 @OA\Property(
 *                     property="chapters[0][description]",
 *                     type="string",
 *                     example="Introduction to course"
 *                 ),
 *                 @OA\Property(
 *                     property="chapters[0][order]",
 *                     type="integer",
 *                     example=1
 *                 ),
 *                 @OA\Property(
 *                     property="chapters[0][media]",
 *                     type="string",
 *                     format="binary",
 *                     description="Media file for Chapter 1"
 *                 ),
 *                 
 *                 @OA\Property(
 *                     property="chapters[1][title]",
 *                     type="string",
 *                     example="Chapter 2"
 *                 ),
 *                 @OA\Property(
 *                     property="chapters[1][description]",
 *                     type="string",
 *                     example="Deep dive into motion"
 *                 ),
 *                 @OA\Property(
 *                     property="chapters[1][order]",
 *                     type="integer",
 *                     example=2
 *                 ),
 *                 @OA\Property(
 *                     property="chapters[1][media]",
 *                     type="string",
 *                     format="binary",
 *                     description="Media file for Chapter 2"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Course created successfully"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */

class StoreCourseController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * Handle the incoming request.
     *
     * @param StoreCourseRequest $request
     * @return JsonResponse
     */
    public function __invoke(StoreCourseRequest $request): JsonResponse
    {

        $data = $this->getAttributes($request);
        try {
            DB::beginTransaction();
            $course = CourseRepository::store($data);
            DB::commit();
            return $this->returnSuccessResponse('course_created_successfully', $course, 201);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return $this->returnErrorResponse($e->getMessage() ?? __('messages.general_error'), 500);
        }
    }

    private function getAttributes(StoreCourseRequest $request): array
    {
        return $request->validated();
    }
}
