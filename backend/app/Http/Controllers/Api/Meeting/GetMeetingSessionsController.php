<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingTime;
use App\Traits\ErrorResponse;
use App\Traits\PaginationParams;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetMeetingSessionsController extends Controller
{
    use SuccessResponse, ErrorResponse, PaginationParams;

    public function __invoke(Request $request, int $id)
    {
        try {
            $meeting = Meeting::find($id);

            if (!$meeting) {
                return $this->returnErrorResponse(
                    __('messages.meeting.not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            $paginationParams = $this->getPaginationParams($request);
            $isPaginated = $paginationParams['PAGINATION'];

            $query = MeetingTime::whereHas('group', fn($q) => $q->where('meeting_id', $id))
                ->with(['group', 'media'])
                ->orderBy('meeting_date')
                ->orderBy('start_time');

            if ($isPaginated) {
                $paginator = $query->paginate($paginationParams['PER_PAGE'], ['*'], 'page', $paginationParams['PAGE']);

                $paginator->getCollection()->transform(fn(MeetingTime $time) => array_merge($time->toArray(), [
                    'participants_count' => 0,
                    'has_supports'       => $time->media->isNotEmpty(),
                ]));

                return $this->returnSuccessPaginationResponse(
                    __('messages.meeting.retrieved_successfully'),
                    $paginator,
                    ResponseAlias::HTTP_OK,
                    true
                );
            }

            $sessions = $query->get()->map(fn(MeetingTime $time) => array_merge($time->toArray(), [
                'participants_count' => 0,
                'has_supports'       => $time->media->isNotEmpty(),
            ]));

            return $this->returnSuccessResponse(
                __('messages.meeting.retrieved_successfully'),
                $sessions,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $exception) {
            Log::error($exception);
            return $this->returnErrorResponse(
                __('messages.error.server_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
