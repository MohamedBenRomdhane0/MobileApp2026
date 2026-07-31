<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;
use App\Http\Requests\User\ResetPasswordRequest;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Annotations as OA;

class ResetPasswordController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $auth;

    public function __construct(AuthRepository $auth)
    {
        $this->auth = $auth;
    }

    /**
     * @OA\Post(
     *   path="/api/reset-password",
     *   summary="Reset the user's password",
     *   tags={"Auth"},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"user_id","code","password","password_confirmation"},
     *       @OA\Property(property="user_id", type="integer", example=10),
     *       @OA\Property(property="code", type="string", example="123456"),
     *       @OA\Property(property="password", type="string", example="NewPassword123!"),
     *       @OA\Property(property="password_confirmation", type="string", example="NewPassword123!")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Password updated successfully",
     *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Password updated successfully."))
     *   )
     * )
     */
    public function __invoke(ResetPasswordRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $this->auth->resetPassword(
                $request->user_id,
                $request->code,
                $request->password
            );

            DB::commit();
            return $this->returnSuccessResponse(
                'Password updated successfully.',
                [],
                Response::HTTP_OK
            );
        } catch (\Throwable $e) {
            Log::error('Reset Password Error: '.$e->getMessage());
            DB::rollBack();

            return $this->returnErrorResponse(
                $e->getMessage(),
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }
    }
}
