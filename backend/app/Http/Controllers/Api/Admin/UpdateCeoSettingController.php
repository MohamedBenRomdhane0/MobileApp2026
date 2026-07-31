<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CeoSetting;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateCeoSettingController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        $isConfigured = CeoSetting::isConfigured();

        $rules = [
            'code'              => 'required|string|min:4|max:32',
            'code_confirmation' => 'required|same:code',
        ];

        if ($isConfigured) {
            $rules['current_code'] = 'required|string|min:4';
        }

        $request->validate($rules);

        try {
            $setting = CeoSetting::instance();

            if ($isConfigured && !$setting->verify($request->current_code)) {
                return $this->returnErrorResponse(
                    __('messages.current_code_incorrect'),
                    ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            if ($setting) {
                $setting->update(['code' => bcrypt($request->code)]);
            } else {
                CeoSetting::create(['code' => bcrypt($request->code)]);
                $setting = CeoSetting::instance();
            }

            return $this->returnSuccessResponse(
                __('messages.update_success'),
                ['updated_at' => $setting->fresh()->updated_at],
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
