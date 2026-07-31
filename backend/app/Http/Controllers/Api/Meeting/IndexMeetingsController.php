<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\IndexMeetingsRequest;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Request;

/**
 * @OA\Get(
 *     path="/api/admin/meetings",
 *     summary="Get list of meetings",
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
 *         name="search",
 *         in="query",
 *         description="Search term",
 *         required=false,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Meetings retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Meetings retrieved successfully"),
 *             @OA\Property(property="data", type="object")
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
class IndexMeetingsController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request)
    {
        try {
            $queryConfig = $this->getAttributes($request);
            $user = auth()->user();

            $meetings = MeetingRepository::index($queryConfig, $user);

            return $this->returnSuccessPaginationResponse(
                __('messages.meeting_retreived_successfully'),
                $meetings,
                ResponseAlias::HTTP_OK,
                 $queryConfig->isPaginated()
            );
        } catch (\Exception $exception) {
            Log::error($exception);
            return $this->returnErrorResponse(
                $exception->getMessage() ?? __('messages.general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $paginationParams['KEYWORD'] ?? '',
            'level_id' => $request->level_id,
            'material_id' => $request->material_id,
            'status' => $request->status,
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)->setPerPage($paginationParams['PER_PAGE'])->setOrderBy($paginationParams['ORDER_BY'])->setDirection($paginationParams['DIRECTION'])->setPaginated($paginationParams['PAGINATION'])->setPage($paginationParams['PAGE']);
        return $search;
    }
}
