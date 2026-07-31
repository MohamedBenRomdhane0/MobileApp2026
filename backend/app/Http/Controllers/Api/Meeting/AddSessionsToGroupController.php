<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class AddSessionsToGroupController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $meetingId, int $groupId): JsonResponse
    {
        $validated = $request->validate([
            'meeting_times' => 'required|array|min:1',
            'meeting_times.*.meeting_date' => 'required|date',
            'meeting_times.*.start_time' => 'required|string',
            'meeting_times.*.end_time' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            
            $sessions = MeetingRepository::addSessionsToGroup($groupId, $validated['meeting_times']);
            
            if (!$sessions) {
                return $this->returnErrorResponse(
                    __('messages.meeting.group_not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            DB::commit();
            
            return $this->returnSuccessResponse(
                __('messages.meeting.sessions_added_success'),
                $sessions,
                ResponseAlias::HTTP_CREATED
            );
        } catch (\Exception $e) {
            DB::rollBack();
            
            if (str_contains($e->getMessage(), 'conflict')) {
                return $this->returnErrorResponse(
                    __('messages.meeting.time_conflict'),
                    ResponseAlias::HTTP_CONFLICT
                );
            }
            
            return $this->returnErrorResponse(
                $e->getMessage(),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
