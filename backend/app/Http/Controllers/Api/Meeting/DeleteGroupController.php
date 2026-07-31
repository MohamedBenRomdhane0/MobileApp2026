<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteGroupController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $meetingId, int $groupId): JsonResponse
    {
        $deleted = MeetingRepository::deleteGroup($groupId);

        if (!$deleted) {
            return $this->returnErrorResponse(
                __('messages.meeting.group_not_found'),
                ResponseAlias::HTTP_NOT_FOUND
            );
        }

        return $this->returnSuccessResponse(
            __('messages.meeting.group_deleted_success'),
            null,
            ResponseAlias::HTTP_OK
        );
    }
}
