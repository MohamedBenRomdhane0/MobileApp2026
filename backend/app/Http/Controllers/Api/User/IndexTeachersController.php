<?php

namespace App\Http\Controllers\Api\User;

use App\Enum\RoleEnum;
use App\Helpers\QueryConfig;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class IndexTeachersController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse,PaginationParams;
    public function __invoke(Request $request): JsonResponse
    {
        $paginationParams = $this->getAttributes($request);
        try {
            $users = UserRepository::indexUsersForAdmin($paginationParams);
            return $this->returnSuccessPaginationResponse(
                __('user_retrieved'),
                $users,
                ResponseAlias::HTTP_OK,
                $paginationParams->isPaginated()
            );
        } catch (Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse( $exception->getMessage()?:__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param Request $request
     * @return QueryConfig
     */
    private function getAttributes(Request $request): QueryConfig
    {
        $paginationParams = $this->getPaginationParams($request);

        $filters = [
            'role' => [RoleEnum::TEACHER],
            'keyword' => $request->input('keyword', null),
        ];
        $search = new QueryConfig();
        $search->setFilters($filters)->setPage($paginationParams['PAGE'])->setPerPage($paginationParams['PER_PAGE'])->setOrderBy($paginationParams['ORDER_BY'])->setDirection($paginationParams['DIRECTION'])->setPaginated($paginationParams['PAGINATION']);
        return $search;
    }
}
