<?php

namespace App\Http\Controllers\Api\Section;

use App\Http\Controllers\Controller;
use App\Http\Requests\Section\SyncSectionsToLevelRequest;
use App\Models\Level;
use App\Repositories\SectionRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

final class SyncSectionsToLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(SyncSectionsToLevelRequest $request, int $levelId): JsonResponse
    {
        try {
            SectionRepository::syncToLevel($levelId, $request->input('section_ids', []));
            $levelSections = Level::findOrFail($levelId)
                ->levelSections()
                ->with(['section', 'materials'])
                ->get();
            return $this->returnSuccessResponse(__('messages.update_success'), $levelSections, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(__('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
