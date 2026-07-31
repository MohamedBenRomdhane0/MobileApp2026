<?php

namespace App\Http\Controllers\Api\User;

use App\Enum\RoleEnum;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ShowParentController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            $parent = UserRepository::getUserById($id);

            if (!$parent->hasRole(RoleEnum::PARENT->value)) {
                return $this->returnErrorResponse(__('messages.parent_not_found'), ResponseAlias::HTTP_NOT_FOUND);
            }

            return $this->returnSuccessResponse(__('messages.parent_found'), $parent, ResponseAlias::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? __('messages.general_error'), $e->getCode() ?? ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
