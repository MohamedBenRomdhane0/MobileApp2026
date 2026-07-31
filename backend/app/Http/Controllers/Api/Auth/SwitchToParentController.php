<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;


/**
 * @OA\Post(
 *     path="/api/child/switch-to-parent",
 *     summary="Switch to parent account",
 *     description="Allows a child or teacher to switch back to the parent account.",
 *     tags={"Auth"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Switched back to parent account successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Returned to parent account successfully."),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error returning to parent account",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Error returning to parent account.")
 *         )
 *     )
 * )
 */


class SwitchToParentController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * Handle the incoming request.
     */
    public function __invoke(): JsonResponse
    {
        try {
            $data = AuthRepository::returnToParent();
            return $this->returnSuccessResponse(__('messages.returned_to_parent'), $data, 200);
        } catch (\Exception $e) {
            Log::error('Switch to parent error: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage()?: __('messages.return_to_parent_error'), 500);
        }
    }
}
