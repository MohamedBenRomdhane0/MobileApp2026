<?php

namespace App\Http\Controllers\Api\Section;

use App\Http\Controllers\Controller;
use App\Http\Requests\Section\CreateSectionRequest;
use App\Repositories\SectionRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CreateSectionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(CreateSectionRequest $request): JsonResponse
    {
        try {
            $section = SectionRepository::create($request->validated());
            return $this->returnSuccessResponse(__('messages.create_success'), $section, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? __('messages.section_creation_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
