<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Http\Controllers\Controller;
use App\Repositories\LevelMaterialRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetDraftLevelMaterialsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        try {
            $draftUser = $request->attributes->get('draft_user');

            $items = LevelMaterialRepository::listByLevel($draftUser->level_id);

            return $this->returnSuccessResponse('success', $items, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('GetDraftLevelMaterials failed: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
