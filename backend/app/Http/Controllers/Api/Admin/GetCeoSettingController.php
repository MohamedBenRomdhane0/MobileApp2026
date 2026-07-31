<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CeoSetting;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetCeoSettingController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $setting = CeoSetting::instance();

            if (!$setting) {
                return $this->returnSuccessResponse(
                    __('messages.success'),
                    ['is_set' => false, 'updated_at' => null],
                    ResponseAlias::HTTP_OK
                );
            }

            return $this->returnSuccessResponse(
                __('messages.success'),
                ['is_set' => true, 'updated_at' => $setting->updated_at],
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
