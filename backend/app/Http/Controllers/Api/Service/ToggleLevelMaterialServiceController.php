<?php

namespace App\Http\Controllers\Api\Service;

use App\Http\Controllers\Controller;
use App\Services\ServiceActivationService;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ToggleLevelMaterialServiceController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __construct(private ServiceActivationService $activationService) {}

    /**
     * Toggle a service for a specific material at level level (levels without sections).
     */
    public function __invoke(Request $request, int $serviceId, int $levelMaterialId): JsonResponse
    {
        $request->validate(['is_enabled' => 'required|boolean']);

        try {
            $this->activationService->toggleLevelMaterialService(
                $levelMaterialId,
                $serviceId,
                $request->boolean('is_enabled')
            );

            return $this->returnSuccessResponse(__('messages.success'), null, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
