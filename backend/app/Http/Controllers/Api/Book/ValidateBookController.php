<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ValidateBookController extends Controller
{
    use SuccessResponse, ErrorResponse;
    public function __invoke($bookId): JsonResponse
    {
        try {
            DB::beginTransaction();
            $book = BookRepository::validateBook($bookId);
            DB::commit();
            return $this->returnSuccessResponse(__('messages.book_validated'), $book, ResponseAlias::HTTP_OK);
        } catch (\Exception $exception) {
            DB::rollBack();
            return $this->returnErrorResponse($exception->getMessage() ?: __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
