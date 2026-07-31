<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\SendResetCodeRequest;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ResendVerificationCodeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $auth;

    public function __construct(AuthRepository $auth)
    {
        $this->auth = $auth;
    }

    public function __invoke(SendResetCodeRequest $request): JsonResponse
    {
        try {
            $result = $this->auth->resendVerificationCode($request->identifier);

            return $this->returnSuccessResponse($result['message'], $result['user_id'], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Failed to resend verification code: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage(), $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
