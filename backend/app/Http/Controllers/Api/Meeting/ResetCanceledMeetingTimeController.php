<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ResetCanceledMeetingTimeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $meetingTime = MeetingRepository::resetCanceledMeetingTime($id);
            DB::commit();

            return $this->returnSuccessResponse(
                __('meeting.time_reset_success'),
                $meetingTime,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse(
                $e->getMessage() ?: __('meeting.time_reset_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
