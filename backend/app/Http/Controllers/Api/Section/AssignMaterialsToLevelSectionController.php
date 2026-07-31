<?php

namespace App\Http\Controllers\Api\Section;

use App\Http\Controllers\Controller;
use App\Http\Requests\Section\AssignMaterialsToSectionRequest;
use App\Repositories\SectionRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class AssignMaterialsToLevelSectionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(AssignMaterialsToSectionRequest $request, int $levelSectionId): JsonResponse
    {
        try {
            $levelSection = SectionRepository::assignMaterialsToLevelSection(
                $levelSectionId,
                $request->validated()['material_ids'] ?? []
            );
            return $this->returnSuccessResponse(__('messages.update_success'), $levelSection, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
