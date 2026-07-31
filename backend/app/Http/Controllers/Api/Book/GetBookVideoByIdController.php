<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetBookVideoByIdController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        $media = MediaRepository::getMediaById($id);

        if (!$media) {
            return $this->returnErrorResponse(__('messages.media_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        return $this->returnSuccessResponse(
            __('messages.media_found'),
            $media,
            ResponseAlias::HTTP_OK
        );
    }
}
