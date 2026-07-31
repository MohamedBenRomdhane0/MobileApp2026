<?php

namespace App\Http\Controllers\Api\Section;

use App\Http\Controllers\Controller;
use App\Repositories\SectionRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteSectionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $sectionId): JsonResponse
    {
        try {
            SectionRepository::delete($sectionId);
            return $this->returnSuccessResponse(__('messages.delete_success'), null, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? _('messages.delete_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
