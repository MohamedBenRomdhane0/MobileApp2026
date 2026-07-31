<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Book\SyncIconVideosRequest;
use App\Models\Book;
use App\Models\BookIcon;
use App\Models\Media;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SyncIconVideosController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(SyncIconVideosRequest $request, int $iconId): JsonResponse
    {
        $data = $this->getAttributes($request);

        DB::beginTransaction();
        try {
            $icon = BookIcon::find($iconId);
            if (!$icon) {
                DB::rollBack();
                return $this->returnErrorResponse(__('book.icon.not_found'), ResponseAlias::HTTP_NOT_FOUND);
            }
            $currentIds = Media::query()->where('model_type', BookIcon::class)->where('model_id', $icon->id)->pluck('id');
            $targetIds = collect($data['selected_ids']);
            $toAssign = $targetIds->diff($currentIds);
            $toUnassign = $currentIds->diff($targetIds);
            $result = BookRepository::syncVideosForIcon($toAssign, $toUnassign, $icon);

            DB::commit();
            return $this->returnSuccessResponse(__('book.icon.videos.synced'), $result, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.unattach_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(SyncIconVideosRequest $request): array
    {
        return $request->validated();
    }
}
