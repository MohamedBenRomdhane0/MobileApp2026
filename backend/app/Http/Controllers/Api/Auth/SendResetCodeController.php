<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;
use App\Http\Requests\User\SendResetCodeRequest;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class SendResetCodeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $auth;

    public function __construct(AuthRepository $auth)
    {
        $this->auth = $auth;
    }

/**
 * @OA\Post(
 *     path="/api/send-reset-code",
 *     summary="Send reset code via Email or SMS depending on identifier",
 *     tags={"Auth"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"identifier"},
 *             @OA\Property(
 *                 property="identifier",
 *                 type="string",
 *                 example="+21695067163 or someone@example.com"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Reset code sent",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Password reset code sent via SMS."),
 *             @OA\Property(property="user_id", type="integer", example=15)
 *         )
 *     )
 * )
 */

    public function __invoke(SendResetCodeRequest $request): JsonResponse
    {
        try {
            $result = $this->auth->sendResetCode($request->identifier);
            $userId = $result['user_id'] ?? null;

            return $this->returnSuccessResponse($result['message'], $userId, ResponseAlias::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Failed to send reset code: ' . $e->getMessage());
            return $this->returnErrorResponse(__('Failed to send reset code.'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
