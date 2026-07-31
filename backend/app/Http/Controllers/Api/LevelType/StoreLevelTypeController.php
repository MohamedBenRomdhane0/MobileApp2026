<?php

namespace App\Http\Controllers\Api\LevelType;

use App\Http\Controllers\Controller;
use App\Http\Requests\LevelType\StoreLevelTypeRequest;
use App\Repositories\LevelTypeRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StoreLevelTypeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreLevelTypeRequest $request): JsonResponse
    {
        try {
            $levelType = LevelTypeRepository::create($request->validated());
            return $this->returnSuccessResponse(__('messages.create_success'), $levelType, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage ?? __('messages.cycle_creation_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
