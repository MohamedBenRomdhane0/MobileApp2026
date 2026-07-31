<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromoConfig;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetPromoConfigController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $config = PromoConfig::firstOrCreate([], [
                'promo_system_enabled'     => true,
                'require_admin_approval'   => false,
                'allow_teachers_to_create' => true,
                'available_discount_kinds' => ['percent', 'fixed', 'free'],
                'max_discount_percent'     => 50,
                'max_discount_fixed'       => 100,
                'max_free_sessions'        => 3,
                'min_discount_percent'     => 5,
                'min_discount_fixed'       => 1,
            ]);

            return $this->returnSuccessResponse(
                __('messages.promo_config.retrieved'),
                $config,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to get promo config', ['error' => $e->getMessage()]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.promo_config.retrieve_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
