<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlockedSlotResource;
use App\Repositories\BlockedSlotRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

final class IndexBlockedSlotsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        try {
            $slots = BlockedSlotRepository::index(auth()->id(), $request->date);

            return $this->returnSuccessResponse(
                __('messages.blocked_slots.retrieved'),
                BlockedSlotResource::collection($slots),
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            return $this->returnErrorResponse(
                __('messages.blocked_slots.retrieve_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
