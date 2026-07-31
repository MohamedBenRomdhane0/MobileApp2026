<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Requests\User\AuthRequest;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;
use App\Repositories\AuthRepository;

/**
 * @OA\Post(
 *     path="/api/login",
 *     summary="Authenticate user (parent or teacher)",
 *     description="Logs in a user using email or phone and password. Only users with status 'active' (i.e., verified) can log in.",
 *     tags={"Auth"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"password"},
 *             oneOf={
 *                 @OA\Schema(
 *                     @OA\Property(property="email", type="string", format="email", example="teacher@example.com"),
 *                     @OA\Property(property="password", type="string", example="Password123!")
 *                 ),
 *                 @OA\Schema(
 *                     @OA\Property(property="phone", type="string", example="+21612345678"),
 *                     @OA\Property(property="password", type="string", example="Password123!")
 *                 )
 *             }
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="User authenticated successfully."),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="access_token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOi..."),
 *                 @OA\Property(property="refresh_token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOi..."),
 *                 @OA\Property(property="user", type="object",
 *                     @OA\Property(property="id", type="integer", example=5),
 *                     @OA\Property(property="full_name", type="string", example="John Doe"),
 *                     @OA\Property(property="email", type="string", example="teacher@example.com"),
 *                     @OA\Property(property="role", type="string", example="teacher")
 *                 ),
 *                 @OA\Property(property="media", type="object", nullable=true)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Account not verified or not validated",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Your account is not verified.")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid credentials",
 *         @OA\JsonContent(
 *             @OA\Property(property="errors", type="object",
 *                 @OA\Property(property="email_or_phone", type="string", example="User not found."),
 *                 @OA\Property(property="password", type="string", example="Incorrect password.")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation failed",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="The email field is required.")
 *         )
 *     )
 * )
 */
class LoginController
{
    use ErrorResponse, SuccessResponse;

    /**
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function __invoke(AuthRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        try {
            $allowedRoles = [\App\Enum\RoleEnum::TEACHER->value, \App\Enum\RoleEnum::PARENT->value];
            $result = AuthRepository::authenticate($credentials, $allowedRoles);

            return $this->returnSuccessResponse(__('user_authenticated'), $result, ResponseAlias::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?? __('general_error'), $exception->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
