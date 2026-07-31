<?php

namespace App\Http\Controllers\Api\Service;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateServiceLevelRestrictionsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * Update which levels a service is available for.
     * Send level_ids as null to make the service available for all levels,
     * or as an array of level IDs to restrict it.
     */
    public function __invoke(Request $request, int $serviceId): JsonResponse
    {
        $request->validate([
            'level_ids'   => 'nullable|array',
            'level_ids.*' => 'integer|exists:levels,id',
        ]);

        try {
            $service = Service::findOrFail($serviceId);
            $service->update(['level_ids' => $request->input('level_ids')]);

            return $this->returnSuccessResponse(__('messages.success'), [
                'service_id' => $service->id,
                'slug'       => $service->slug,
                'level_ids'  => $service->level_ids,
            ], ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
