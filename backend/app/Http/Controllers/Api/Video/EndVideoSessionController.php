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
 *     path="/api/videos/{videoId}/session/end",
 *     summary="End a video watch session",
 *     description="Finalizes the watch session and updates all statistics",
 *     tags={"Video Sessions"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="videoId",
 *         in="path",
 *         required=true,
 *         description="ID of the video",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"final_position_sec"},
 *             @OA\Property(property="final_position_sec", type="number", example=580.5, description="Final playback position in seconds")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Session ended successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Session ended"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="session_id", type="integer"),
 *                 @OA\Property(property="video_id", type="string"),
 *                 @OA\Property(property="total_seconds", type="integer"),
 *                 @OA\Property(property="total_minutes", type="number"),
 *             )
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized"),
 *     @OA\Response(response=404, description="Session not found"),
 *     @OA\Response(response=422, description="Validation error"),
 *     @OA\Response(response=500, description="Server error")
 * )
 */
class EndVideoSessionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, string $videoId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'final_position_sec' => 'required|numeric|min:0',
            ]);

            $user = $request->user();

            $session = VideoSessionRepository::endSession(
                $user->id,
                $videoId,
                $validated['final_position_sec']
            );

            return $this->returnSuccessResponse(
                __('messages.session_ended'),
                [
                    'session_id' => $session->id,
                    'video_id' => $session->video_id,
                    'total_seconds' => $session->total_seconds,
                    'total_minutes' => $session->total_minutes,
                    'watch_segments' => $session->watch_segments,
                ],
                ResponseAlias::HTTP_OK
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->returnErrorResponse(
                $e->getMessage(),
                ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->returnErrorResponse(
                __('messages.session_not_found'),
                ResponseAlias::HTTP_NOT_FOUND
            );
        } catch (\Exception $e) {
            Log::error('Failed to end video session', [
                'video_id' => $videoId,
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.session_end_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
