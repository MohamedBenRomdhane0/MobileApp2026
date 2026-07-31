<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class ToggleValidationIconMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $mediaId): JsonResponse
    {
        $result = MediaRepository::toggleValidation($mediaId);

        return $this->returnSuccessResponse(__('messages.success'), $result, Response::HTTP_OK);
    }
}
