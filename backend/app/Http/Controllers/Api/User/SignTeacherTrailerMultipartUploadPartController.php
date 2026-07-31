<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\SignMediaMultipartUploadPartRequest;
use App\Services\MediaMultipartUploadService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SignTeacherTrailerMultipartUploadPartController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(SignMediaMultipartUploadPartRequest $request, MediaMultipartUploadService $service): JsonResponse
    {
        try {
            $result = $service->signUploadPart(
                key: $request->string('key')->toString(),
                uploadId: $request->string('uploadId')->toString(),
                partNumber: (int) $request->integer('partNumber'),
            );

            return $this->returnSuccessResponse('media.upload_success', $result, Response::HTTP_OK);
        } catch (\Throwable $exception) {
            Log::error('Failed to sign teacher trailer multipart upload part', ['error' => $exception->getMessage()]);

            return $this->returnErrorResponse($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
