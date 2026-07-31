<?php

namespace App\Http\Controllers\Api\Video;

use App\Http\Controllers\Controller;
use App\Repositories\VideoSessionRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/videos/{videoId}/session/start",
 *     summary="Start a video watch session",
 *     description="Initializes or retrieves an existing watch session for a video",
 *     tags={"Video Sessions"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="videoId",
 *         in="path",
 *         required=true,
 *         description="ID of the video",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Session started successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Session started"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="session_id", type="integer"),
 *                 @OA\Property(property="video_id", type="string"),
 *                 @OA\Property(property="last_position_sec", type="number"),
 *                 @OA\Property(property="total_seconds", type="integer"),
 *             )
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized"),
 *     @OA\Response(response=500, description="Server error")
 * )
 */
class StartVideoSessionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, string $videoId): JsonResponse
    {
        try {
            $user = $request->user();

            $result = VideoSessionRepository::startSession($user->id, $videoId);
            $session = $result['session'];

            if (!$result['can_watch']) {
                return $this->returnErrorResponse(
                    __('messages.video_access_denied'),
                    ResponseAlias::HTTP_FORBIDDEN
                );
            }

            return $this->returnSuccessResponse(
                __('messages.session_started'),
                [
                    'session_id' => $session->id,
                    'video_id' => $session->video_id,
                    'resume_from_sec' => $result['resume_from_sec'],
                    'total_seconds' => $session->total_seconds,
                    'total_minutes' => $session->total_minutes,
                    'can_watch' => $result['can_watch'],
                    'reason' => $result['reason'],
                    'requires_subscription' => $result['requires_subscription'],
                    'trial_status' => $result['trial_status'],
                ],
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to start video session', [
                'video_id' => $videoId,
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.session_start_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
