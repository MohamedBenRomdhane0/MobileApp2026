<?php

namespace App\Http\Controllers\Api\DiscountTemplate;

use App\Http\Controllers\Controller;
use App\Models\DiscountTemplate;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ShowDiscountTemplateController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            $template = DiscountTemplate::with('kinds')->find($id);

            if (!$template) {
                return $this->returnErrorResponse(
                    __('messages.discount_template.not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            return $this->returnSuccessResponse(
                __('messages.discount_template.retrieved'),
                $template,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve discount template', ['id' => $id, 'error' => $e->getMessage()]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.discount_template.retrieve_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
