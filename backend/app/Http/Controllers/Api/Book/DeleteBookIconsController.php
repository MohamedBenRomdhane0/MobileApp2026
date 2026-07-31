<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Icon\DeleteBookIconsRequest;
use App\Models\Book;
use App\Models\BookIcon;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DeleteBookIconsController extends Controller
{
    use SuccessResponse, ErrorResponse;

   /**
     * @OA\Delete(
     * path="/api/admin/books/{book}/icons/{iconId}",
     * summary="Delete a specific icon from a book",
     * description="Deletes a single book icon by its ID.",
     * tags={"Book"},
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="book",
     * in="path",
     * required=true,
     * description="ID of the book",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="iconId",
     * in="path",
     * required=true,
     * description="ID of the icon to delete",
     * @OA\Schema(type="string")
     * ),
     * @OA\Response(
     * response=200,
     * description="Book icon deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Book icons deleted"),
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
     * @OA\Property(property="message", type="string", example="Unauthorized to delete icons for this book")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Book or Icon not found",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Resource not found")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="An error occurred while deleting the icon.")
     * )
     * )
     * )
     */
    public function __invoke(Book $book, string $iconId)
    {
        $user = auth()->user();

        if (!BookAccessService::canManageIcons($user, $book)) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        try {
            BookRepository::deleteBookIconsByIds($book, $iconId);
            return $this->returnSuccessResponse(__('book.book_icons_deleted'), null, ResponseAlias::HTTP_OK);
        } catch (\Throwable $exception) {
            Log::error($exception);
            return $this->returnErrorResponse(
                $exception->getMessage() ?? __('messages.general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
