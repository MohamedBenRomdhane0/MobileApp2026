<?php

namespace App\Http\Controllers\Api\LevelType;

use App\Http\Controllers\Controller;
use App\Http\Requests\LevelType\SaveCycleRequest;
use App\Repositories\LevelTypeRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SaveCycleController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(SaveCycleRequest $request): JsonResponse
    {
        try {
            $cycle = LevelTypeRepository::saveCycle($request->validated());
            return $this->returnSuccessResponse(__('messages.create_success'), $cycle, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
