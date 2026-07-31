<?php

namespace App\Http\Controllers\Api\User;

use App\Enum\UserStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\ToggleUserStatusRequest;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ToggleUserStatusController extends Controller
{
    use SuccessResponse, ErrorResponse;
    
    public function __invoke(ToggleUserStatusRequest $request, int $userId): JsonResponse
    {
        try {
            
            $validated = $request->validated();
            DB::beginTransaction();
            
            $user = UserRepository::toggleUserStatus($userId, $validated['status']);
            
            DB::commit();
            
            $message = $validated['status'] === UserStatusEnum::ACTIVE->value 
                ? __('messages.user_activated') 
                : __('messages.user_deactivated');
            
            return $this->returnSuccessResponse($message, $user, ResponseAlias::HTTP_OK);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to toggle status for user with ID {$userId}: " . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
