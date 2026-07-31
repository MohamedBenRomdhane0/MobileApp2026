<?php

namespace App\Http\Controllers\Api\Book;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/child/books",
 *     summary="Get all books",
 *     tags={"Parent"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="keyword",
 *         in="query",
 *         description="Filter books by title",
 *         required=false,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Parameter(
 *         name="material_id",
 *         in="query",
 *         description="Filter books by material id",
 *         required=false,
 *         @OA\Schema(type="integer", example=2, minimum=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Books retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Books found"),
 *             @OA\Property(property="data", type="array", @OA\Items()),
 *             @OA\Property(property="pagination", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Failed to fetch books",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Failed to fetch books")
 *         )
 *     )
 * )
 */
class IndexBooksController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request)
    {
        try {
            $childId = $request->input('child_id', null);
            $levelId = $request->input('level_id', null);

            if ($childId !== null) {
                $childProfile = ChildProfile::where('user_id', $childId)
                    ->where('parent_id', $request->user()->id)
                    ->first();

                if (!$childProfile) {
                    return $this->returnErrorResponse(__('messages.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
                }

                $levelId = $childProfile->level_id ?? $levelId;
            }

            $queryConfig = $this->getAttributes($request, $levelId);
            $books = BookRepository::index($queryConfig);

            return $this->returnSuccessPaginationResponse(__('book.found'), $books, ResponseAlias::HTTP_OK, $queryConfig->getPaginated());
        } catch (\Throwable $e) {
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.fetch_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request, ?int $levelId = null): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);
        $filters = [
        'keyword' => $request->input('keyword', null),
        // 'user_id' => $request->user()->id,
        'type' => $request->input('type', null),
        'level_id' => $levelId,
        'level_material_id' => $request->input('level_material_id', null),
        'material_id' => $request->input('material_id', null),
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