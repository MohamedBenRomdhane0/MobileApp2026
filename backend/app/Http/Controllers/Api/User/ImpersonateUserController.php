<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ImpersonateUserController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __invoke($token): \Illuminate\Http\JsonResponse
    {
        try {
            //---> Check if the user is authorized to generate a auto login token
            $user = User::where('auto_login_token', $token)->first();

            //---> Check if the the token is valid
            if (!$user) {
                Log::error("Invalid auto-login token: {$token}");
                return $this->returnErrorResponse('invalid_token', ResponseAlias::HTTP_NOT_FOUND);
            }

            //---> Authenticate the user
            $data = AuthRepository::authenticate(user: $user, isImpersonating: true);

            if (!$data) {
                Log::error("Failed to impersonate user with token: {$token}");
                return $this->returnErrorResponse('impersonation_failed', ResponseAlias::HTTP_UNAUTHORIZED);
            }

            //---> Store the auto-login token
            AuthRepository::storeAutoLoginToken($user);

            //---> Return success response with user data
            return $this->returnSuccessResponse(__('messages.impersonation_started'), $data, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
