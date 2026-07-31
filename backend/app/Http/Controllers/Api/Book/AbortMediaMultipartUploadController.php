<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\AbortMediaMultipartUploadRequest;
use App\Services\MediaMultipartUploadService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AbortMediaMultipartUploadController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(AbortMediaMultipartUploadRequest $request, MediaMultipartUploadService $service): JsonResponse
    {
        try {
            $service->abortMultipartUpload(
                key: $request->string('key')->toString(),
                uploadId: $request->string('uploadId')->toString(),
            );

            return $this->returnSuccessResponse('media.upload_success', null, Response::HTTP_OK);
        } catch (\Throwable $exception) {
            Log::error('Failed to abort media multipart upload', ['error' => $exception->getMessage()]);

            return $this->returnErrorResponse($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
