<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

final class GetBookCountsByLevelController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request)
    {
        try {
            $counts = BookRepository::countsByLevel($request->user());

            return $this->returnSuccessResponse(
                __('messages.success'),
                $counts,
                ResponseAlias::HTTP_OK
            );
        } catch (\Throwable $e) {
            Log::error('[GetBookCountsByLevelController] ' . $e->getMessage(), ['exception' => $e]);

            return $this->returnErrorResponse(
                __('messages.error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
