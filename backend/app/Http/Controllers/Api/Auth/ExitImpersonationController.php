<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
     * @OA\Post(
     * path="/api/admin/exit-impersonation",
     * summary="Exit impersonation mode",
     * description="Stops impersonating a user and restores the original admin session.",
     * tags={"Auth"},
     * security={{"bearerAuth":{}}},
     * @OA\Response(
     * response=200,
     * description="Exited impersonation successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Impersonation exited successfully."),
     * @OA\Property(property="data", type="object", description="Original token data")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated or Token missing",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Not currently impersonating a user",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="No impersonation context found.")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Failed to exit impersonation.")
     * )
     * )
     * )
     */

class ExitImpersonationController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): \Illuminate\Http\JsonResponse
    {
        try {
            $this->checkAuthorization();

            $data = AuthRepository::exitImpersonation();

            return $this->returnSuccessResponse(__('messages.impersonation_exited'), $data, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error("Failed to exit impersonation: " . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function checkAuthorization(): void
    {
        if (!auth()->check()) {
            Log::error('ExitImpersonationController: Not Authorized');
            abort(ResponseAlias::HTTP_UNAUTHORIZED, __('messages.not_authorized'));
        }

        $rawToken = request()->bearerToken();
        if (!$rawToken) {
            Log::error('ExitImpersonationController: Token missing');
            abort(ResponseAlias::HTTP_UNAUTHORIZED, __('messages.token_missing'));
        }

        $payload = JWTAuth::setToken($rawToken)->getPayload();
        $isImpersonating = $payload->get('impersonation_active');

        if (!$isImpersonating) {
            Log::error('ExitImpersonationController: No impersonation context found');
            abort(ResponseAlias::HTTP_FORBIDDEN, __('messages.no_impersonation_context'));
        }
    }
}
