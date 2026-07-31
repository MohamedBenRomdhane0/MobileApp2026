<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkApproveIconMediaRequest;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class BulkApproveIconMediaController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(BulkApproveIconMediaRequest $request): JsonResponse
    {
        $result = MediaRepository::bulkApproveMedia(
            mediaIds: $request->validated('media_ids'),
        );

        return $this->returnSuccessResponse(__('messages.success'), $result, Response::HTTP_OK);
    }
}
