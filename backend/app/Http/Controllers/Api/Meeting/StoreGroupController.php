<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\StoreGroupRequest;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StoreGroupController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreGroupRequest $request, int $meetingId): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();
            
            $group = MeetingRepository::addGroupToMeeting($meetingId, $validated);
            
            if (!$group) {
                return $this->returnErrorResponse(
                    __('messages.meeting_not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            DB::commit();
            
            return $this->returnSuccessResponse(
                __('messages.meeting.group_added_success'),
                $group,
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
