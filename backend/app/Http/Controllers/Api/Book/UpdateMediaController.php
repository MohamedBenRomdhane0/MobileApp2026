<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\UpdateMediaRequest;
use App\Models\Media;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateMediaRequest $request, Media $media): JsonResponse
    {
        try {
            $updated = MediaRepository::updateMedia($media, $request->validated());
            return $this->returnSuccessResponse($updated, __('messages.media_updated'), ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
