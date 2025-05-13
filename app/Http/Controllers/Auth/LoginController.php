<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\User\AuthRequest;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class LoginController
{
    use ErrorResponse, SuccessResponse;

    protected $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }
    /**
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function __invoke(AuthRequest $request): JsonResponse
    {
        $credentials = $this->getAttributes($request);
        try {
            $result = $this->authRepository->authenticate($credentials);
            return $this->returnSuccessResponse(__('user_authenticated'), $result, ResponseAlias::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());
            $errorDetails = json_decode($exception->getMessage(), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($errorDetails)) {
                return response()->json(['errors' => $errorDetails], $exception->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
            } else {
                return $this->returnErrorResponse($exception->getMessage() ?: __('general_error'), $exception->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }
    /**
     * @param AuthRequest $request
     * @return array
     */
    private function getAttributes(AuthRequest $request): array
    {
        return $request->validated();
    }
}
