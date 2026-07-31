<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateGroupController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $meetingId, int $groupId): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $group = MeetingRepository::updateGroup($groupId, $validated);

        if (!$group) {
            return $this->returnErrorResponse(
                __('messages.meeting.group_not_found'),
                ResponseAlias::HTTP_NOT_FOUND
            );
        }

        return $this->returnSuccessResponse(
            __('messages.meeting.group_updated_success'),
            $group,
            ResponseAlias::HTTP_OK
        );
    }
}
