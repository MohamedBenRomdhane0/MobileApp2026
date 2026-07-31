<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\RoleEnum;
use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetBookByIdForChildController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse;
    public function __invoke(int $id): JsonResponse
    {
        try {
            $book = BookRepository::getBookById($id);
            $user = auth()->user();

            $isOwnerOrAdmin = $user && (
                $user->hasRole(RoleEnum::ADMIN->value) || $book->user_id === $user->id
            );
            if (!$isOwnerOrAdmin && $book->ingest_status !== 'ready') {
                return $this->returnErrorResponse(__('book.processing'), ResponseAlias::HTTP_LOCKED);
            }

            return $this->returnSuccessResponse(__('book.book_found'), $book, ResponseAlias::HTTP_OK);
        } catch (\Throwable $exception) {
            Log::error($exception);
            return $this->returnErrorResponse($exception->getMessage() ?? __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
