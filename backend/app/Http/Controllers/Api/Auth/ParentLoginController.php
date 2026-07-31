<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enum\RoleEnum;
use App\Http\Requests\User\AuthRequest;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Repositories\AuthRepository;
use OpenApi\Annotations as OA;

class ParentLoginController
{
    use ErrorResponse, SuccessResponse;

    /**
     * @OA\Post(
     *     path="/api/parent-login",
     *     tags={"Auth"},
     *     summary="Parent login",
     *     description="Authenticate parent users using phone or email and password. Rejects any other role with the generic invalid credentials error.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"password"},
     *             @OA\Property(property="email", type="string", format="email", example="parent@example.com"),
     *             @OA\Property(property="phone", type="string", example="+21612345678"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Authentication successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User authenticated"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="access_token", type="string"),
     *                 @OA\Property(property="user", type="object")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function __invoke(AuthRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        try {
            $allowedRoles = [RoleEnum::PARENT->value];
            $result = AuthRepository::authenticate($credentials, $allowedRoles);

            return $this->returnSuccessResponse(__('user_authenticated'), $result, ResponseAlias::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?? __('general_error'), $exception->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
