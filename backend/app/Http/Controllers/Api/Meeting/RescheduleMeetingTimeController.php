<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\RescheduleMeetingTimeRequest;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class RescheduleMeetingTimeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(RescheduleMeetingTimeRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();

        try {
            DB::beginTransaction();
            $meetingTime = MeetingRepository::rescheduleMeetingTime($id, $data);
            DB::commit();

            return $this->returnSuccessResponse(
                __('meeting.time_rescheduled_success'),
                $meetingTime,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            DB::rollBack();

            if (str_contains($e->getMessage(), 'conflict')) {
                return $this->returnErrorResponse(
                    __('meeting.time_conflict'),
                    ResponseAlias::HTTP_CONFLICT
                );
            }

            return $this->returnErrorResponse(
                __('meeting.time_reschedule_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
