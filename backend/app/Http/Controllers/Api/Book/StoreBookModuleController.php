<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\StoreBookModuleRequest;
use App\Models\Book;
use App\Repositories\BookModuleRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class StoreBookModuleController extends Controller
{
    use ErrorResponse;

    public function __invoke(StoreBookModuleRequest $request, Book $book): JsonResponse
    {
        $user = auth()->user();

        if (!BookAccessService::canUpdate($user, $book)) {
            return $this->returnErrorResponse('unauthorized', HttpResponse::HTTP_FORBIDDEN);
        }

        try {
            $module = BookModuleRepository::store($book, $request->validated());

            return response()->json([
                'message' => __('messages.success'),
                'data'    => $module,
            ], HttpResponse::HTTP_CREATED);
        } catch (\Throwable $e) {
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?? 'general_error', HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
