<?php
namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Support\Facades\DB;

class DeleteMeetingTimeController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __invoke(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $deleted = MeetingRepository::deleteMeetingTime($id);

            if (!$deleted) {
                return $this->returnErrorResponse(__('messages.meeting.time_not_found'), ResponseAlias::HTTP_NOT_FOUND);
            }

            DB::commit();
            return $this->returnSuccessResponse(__('messages.meeting.time_deleted_success'), [], ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse(__('messages.meeting.time_delete_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
