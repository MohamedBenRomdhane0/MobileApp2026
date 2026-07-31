<?php

namespace App\Http\Controllers\Api\LevelType;

use App\Http\Controllers\Controller;
use App\Http\Requests\LevelType\UpdateLevelTypeRequest;
use App\Repositories\LevelTypeRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateLevelTypeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateLevelTypeRequest $request, int $levelTypeId): JsonResponse
    {
        try {
            $levelType = LevelTypeRepository::update($levelTypeId, $request->validated());
            return $this->returnSuccessResponse(__('messages.update_success'), $levelType, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
