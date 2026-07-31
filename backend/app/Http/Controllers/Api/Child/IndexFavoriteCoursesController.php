<?php

namespace App\Http\Controllers\Api\Child;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\CourseFavoriteRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class IndexFavoriteCoursesController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    /**
     * @OA\Get(
     *   path="/api/child/courses/favorites",
     *   tags={"Parent"},
     *   summary="List favorite courses for the authenticated child",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=200,
     *     description="List of favorite courses returned successfully"
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function __invoke(Request $request)
    {
        try {
            $user = $request->user();

            $qc = $this->getAttributes($request);

            $courses = CourseFavoriteRepository::index($user, $qc);

            return $this->returnSuccessPaginationResponse(
                __('messages.success'),
                $courses,
                ResponseAlias::HTTP_OK,
                $qc->getPaginated()
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());

            return $this->returnErrorResponse(
                $e->getMessage() ?? __('messages.fetch_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        return (new QueryConfig())
            ->setFilters([
                'keyword' => $request->query('keyword'),
                'user_id' => (int) optional($request->user())->id,
            ])
            ->setPerPage($paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated($paginationParams['PAGINATION'])
            ->setPage($paginationParams['PAGE']);
    }
}
