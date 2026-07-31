<?php

namespace App\Http\Controllers\Api\Book;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class IndexBooksForTeacherController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request)
    {
        try {
            $queryConfig = $this->getAttributes($request);

            $books = BookRepository::index($queryConfig);

            return $this->returnSuccessPaginationResponse(__('book.found'), $books, ResponseAlias::HTTP_OK, $queryConfig->getPaginated());
        } catch (\Throwable $e) {
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.fetch_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $request->input('keyword', null),
            'user_id' => $request->user()->id,
            'type' => $request->input('type', null),
            'level_id' => $request->input('level_id', null),
            'level_material_id' => $request->input('level_material_id', null),
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
