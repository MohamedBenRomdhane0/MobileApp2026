<?php

namespace App\Http\Controllers\Api\Course;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\UploadVideoChunkRequest;
use App\Jobs\MergeAndUploadVideoJob;
use App\Models\CourseChapter;
use App\Services\ChunkUploadService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Annotations as OA;


    /**
     * @OA\Post(
     *     path="/api/admin/courses/chapters/{chapterId}/videos",
     *     summary="Upload a chunked video for a chapter (Teacher and admin only)",
     *     description="Uploads a video in chunks to be attached to a specific course chapter. On the last chunk, dispatches a job to merge and process the video.",
     *     operationId="uploadChapterVideo",
     *     tags={"Courses"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="chapterId",
     *         in="path",
     *         required=true,
     *         description="The ID of the course chapter",
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"filename", "chunkIndex", "totalChunks", "video"},
     *                 @OA\Property(property="filename", type="string", example="chapter_intro"),
     *                 @OA\Property(property="chunkIndex", type="integer", example=0),
     *                 @OA\Property(property="totalChunks", type="integer", example=5),
     *                 @OA\Property(property="video", type="string", format="binary"),
     *                 @OA\Property(property="title", type="string", example="Introduction to Chapter 1"),
     *                 @OA\Property(property="description", type="string", example="Explains the overview of Chapter 1")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Chunk uploaded successfully or video upload queued",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Chunk uploaded successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error during chunk upload",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="An error occurred")
     *         )
     *     )
     * )
     */

class UploadChapterVideoController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UploadVideoChunkRequest $request, ChunkUploadService $chunkService, int $chapterId): JsonResponse
    {
        try {
            $data = $request->validated();
            $chapter = CourseChapter::findOrFail($chapterId);

            $chunkService->saveChunk(
                filename: $data['filename'],
                chunkIndex: $data['chunkIndex'],
                chunkContent: $data['video']
            );

            if ($chunkService->isLastChunk($data['chunkIndex'], $data['totalChunks'])) {
                MergeAndUploadVideoJob::dispatch(
                    model: $chapter,
                    filename: $data['filename'],
                    totalChunks: $data['totalChunks'],
                    title: $data['title'] ?? 'Untitled',
                    description: $data['description'] ?? null,
                    tag: MediaTagEnum::CHAPTER_VIDEO->value
                );

                return $this->returnSuccessResponse(__('media.video_upload_progress'), null, Response::HTTP_OK);
            }

            return $this->returnSuccessResponse(__('media.chunk_uploaded_successfully'), null, Response::HTTP_OK);
        } catch (\Throwable $e) {
            return $this->returnErrorResponse(
                $e->getMessage() ?: __('media.chunk_upload_failed'),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
