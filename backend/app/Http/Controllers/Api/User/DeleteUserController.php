<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteUserController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __invoke(int $userId): JsonResponse
    {
        try {
            DB::beginTransaction();
            UserRepository::deleteUser($userId);
            DB::commit();
            return $this->returnSuccessResponse(__('user_deleted'), null, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to delete user with ID {$userId}: " . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}