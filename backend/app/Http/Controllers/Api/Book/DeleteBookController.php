<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteBookController extends Controller
{
    use SuccessResponse, ErrorResponse;

/**
     * @OA\Delete(
     * path="/api/admin/books/{book}",
     * summary="Delete a book and its related icons/media",
     * description="Permanently deletes a book along with all its associated icons and media files.",
     * tags={"Book"},
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="book",
     * in="path",
     * description="ID of the book to delete",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Book deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Book deleted successfully."),
     * @OA\Property(property="data", type="null")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Unauthorized",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="You are not authorized to delete this book.")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Book not found",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Book not found.")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="An error occurred while deleting the book.")
     * )
     * )
     * )
     */
    public function __invoke(Book $book)
    {
        $user = auth()->user();

        if (!BookAccessService::canDelete($user, $book)) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        try {
            BookRepository::deleteBook($book);

            return $this->returnSuccessResponse(__('book.book_deleted'), null, ResponseAlias::HTTP_OK);
        } catch (\Throwable $exception) {
            Log::error($exception);
            return $this->returnErrorResponse(
                $exception->getMessage() ?? __('messages.general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
