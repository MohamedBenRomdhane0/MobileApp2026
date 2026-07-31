<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromoConfig;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdatePromoConfigController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'promo_system_enabled'        => 'boolean',
            'require_admin_approval'      => 'boolean',
            'allow_teachers_to_create'    => 'boolean',
            'available_discount_kinds'    => 'array',
            'available_discount_kinds.*'  => Rule::in(['percent', 'fixed', 'free']),
            'max_discount_percent'        => 'numeric|min:0|max:100',
            'max_discount_fixed'          => 'numeric|min:0',
            'max_free_sessions'           => 'integer|min:0',
            'min_discount_percent'        => 'numeric|min:0|max:100',
            'min_discount_fixed'          => 'numeric|min:0',
        ]);

        try {
            $config = PromoConfig::firstOrCreate([]);
            $config->update($validated);

            return $this->returnSuccessResponse(
                __('messages.promo_config.updated'),
                $config->fresh(),
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to update promo config', ['error' => $e->getMessage()]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.promo_config.update_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
