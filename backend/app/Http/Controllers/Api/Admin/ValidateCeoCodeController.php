<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CeoSetting;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ValidateCeoCodeController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'ceo_code' => 'required|string',
        ]);

        $setting = CeoSetting::instance();

        if (!$setting) {
            return $this->returnErrorResponse(
                __('messages.ceo_code_not_configured'),
                ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (!$setting->verify($request->input('ceo_code'))) {
            return $this->returnErrorResponse(
                __('messages.invalid_ceo_code'),
                ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        return $this->returnSuccessResponse(__('messages.success'), [], ResponseAlias::HTTP_OK);
    }
}
