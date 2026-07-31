<?php

namespace App\Http\Controllers\Api\DiscountTemplate;

use App\Http\Controllers\Controller;
use App\Models\DiscountTemplate;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class IndexDiscountTemplatesController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $templates = DiscountTemplate::with('kinds')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get();

            return $this->returnSuccessResponse(
                __('messages.discount_template.retrieved'),
                $templates,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve discount templates', ['error' => $e->getMessage()]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.discount_template.retrieve_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
