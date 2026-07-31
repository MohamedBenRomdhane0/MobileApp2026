<?php
namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\RegisterTeacherRequest;
use App\Repositories\AuthRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Exception;
use OpenApi\Annotations as OA;
use Illuminate\Support\Facades\DB;

class RegisterTeacherController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

/**
 * @OA\Post(
 *     path="/api/register-teacher",
 *     summary="Register a new teacher",
 *     tags={"Auth"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"full_name", "email", "password", "password_confirmation"},
 *             @OA\Property(property="full_name", type="string", example="Ahmed Ben Salah"),
 *             @OA\Property(property="email", type="string", format="email", example="ahmed@example.com"),
 *             @OA\Property(property="phone", type="string", example="+21612345678"),
 *             @OA\Property(property="password", type="string", format="password", example="securePassword123"),
 *             @OA\Property(property="password_confirmation", type="string", format="password", example="securePassword123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Verification email sent",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Verification code sent to your email."),
 *             @OA\Property(property="user_id", type="integer", example=5)
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validation failed"),
 *     @OA\Response(response=500, description="Server error")
 * )
 */

    public function __invoke(RegisterTeacherRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $result = $this->authRepository->registerTeacher($request->validated());

            DB::commit();

            return $this->returnSuccessResponse(
            __('messages.verification_code_sent'),
            $result,
            ResponseAlias::HTTP_OK
            );
        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollBack();
            if ($e->errorInfo[1] === 1062) {
                $message = $e->getMessage();
                $field = str_contains($message, '_phone_') ? 'phone' : 'email';
                return response()->json([
                    'message' => __('validation.unique', ['attribute' => $field]),
                    'errors' => [
                        $field => [__('validation.unique', ['attribute' => $field])],
                    ],
                ], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
            }
            Log::error('RegisterTeacher failed: ' . $e->getMessage());
            return $this->returnErrorResponse(
                $e->getMessage(),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('RegisterTeacher failed: ' . $e->getMessage());

            return $this->returnErrorResponse(
            $e->getMessage(),
            ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
