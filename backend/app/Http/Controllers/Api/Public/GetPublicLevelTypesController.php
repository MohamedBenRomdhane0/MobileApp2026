<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\LevelType;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetPublicLevelTypesController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $types = LevelType::withCount('levels')->orderBy('id')->get(['id', 'name', 'color']);

            return $this->returnSuccessResponse('success', $types, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse('general_error', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
