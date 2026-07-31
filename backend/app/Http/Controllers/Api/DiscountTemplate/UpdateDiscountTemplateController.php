<?php

namespace App\Http\Controllers\Api\DiscountTemplate;

use App\Http\Controllers\Controller;
use App\Http\Requests\DiscountTemplate\UpdateDiscountTemplateRequest;
use App\Models\DiscountTemplate;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateDiscountTemplateController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateDiscountTemplateRequest $request, int $id): JsonResponse
    {
        try {
            $template = DiscountTemplate::find($id);

            if (!$template) {
                return $this->returnErrorResponse(
                    __('messages.discount_template.not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            DB::beginTransaction();

            $data = $request->validated();

            $template->update(array_filter([
                'name'            => $data['name'] ?? null,
                'description'     => array_key_exists('description', $data) ? $data['description'] : $template->description,
                'icon'            => $data['icon'] ?? null,
                'color'           => $data['color'] ?? null,
                'behavior'        => $data['behavior'] ?? null,
                'behavior_config' => array_key_exists('behavior_config', $data) ? $data['behavior_config'] : $template->behavior_config,
                'enabled'         => $data['enabled'] ?? null,
                'sort_order'      => $data['sort_order'] ?? null,
            ], fn($v) => $v !== null));

            if (isset($data['kinds'])) {
                $template->kinds()->delete();
                foreach ($data['kinds'] as $kindData) {
                    $template->kinds()->create($kindData);
                }
            }

            DB::commit();

            return $this->returnSuccessResponse(
                __('messages.discount_template.updated'),
                $template->load('kinds'),
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update discount template', ['id' => $id, 'error' => $e->getMessage()]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.discount_template.update_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
