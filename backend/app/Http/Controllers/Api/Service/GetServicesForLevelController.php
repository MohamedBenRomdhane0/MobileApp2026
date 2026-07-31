<?php

namespace App\Http\Controllers\Api\Service;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Services\ServiceActivationService;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetServicesForLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __construct(private ServiceActivationService $activationService) {}

    public function __invoke(int $levelId): JsonResponse
    {
        try {
            $level = Level::findOrFail($levelId);
            $data  = $this->activationService->getServicesForLevel($level);

            return $this->returnSuccessResponse(__('messages.success'), $data, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
