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
 * @OA\Get(
 *     path="/api/videos/{videoId}/session",
 *     summary="Get video session progress",
 *     description="Retrieves the current watch session progress for a video",
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
 *         description="Session retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Session retrieved"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="session_id", type="integer"),
 *                 @OA\Property(property="video_id", type="string"),
 *                 @OA\Property(property="last_position_sec", type="number"),
 *                 @OA\Property(property="total_seconds", type="integer"),
 *                 @OA\Property(property="total_minutes", type="number"),
 *             )
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized"),
 *     @OA\Response(response=404, description="Session not found"),
 *     @OA\Response(response=500, description="Server error")
 * )
 */
class GetVideoSessionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, string $videoId): JsonResponse
    {
        try {
            $user = $request->user();
            
            $videoDurationSec = $request->query('video_duration_sec');

            $result = VideoSessionRepository::getSessionProgress($user->id, $videoId, $videoDurationSec);

            if (!$result['session']) {
                return $this->returnSuccessResponse(
                    __('messages.no_session_found'),
                    [
                        'session' => null,
                        'resume_from_sec' => 0,
                        'completion_percentage' => 0,
                    ],
                    ResponseAlias::HTTP_OK
                );
            }

            $session = $result['session'];

            return $this->returnSuccessResponse(
                __('messages.session_retrieved'),
                [
                    'session_id' => $session->id,
                    'video_id' => $session->video_id,
                    'resume_from_sec' => $result['resume_from_sec'],
                    'last_position_sec' => $session->last_position_sec,
                    'total_seconds' => $session->total_seconds,
                    'total_minutes' => $session->total_minutes,
                    'watch_segments' => $session->watch_segments,
                    'completion_percentage' => $result['completion_percentage'],
                    'last_synced_at' => $session->last_synced_at,
                ],
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to get video session', [
                'video_id' => $videoId,
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.session_retrieval_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
