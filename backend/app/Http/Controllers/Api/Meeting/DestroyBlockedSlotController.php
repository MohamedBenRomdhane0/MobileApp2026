<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\BlockedSlotRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

final class DestroyBlockedSlotController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            BlockedSlotRepository::destroy(auth()->id(), $id);
            DB::commit();

            return $this->returnSuccessResponse(
                __('messages.blocked_slots.deleted'),
                null,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse(
                __('messages.blocked_slots.delete_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
