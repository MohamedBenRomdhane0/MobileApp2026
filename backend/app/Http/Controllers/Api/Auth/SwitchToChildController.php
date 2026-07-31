<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\SwitchToChildRequest;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Throwable;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Post(
 *   path="/api/parent/switch-to-child",
 *   summary="Switch to a child account",
 *   description="Parent switches into a child session. Preferred: pass the child's `users.id` as `child_id`. Fallback: `child_profiles.id` is also accepted. Ownership is verified via `child_profiles.parent_id`.",
 *   tags={"Auth"},
 *   security={{"bearerAuth":{}}},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(
 *       required={"child_id"},
 *       @OA\Property(
 *         property="child_id",
 *         type="integer",
 *         example=85,
 *         description="Prefer child's users.id; child_profiles.id also supported"
 *       )
 *     )
 *   ),
 *   @OA\Response(
 *     response=200,
 *     description="Switched",
 *     @OA\JsonContent(
 *       type="object",
 *       @OA\Property(property="message", type="string", example="Child switched successfully."),
 *       @OA\Property(
 *         property="data",
 *         type="object",
 *         @OA\Property(property="access_token", type="string"),
 *         @OA\Property(property="token_type", type="string", example="bearer"),
 *         @OA\Property(
 *           property="user",
 *           type="object",
 *           @OA\Property(property="id", type="integer"),
 *           @OA\Property(property="full_name", type="string"),
 *           @OA\Property(property="child_profile", type="object")
 *         )
 *       )
 *     )
 *   ),
 *   @OA\Response(response=401, description="Unauthorized"),
 *   @OA\Response(response=403, description="Only parents can switch to child"),
 *   @OA\Response(response=422, description="Child does not belong to the authenticated parent"),
 *   @OA\Response(response=500, description="Server error")
 * )
 */
class SwitchToChildController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(SwitchToChildRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            
            $data = AuthRepository::switchToChild((int) $request->child_id);

            DB::commit();

            return $this->returnSuccessResponse(__('messages.child_switched'), $data, ResponseAlias::HTTP_OK);
        } catch (AuthenticationException $e) {
            DB::rollBack();
            return $this->returnErrorResponse(__('auth.unauthenticated'), ResponseAlias::HTTP_UNAUTHORIZED);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error('Switch to child error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.child_switch_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
