<?php

namespace App\Http\Controllers\Api\Section;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\SectionRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Traits\PaginationParams;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class IndexSectionsController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);

        try {
            $sections = SectionRepository::indexAll($paginationParams);
            return $this->returnSuccessPaginationResponse(__('messages.success'), $sections, ResponseAlias::HTTP_OK, $paginationParams->isPaginated());
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $paginationParams['KEYWORD'] ?? '',
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)->setPerPage($paginationParams['PER_PAGE'])->setOrderBy($paginationParams['ORDER_BY'])->setDirection($paginationParams['DIRECTION'])->setPaginated($paginationParams['PAGINATION'])->setPage($paginationParams['PAGE']);
        return $search;
    }
}
