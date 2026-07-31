<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Repositories\LevelRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Helpers\QueryConfig;


class GetLevelMaterialsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse, PaginationParams;
    public function __invoke(Request $request)
    {
        $paginationParams = $this->getAttributes($request);
        try {
            $levels = LevelRepository::indexLevelMaterials($paginationParams);

            return $this->returnSuccessPaginationResponse(__('messages.success'), $levels, ResponseAlias::HTTP_OK, $paginationParams->isPaginated());
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?: __('general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'keyword' => $paginationParams['KEYWORD'] ?? '',
            'level_id' => $request->query('level_id'),
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)->setPerPage($paginationParams['PER_PAGE'])->setOrderBy($paginationParams['ORDER_BY'])->setDirection($paginationParams['DIRECTION'])->setPaginated($paginationParams['PAGINATION'])->setPage($paginationParams['PAGE']);
        return $search;
    }
}
