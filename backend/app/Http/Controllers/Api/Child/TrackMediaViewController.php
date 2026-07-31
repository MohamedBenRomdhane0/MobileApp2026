<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\MediaMetadata;
use App\Models\MediaTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

/**
 * @OA\Post(
 *   path="/api/child/media/{mediaId}/view",
 *   operationId="trackMediaUniqueView",
 *   tags={"Child", "Media"},
 *   summary="Track unique view (unique by user_id)",
 *   description="Counts views as UNIQUE viewers. Each authenticated child user counts as 1 view per media (even if they watch multiple times). Creates/updates media_trackings (started_at) and syncs media_metadata.views to the number of unique viewers.",
 *   security={{"bearerAuth": {}}},
 *
 *   @OA\Parameter(
 *     name="mediaId",
 *     in="path",
 *     required=true,
 *     description="Media ID",
 *     @OA\Schema(type="integer", example=632)
 *   ),
 *
 *   @OA\Response(
 *     response=200,
 *     description="View tracked",
 *     @OA\JsonContent(
 *       type="object",
 *       @OA\Property(property="message", type="string", example="messages.media.view_tracked"),
 *       @OA\Property(
 *         property="data",
 *         type="object",
 *         @OA\Property(property="media_id", type="integer", example=632),
 *         @OA\Property(property="counted_as_view", type="boolean", example=true),
 *         @OA\Property(property="views", type="integer", example=14)
 *       )
 *     )
 *   ),
 *
 *   @OA\Response(
 *     response=401,
 *     description="Unauthenticated",
 *     @OA\JsonContent(
 *       type="object",
 *       @OA\Property(property="message", type="string", example="Unauthenticated.")
 *     )
 *   ),
 *
 *   @OA\Response(
 *     response=403,
 *     description="Forbidden",
 *     @OA\JsonContent(
 *       type="object",
 *       @OA\Property(property="message", type="string", example="This action is unauthorized.")
 *     )
 *   ),
 *
 *   @OA\Response(
 *     response=404,
 *     description="Media not found",
 *     @OA\JsonContent(
 *       type="object",
 *       @OA\Property(property="message", type="string", example="messages.media.not_found")
 *     )
 *   ),
 *
 *   @OA\Response(
 *     response=500,
 *     description="Server error"
 *   )
 * )
 */
class TrackMediaViewController extends Controller
{
    public function __invoke(Request $request, int $mediaId)
    {
        $user = $request->user();

        $media = Media::query()->find($mediaId);
        if (!$media) {
            return response()->json([
                'message' => __('messages.media.not_found'),
            ], HttpResponse::HTTP_NOT_FOUND);
        }

        $data = DB::transaction(function () use ($media, $user) {
            $metadata = MediaMetadata::query()->firstOrCreate(
                ['media_id' => $media->id],
                [
                    'views' => 0,
                    'watch_time' => 0,
                    'transcoding_status' => 'pending', 
                    'status' => 1,                     
                    'last_seen_at' => null,
                ]
            );

            // One row per (media_id, user_id) => unique view by user
            $tracking = MediaTracking::query()->firstOrCreate(
                ['media_id' => $media->id, 'user_id' => $user->id],
                [
                    'media_type' => 'video',
                    'status' => 'not_started',
                    'progress_percent' => 0,
                    'watched_seconds' => 0,
                    'total_time_spent' => 0,
                ]
            );

            $countedAsView = false;

            // Unique view: only the first time (started_at is null)
            if (is_null($tracking->started_at)) {
                $tracking->started_at = now();
                $tracking->status = 'in_progress';
                $tracking->save();

                $countedAsView = true;
            }

            // Source of truth = unique users who started this media
            $uniqueViews = MediaTracking::query()
                ->where('media_id', $media->id)
                ->whereNotNull('started_at')
                ->count();

            // Sync metadata (fast reads + consistent)
            $metadata->views = (int) $uniqueViews;
            $metadata->last_seen_at = now();
            $metadata->save();

            return [
                'media_id' => (int) $media->id,
                'counted_as_view' => $countedAsView,
                'views' => (int) $uniqueViews,
            ];
        });

        return response()->json([
            'message' => __('messages.media.view_tracked'),
            'data' => $data,
        ]);
    }
}