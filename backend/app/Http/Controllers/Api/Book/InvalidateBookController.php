<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvalidateBookController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __invoke($bookId): JsonResponse
    {
        try {
           DB::beginTransaction();
           $book = BookRepository::invalidateBook($bookId);
           DB::commit();
            return $this->returnSuccessResponse(__('messages.book_invalidated'), $book, 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return $this->returnErrorResponse($exception->getMessage() ?: __('messages.general_error'), 500);
        }
    }
}
