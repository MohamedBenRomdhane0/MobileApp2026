<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Icon\ResizeIconRequest;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ResizeBookIconController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __invoke($iconId, ResizeIconRequest $request): JsonResponse
    {
        $size = $request->input('size');
        try {
            DB::beginTransaction();
            BookRepository::resizeBookIcon($iconId, $size);
            DB::commit();
            return $this->returnSuccessResponse(__('book.icon_resized'),null, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error resizing book icon', [
                'icon_id' => $iconId,
                'size' => $size,
                'error' => $e->getMessage(),
            ]);
            return $this->returnErrorResponse($e->getMessage(), $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
