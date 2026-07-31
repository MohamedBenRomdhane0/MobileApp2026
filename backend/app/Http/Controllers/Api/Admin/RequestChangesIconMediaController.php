<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewIconMediaRequest;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class RequestChangesIconMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(ReviewIconMediaRequest $request, int $mediaId): JsonResponse
    {
        $result = MediaRepository::requestChangesOnMedia(
            mediaId: $mediaId,
            feedback: $request->validated('feedback'),
        );

        return $this->returnSuccessResponse(__('messages.success'), $result, Response::HTTP_OK);
    }
}
