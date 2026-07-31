<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\IndexMeetingsForChildRequest;
use App\Http\Resources\MeetingIndexResource;
use App\Repositories\MeetingRepository;
use App\Traits\PaginationParams;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/child/meetings",
 *     summary="Get meetings list for authenticated child",
 *     tags={"Meeting"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="page",
 *         in="query",
 *         description="Page number",
 *         required=false,
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Parameter(
 *         name="per_page",
 *         in="query",
 *         description="Items per page",
 *         required=false,
 *         @OA\Schema(type="integer", example=15)
 *     ),
 *     @OA\Parameter(
 *         name="pagination",
 *         in="query",
 *         description="Enable pagination",
 *         required=false,
 *         @OA\Schema(type="boolean", example=true)
 *     ),
 *     @OA\Parameter(
 *         name="order_by",
 *         in="query",
 *         description="Order by field",
 *         required=false,
 *         @OA\Schema(type="string", example="created_at")
 *     ),
 *     @OA\Parameter(
 *         name="direction",
 *         in="query",
 *         description="Order direction",
 *         required=false,
 *         @OA\Schema(type="string", enum={"asc", "desc"}, example="desc")
 *     ),
 *     @OA\Parameter(
 *         name="keyword",
 *         in="query",
 *         description="Search by meeting name",
 *         required=false,
 *         @OA\Schema(type="string", example="math")
 *     ),
 *     @OA\Parameter(
 *         name="material_id",
 *         in="query",
 *         description="Filter by material id",
 *         required=false,
 *         @OA\Schema(type="integer", example=2)
 *     ),
 *     @OA\Parameter(
 *         name="teacher_id",
 *         in="query",
 *         description="Filter by teacher id",
 *         required=false,
 *         @OA\Schema(type="integer", example=5)
 *     ),
 *     @OA\Parameter(
 *         name="has_free_trial",
 *         in="query",
 *         description="Filter meetings with free trial",
 *         required=false,
 *         @OA\Schema(type="boolean", example=true)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Meetings retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Meetings retrieved successfully"),
 *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
class IndexMeetingsForChildController extends Controller
{
    use PaginationParams;

    public function __invoke(IndexMeetingsForChildRequest $request): AnonymousResourceCollection
    {
        $queryConfig = $this->getAttributes($request);
        $user = auth()->user();

        $meetings = MeetingRepository::indexForChild($queryConfig, $user);

        return MeetingIndexResource::collection($meetings)->additional([
            'message' => __('messages.meeting_retreived_successfully'),
        ]);
    }

    private function getAttributes(IndexMeetingsForChildRequest $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $request->input('keyword', $paginationParams['KEYWORD'] ?? ''),
            'material_id' => $request->input('material_id'),
            'teacher_id' => $request->input('teacher_id'),
            'has_free_trial' => $request->input('has_free_trial'),
        ];

        $search = new QueryConfig();

        $search->setFilters($filters)
            ->setPerPage($paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated($paginationParams['PAGINATION'])
            ->setPage($paginationParams['PAGE']);

        return $search;
    }
}