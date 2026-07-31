<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Exception;
use OpenApi\Annotations as OA;

class RefreshTokenController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/refresh-token",
     *     summary="Refresh JWT token",
     *     description="Returns a new access and refresh token.",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Tokens refreshed",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string"),
     *             @OA\Property(property="refresh_token", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function __invoke(): JsonResponse
    {
        try {
            $tokens = $this->authRepository->refreshToken();
            return $this->returnSuccessResponse(__('tokens_refreshed'), $tokens, ResponseAlias::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Refresh token error: ' . $e->getMessage());
            return $this->returnErrorResponse(__('general_error'), ResponseAlias::HTTP_UNAUTHORIZED);
        }
    }
}
