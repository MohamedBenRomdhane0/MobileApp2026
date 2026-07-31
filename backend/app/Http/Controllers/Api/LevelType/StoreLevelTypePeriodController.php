<?php

namespace App\Http\Controllers\Api\LevelType;

use App\Http\Controllers\Controller;
use App\Http\Requests\LevelTypePeriod\StoreLevelTypePeriodRequest;
use App\Repositories\LevelTypePeriodRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StoreLevelTypePeriodController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreLevelTypePeriodRequest $request, int $levelTypeId): JsonResponse
    {
        try {
            $period = LevelTypePeriodRepository::create($levelTypeId, $request->validated());
            return $this->returnSuccessResponse(__('messages.create_success'), $period, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.create_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
