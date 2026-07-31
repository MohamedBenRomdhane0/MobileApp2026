<?php

namespace App\Http\Controllers\Api\LevelType;

use App\Http\Controllers\Controller;
use App\Http\Requests\LevelTypePeriod\UpdateLevelTypePeriodRequest;
use App\Repositories\LevelTypePeriodRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateLevelTypePeriodController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateLevelTypePeriodRequest $request, int $periodId): JsonResponse
    {
        try {
            $period = LevelTypePeriodRepository::update($periodId, $request->validated());
            return $this->returnSuccessResponse(__('messages.update_success'), $period, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
