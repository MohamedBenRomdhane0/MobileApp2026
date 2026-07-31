<?php

namespace App\Http\Controllers\Api\DiscountTemplate;

use App\Http\Controllers\Controller;
use App\Models\DiscountTemplate;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteDiscountTemplateController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            $template = DiscountTemplate::find($id);

            if (!$template) {
                return $this->returnErrorResponse(
                    __('messages.discount_template.not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            $template->delete();

            return $this->returnSuccessResponse(
                __('messages.discount_template.deleted'),
                null,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to delete discount template', ['id' => $id, 'error' => $e->getMessage()]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.discount_template.delete_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
