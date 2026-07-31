<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Enums\CancellationReasonEnum;
use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CancelMeetingTimeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cancellation_reason'  => ['required', Rule::enum(CancellationReasonEnum::class)],
            'cancellation_comment' => ['nullable', 'string', 'max:280'],
        ]);

        try {
            DB::beginTransaction();
            $meetingTime = MeetingRepository::cancelMeetingTime(
                $id,
                $validated['cancellation_reason'],
                $validated['cancellation_comment'] ?? null,
            );
            DB::commit();

            return $this->returnSuccessResponse(
                __('meeting.time_cancelled_success'),
                $meetingTime,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception) {
            DB::rollBack();
            return $this->returnErrorResponse(
                __('meeting.time_cancel_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
