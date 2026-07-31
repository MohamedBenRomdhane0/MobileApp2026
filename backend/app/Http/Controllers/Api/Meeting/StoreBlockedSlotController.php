<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\StoreBlockedSlotRequest;
use App\Http\Resources\BlockedSlotResource;
use App\Repositories\BlockedSlotRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

final class StoreBlockedSlotController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreBlockedSlotRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $slot = BlockedSlotRepository::store(auth()->id(), $request->validated());
            DB::commit();

            return $this->returnSuccessResponse(
                __('messages.blocked_slots.created'),
                new BlockedSlotResource($slot),
                ResponseAlias::HTTP_CREATED
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse(
                __('messages.blocked_slots.create_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
