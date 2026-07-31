<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetDraftBooksController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request): JsonResponse
    {
        try {
            $draftUser = $request->attributes->get('draft_user');

            $paginationParams = $this->getPaginationParams($request);

            $queryConfig = new QueryConfig();
            $queryConfig->setFilters([
                'keyword'     => $request->input('keyword'),
                'level_id'    => $draftUser->level_id,
                'material_id' => $request->input('material_id'),
                'type'        => $request->input('type'),
            ])
                ->setPerPage($paginationParams['PER_PAGE'])
                ->setOrderBy($paginationParams['ORDER_BY'])
                ->setDirection($paginationParams['DIRECTION'])
                ->setPaginated($paginationParams['PAGINATION'])
                ->setPage($paginationParams['PAGE']);

            $books = BookRepository::index($queryConfig);

            return $this->returnSuccessPaginationResponse('success', $books, ResponseAlias::HTTP_OK, $queryConfig->getPaginated());
        } catch (\Exception $e) {
            Log::error('GetDraftBooks failed: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? 'general_error', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
