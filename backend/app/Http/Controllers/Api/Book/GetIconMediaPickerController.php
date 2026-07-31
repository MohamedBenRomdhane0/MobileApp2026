<?php

namespace App\Http\Controllers\Api\Book;

use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetIconMediaPickerController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request, int|string $iconId): JsonResponse
    {
        try {
            $queryConfig = $this->getAttributes($request);
            $data = BookRepository::getIconMediaPicker($iconId, $queryConfig);

            return $this->returnSuccessResponse(
                __('messages.media_found'),
                $data,
                ResponseAlias::HTTP_OK,
            );
        } catch (\Throwable $e) {
            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.fetch_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
            );
        }
    }

    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        return (new QueryConfig())
            ->setFilters([
                'keyword' => $request->input('keyword'),
                'media_type' => $request->input('media_type'),
                'is_external' => $request->input('is_external'),
            ])
            ->setPerPage((int) $paginationParams['PER_PAGE'])
            ->setOrderBy($paginationParams['ORDER_BY'])
            ->setDirection($paginationParams['DIRECTION'])
            ->setPaginated(false);
    }
}
