<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\RegisterParentRequest;
use App\Repositories\AuthRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class RegisterParentController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/register-parent",
     *     summary="Register a new parent",
     *     description="Registers a parent account and sends a verification code via SMS.",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"full_name", "phone", "password", "address", "guide_progress"},
     *             @OA\Property(property="full_name", type="string", example="Sarah Parent"),
     *             @OA\Property(property="email", type="string", format="email", example="sarah@example.com"),
     *             @OA\Property(property="phone", type="string", example="+21612345678"),
     *             @OA\Property(property="password", type="string", format="password", example="securePass1"),
     *            @OA\Property(property="password_confirmation", type="string", format="password", example="securePass1"),
     *             @OA\Property(property="address", type="string", example="123 Main Street"),
     *             @OA\Property(property="guide_progress", type="object", example={"dashboard":0,"manuel":0})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Parent registered and verification code sent",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Verification code sent to your phone."),
     *             @OA\Property(property="user_id", type="integer", example=10)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation failed"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error"
     *     )
     * )
     */
    public function __invoke(RegisterParentRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $result = $this->authRepository->registerParent($request->validated());
            DB::commit();
            return $this->returnSuccessResponse(__('messages.verification_sent'), ['user_id' => $result['user_id']], ResponseAlias::HTTP_OK);
        } catch (Exception $e) {
            Log::error('RegisterParent failed: ' . $e->getMessage());
            DB::rollBack();
            return $this->returnErrorResponse($e->getMessage() ?? __('general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
