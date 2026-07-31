<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\DiskEnum;
use App\Services\Realtime\SocketEmitter;
use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteMediaController extends Controller
{
    /**
     * @OA\Delete(
     * path="/api/admin/books/{mediaId}/delete-video",
     * summary="Delete a video media file",
     * description="Deletes a specific media file (video) from storage and the database.",
     * tags={"Book"},
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="mediaId",
     * in="path",
     * required=true,
     * description="ID of the media to delete",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Media deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Media deleted successfully."),
     * @OA\Property(property="data", type="null")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Unauthorized",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="You do not have permission to delete this video.")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Media not found",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Media not found.")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Failed to delete media.")
     * )
     * )
     * )
     */
    use SuccessResponse, ErrorResponse;
    public function __invoke($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $media = Media::findOrFail($id);
            $disk = DiskEnum::S3->value;
            $filePath = $media->file_path;
            SocketEmitter::toUser((int) $media->creator_id, 'video.status', [
                'media_id' => $media->id,
                'status' => 'DELETED',
                'progress' => 0,
                'error' => 'Video deleted by user',
                'status_text' => 'DELETED',
                'deleted' => true,
            ]);
            MediaRepository::deleteMediaFile($filePath, $disk);
            // $media->metadata->delete();
            $media->delete();
            DB::commit();
            return $this->returnSuccessResponse(__('media.deleted'), null, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.delete_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
