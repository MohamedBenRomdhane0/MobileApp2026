<?php

namespace App\Http\Controllers\Api\Child;

use App\Enum\RoleEnum;
use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\CourseRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Annotations as OA;

class IndexCoursesForChildController extends Controller
{
     /**
     * @OA\Get(
     *     path="/api/child/courses",
     *     summary="List all courses (child)",
     *     tags={"Parent"},
     *     description="Returns a paginated list of courses based on the user role. Children see only courses matching their level.",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(
     *         name="keyword",
     *         in="query",
     *         description="Search in course title or description",
     *         required=false,
     *         @OA\Schema(type="string", example="math")
     *     ),
     *     @OA\Parameter(
     *         name="material_id",
     *         in="query",
     *         description="Filter by material_id",
     *         required=false,
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Number of items per page",
     *         required=false,
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Parameter(
     *         name="order_by",
     *         in="query",
     *         description="Field to sort by",
     *         required=false,
     *         @OA\Schema(type="string", example="created_at")
     *     ),
     *     @OA\Parameter(
     *         name="direction",
     *         in="query",
     *         description="Sort direction: asc or desc",
     *         required=false,
     *         @OA\Schema(type="string", example="desc")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Courses retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Courses retrieved successfully"),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="title", type="string", example="Introduction to Algebra"),
     *                 @OA\Property(property="description", type="string", example="This is an algebra course."),
     *                 @OA\Property(property="type", type="integer", example=1),
     *                 @OA\Property(property="media", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="chapters", type="array", @OA\Items(type="object")),
     *             )),
     *             @OA\Property(property="pagination", type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=100)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="An error occurred")
     *         )
     *     )
     * )
     */

    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);

        try {
            $user = Auth::user();
            $courses = CourseRepository::index($paginationParams, $user);

            return $this->returnSuccessPaginationResponse(__('course.retrieved'), $courses, Response::HTTP_OK, $paginationParams->isPaginated());
        } catch (\Throwable $e) {
            Log::error('Error retrieving courses: ' . $e->getMessage(), ['exception' => $e]);

            return $this->returnErrorResponse($e->getMessage() ?? __('course.error_retrieving'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        return (new QueryConfig())
            ->setFilters([
                'keyword' => $request->input('keyword'),
                'level_id' => $request->input('level_id'),
                'material_id' => $request->input('material_id')
            ])
            ->setPerPage($paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated($paginationParams['PAGINATION']);
    }
}