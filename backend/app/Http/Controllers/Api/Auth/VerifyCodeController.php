<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\VerifyCodeRequest;
use App\Repositories\AuthRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Exception;
use OpenApi\Annotations as OA;

class VerifyCodeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/verify-code",
     *     summary="Verify email or SMS code",
     *     description="Verifies the code sent to user and activates the account.",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id", "code"},
     *             @OA\Property(property="user_id", type="integer", example=10),
     *             @OA\Property(property="code", type="string", example="123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Account verified and activated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email verified. Account activated."),
     *             @OA\Property(property="access_token", type="string"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Invalid or expired code"
     *     )
     * )
     */
    public function __invoke(VerifyCodeRequest $request): JsonResponse
    {
        try {
            $result = $this->authRepository->verifyCode($request->input('user_id'), $request->input('code'));

            return $this->returnSuccessResponse(__('messages.email_verified'), $result, ResponseAlias::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Verification error: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('Invalid or expired code.'), ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
