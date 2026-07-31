<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetUserByIdController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, ?int $userId = null): JsonResponse
    {
        try {
            $resolvedUserId = $userId ?? $request->route('id');
            if (!$resolvedUserId) {
                return $this->returnErrorResponse(__('messages.user_not_found'), ResponseAlias::HTTP_NOT_FOUND);
            }
            $user = UserRepository::getUserById((int) $resolvedUserId);
            return $this->returnSuccessResponse(__('messages.user_found'), $user , ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_NOT_FOUND);
        }
    }
}
