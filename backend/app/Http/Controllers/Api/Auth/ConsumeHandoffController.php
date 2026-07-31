<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Post(
 *   path="/api/impersonate/handoff/{code}",
 *   summary="Redeem a cross-app impersonation handoff code",
 *   description="Public, single-use exchange: redeems a short-lived code (minted by /admin/impersonate/{userId} or /admin/exit-impersonation) for the auth payload it wraps, so a session can be handed off between frontend apps without putting tokens in a URL.",
 *   tags={"Auth"},
 *   @OA\Parameter(
 *     name="code",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="string")
 *   ),
 *   @OA\Response(response=200, description="Handoff consumed successfully"),
 *   @OA\Response(response=404, description="Invalid or expired handoff code")
 * )
 */
class ConsumeHandoffController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(string $code): \Illuminate\Http\JsonResponse
    {
        $key = "impersonation_handoff_{$code}";
        $authData = Cache::get($key);

        if (!$authData) {
            return $this->returnErrorResponse(__('messages.invalid_or_expired_handoff'), ResponseAlias::HTTP_NOT_FOUND);
        }

        Cache::forget($key);

        return $this->returnSuccessResponse(__('messages.handoff_consumed'), $authData, ResponseAlias::HTTP_OK);
    }
}
