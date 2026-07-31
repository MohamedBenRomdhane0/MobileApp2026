<?php

namespace App\Http\Controllers\Api\DiscountTemplate;

use App\Http\Controllers\Controller;
use App\Http\Requests\DiscountTemplate\StoreDiscountTemplateRequest;
use App\Models\DiscountTemplate;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StoreDiscountTemplateController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreDiscountTemplateRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();

            $template = DiscountTemplate::create([
                'name'            => $data['name'],
                'description'     => $data['description'] ?? null,
                'icon'            => $data['icon'],
                'color'           => $data['color'],
                'behavior'        => $data['behavior'],
                'behavior_config' => $data['behavior_config'] ?? null,
                'enabled'         => $data['enabled'] ?? true,
                'sort_order'      => $data['sort_order'] ?? 0,
            ]);

            foreach ($data['kinds'] as $kindData) {
                $template->kinds()->create($kindData);
            }

            DB::commit();

            return $this->returnSuccessResponse(
                __('messages.discount_template.created'),
                $template->load('kinds'),
                ResponseAlias::HTTP_CREATED
            );
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create discount template', ['error' => $e->getMessage()]);

            return $this->returnErrorResponse(
                $e->getMessage() ?? __('messages.discount_template.create_failed'),ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
