<?php

namespace App\Http\Controllers\Api\Section;

use App\Http\Controllers\Controller;
use App\Http\Requests\Section\UpdateLevelSectionSharingGroupRequest;
use App\Models\LevelSectionMaterial;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateLevelSectionMaterialSharingGroupController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateLevelSectionSharingGroupRequest $request, int $levelSectionMaterialId): JsonResponse
    {
        try {
            $lsm = LevelSectionMaterial::findOrFail($levelSectionMaterialId);
            $lsm->update(['sharing_group' => $request->validated()['sharing_group'] ?? null]);
            return $this->returnSuccessResponse(
                __('messages.update_success'),
                $lsm->load('material.translations'),
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
