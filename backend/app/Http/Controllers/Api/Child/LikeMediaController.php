<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/child/{mediaId}/like",
 *     tags={"Parent"},
 *     summary="Like or unlike a media item",
 *     description="Allows a user to like or unlike a media item.",
 *     @OA\Parameter(
 *         name="mediaId",
 *         in="path",
 *         required=true,
 *         description="ID of the media item to like/unlike",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Success",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string"),
 *             @OA\Property(property="data", type="object", ref="#/components/schemas/Media")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Media not found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error"
 *     )
 * )
 */

class LikeMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $mediaId): JsonResponse
    {
        try {
            DB::beginTransaction();
            $media = Media::findOrFail($mediaId);
            $liked = BookRepository::toggleLike($media);
            DB::commit();

            return $this->returnSuccessResponse(__('media.like_' . ($liked ? 'added' : 'removed')), $liked, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse($e->getMessage(), $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
