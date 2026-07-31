<?php

namespace App\Http\Controllers\Api\LevelType;

use App\Http\Controllers\Controller;
use App\Repositories\LevelTypePeriodRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteLevelTypePeriodController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $periodId): JsonResponse
    {
        try {
            LevelTypePeriodRepository::delete($periodId);
            return $this->returnSuccessResponse(__('messages.delete_success'), null, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
