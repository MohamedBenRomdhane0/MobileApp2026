<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\CreateMediaMultipartUploadRequest;
use App\Services\MediaMultipartUploadService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CreateTeacherTrailerMultipartUploadController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(CreateMediaMultipartUploadRequest $request, MediaMultipartUploadService $service): JsonResponse
    {
        try {
            $result = $service->createMultipartUpload(
                filename: $request->string('filename')->toString(),
                contentType: $request->string('contentType')->toString(),
            );

            return $this->returnSuccessResponse('media.upload_success', $result, Response::HTTP_OK);
        } catch (\Throwable $exception) {
            Log::error('Failed to create teacher trailer multipart upload', ['error' => $exception->getMessage()]);

            return $this->returnErrorResponse($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
