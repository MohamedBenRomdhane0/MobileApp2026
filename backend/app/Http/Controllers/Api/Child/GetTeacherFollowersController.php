<?php

namespace App\Http\Controllers\Api\Child;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Http\Resources\FollowerResource;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Get(
 *   path="/api/child/teachers/{teacherId}/followers",
 *   tags={"Parent"},
 *   summary="Get followers list (children) for a teacher",
 *   security={{"bearerAuth":{}}},
 *   @OA\Parameter(
 *      name="teacherId",
 *      in="path",
 *      required=true,
 *      @OA\Schema(type="integer")
 *   ),
 *   @OA\Parameter(
 *      name="page",
 *      in="query",
 *      required=false,
 *      @OA\Schema(type="integer", default=1)
 *   ),
 *   @OA\Parameter(
 *      name="per_page",
 *      in="query",
 *      required=false,
 *      @OA\Schema(type="integer", default=15)
 *   ),
 *   @OA\Response(response=200, description="Success"),
 *   @OA\Response(response=404, description="Teacher not found"),
 *   @OA\Response(response=500, description="Internal server error")
 * )
 */
class GetTeacherFollowersController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request, int $teacherId): JsonResponse
    {
        try {
            $paginationParams = $this->getAttributes($request);

            $followers = UserRepository::getTeacherFollowers($teacherId, $paginationParams);

            return $this->returnSuccessPaginationResponse(
                __('messages.success'),
                FollowerResource::collection($followers),
                ResponseAlias::HTTP_OK,
                $paginationParams->isPaginated()
            );
        } catch (ModelNotFoundException $e) {
            return $this->returnErrorResponse(
                __('messages.teacher_not_found'),
                ResponseAlias::HTTP_NOT_FOUND
            );
        } catch (Exception $e) {
            Log::error('Error getting teacher followers', [
                'teacher_id' => $teacherId,
                'error'      => $e->getMessage(),
                'trace'      => $e->getTraceAsString(),
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?? __('messages.error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $request->input('keyword', null),
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)->setPerPage($paginationParams['PER_PAGE'])->setOrderBy($paginationParams['ORDER_BY'])->setDirection($paginationParams['DIRECTION'])->setPaginated($paginationParams['PAGINATION']);
        return $search;
    }
}
