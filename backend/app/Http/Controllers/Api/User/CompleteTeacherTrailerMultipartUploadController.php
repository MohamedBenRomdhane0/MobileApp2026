<?php

namespace App\Http\Controllers\Api\User;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\CompleteMediaMultipartUploadRequest;
use App\Repositories\MediaRepository;
use App\Repositories\UserRepository;
use App\Services\MediaMultipartUploadService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CompleteTeacherTrailerMultipartUploadController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function __invoke(CompleteMediaMultipartUploadRequest $request, MediaMultipartUploadService $service): JsonResponse
    {
        try {
            $data = $request->validated();
            $user = $request->user();

            DB::transaction(function () use ($data, $service, $user) {
                $service->completeMultipartUpload(
                    key: $data['key'],
                    uploadId: $data['uploadId'],
                    parts: $data['parts'],
                );

                MediaRepository::deleteMediaByTag($user, MediaTagEnum::TEACHER_TRAILER->value);

                MediaRepository::createMediaFromS3Object(
                    model: $user,
                    storedPath: $data['key'],
                    originalName: $data['filename'],
                    mimeType: $data['contentType'],
                    size: (int) $data['size'],
                    title: $data['title'],
                    description: $data['description'] ?? null,
                    tag: MediaTagEnum::TEACHER_TRAILER->value,
                );
            });

            $updatedUser = $this->userRepository->loadUpdatedProfile($user);

            return $this->returnSuccessResponse(
                __('messages.update_success'),
                $updatedUser,
                Response::HTTP_OK,
            );
        } catch (\Throwable $exception) {
            Log::error('Failed to complete teacher trailer multipart upload', ['error' => $exception->getMessage()]);
            return $this->returnErrorResponse($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
