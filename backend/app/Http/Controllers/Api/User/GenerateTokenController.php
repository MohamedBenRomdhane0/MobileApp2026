<?php

namespace App\Http\Controllers\Api\User;

use Exception;

use App\Enum\PermissionEnum;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GenerateTokenController extends Controller
{
    use ErrorResponse, SuccessResponse;

    /**
     * @param int|string $userID
     * @return JsonResponse
     */
    public function __invoke(int|string $userID): JsonResponse
    {
        $user = User::find(id: $userID);
        $this->checkAuthorization($user);

        try {
            DB::beginTransaction();
            $token = AuthRepository::storeAutoLoginToken($user);

            if (!$token) {
                DB::rollBack();

                Log::error('Failed to generate token for user ID: ' . $userID);
                return $this->returnErrorResponse(__('user_not_authenticated'), ResponseAlias::HTTP_UNAUTHORIZED);
            }
            DB::commit();

            return $this->returnSuccessResponse('token_generated', ['token' => $token], ResponseAlias::HTTP_CREATED);
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('GenerateTokenController' . $exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?: __('user_not_authenticated'), ResponseAlias::HTTP_UNAUTHORIZED);
        }
    }

    /**
     * Summary of checkAuthorization
     * Check if the user is authorized to generate a auto login token
     * @return void
     */
    private function checkAuthorization(?User $user): void
    {
        if (!$user) {
            Log::error('User not found for authorization check');
            abort($this->returnErrorResponse('user_not_found', ResponseAlias::HTTP_NOT_FOUND));
        }
    }
}
