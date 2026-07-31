<?php
namespace App\Http\Controllers\Api\Book;

use App\Enum\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class GetBookByIdController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Get(
     * path="/api/child/books/{id}",
     * summary="Get book details by ID",
     * description="Retrieve detailed information about a specific book for a child.",
     * tags={"Parent"},
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the book to retrieve",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Book retrieved successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Book found"),
     * @OA\Property(property="data", type="object")
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
     * description="Access Denied",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="You do not have access to this book.")
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
     * @OA\Property(property="message", type="string", example="An error occurred while retrieving the book.")
     * )
     * )
     * )
     */
    public function __invoke(int $id)
    {
        try {
            $book = BookRepository::getBookById($id);
            $user = auth()->user();

            if (!BookAccessService::canAccess($user, $book)) {
                return $this->returnErrorResponse(__('book.access_denied'), ResponseAlias::HTTP_FORBIDDEN);
            }

            $isOwnerOrAdmin = $user->hasRole(RoleEnum::ADMIN->value) || $book->user_id === $user->id;
            if (!$isOwnerOrAdmin && $book->ingest_status !== 'ready') {
                return $this->returnErrorResponse(__('book.processing'), ResponseAlias::HTTP_LOCKED);
            }

            return $this->returnSuccessResponse(__('book.book_found'), $book, ResponseAlias::HTTP_OK);

        } catch (\Exception $exception) {
            if ($exception->getCode() === 404) {
                return $this->returnErrorResponse($exception->getMessage(), ResponseAlias::HTTP_NOT_FOUND);
            }
            Log::error($exception);
            return $this->returnErrorResponse(
                $exception->getMessage() ?? __('messages.general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
