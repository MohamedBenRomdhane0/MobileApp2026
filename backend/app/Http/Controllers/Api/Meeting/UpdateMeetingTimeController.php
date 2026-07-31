<?php
namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Meeting\UpdateMeetingTimeRequest;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\DB;

class UpdateMeetingTimeController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __invoke(UpdateMeetingTimeRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();

        try {
            DB::beginTransaction();
            $meetingTime = MeetingRepository::updateMeetingTime($id, $data);

            if (!$meetingTime) {
                return $this->returnErrorResponse(
                    __('meeting.time_not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            DB::commit();
            return $this->returnSuccessResponse(
                __('meeting.time_updated_success'),
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
                __('meeting.time_update_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
