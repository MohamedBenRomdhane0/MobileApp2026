<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\UpdateBookModuleRequest;
use App\Models\Book;
use App\Models\BookModule;
use App\Repositories\BookModuleRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class UpdateBookModuleController extends Controller
{
    use ErrorResponse;

    public function __invoke(UpdateBookModuleRequest $request, Book $book, BookModule $module): JsonResponse
    {
        $user = auth()->user();

        if (!BookAccessService::canUpdate($user, $book)) {
            return $this->returnErrorResponse('unauthorized', HttpResponse::HTTP_FORBIDDEN);
        }

        if ($module->book_id !== $book->id) {
            return $this->returnErrorResponse('not_found', HttpResponse::HTTP_NOT_FOUND);
        }

        try {
            $updated = BookModuleRepository::update($module, $request->validated());

            return response()->json([
                'message' => __('messages.success'),
                'data'    => $updated,
            ]);
        } catch (\Throwable $e) {
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?? 'general_error', HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
