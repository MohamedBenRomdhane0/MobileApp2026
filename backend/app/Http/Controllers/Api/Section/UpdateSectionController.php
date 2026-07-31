<?php

namespace App\Http\Controllers\Api\Section;

use App\Http\Controllers\Controller;
use App\Http\Requests\Section\UpdateSectionRequest;
use App\Repositories\SectionRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateSectionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateSectionRequest $request, int $sectionId): JsonResponse
    {
        try {
            $section = SectionRepository::update($sectionId, $request->validated());
            return $this->returnSuccessResponse(__('messages.update_success'), $section, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
