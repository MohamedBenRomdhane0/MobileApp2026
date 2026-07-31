<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Models\BookIcon;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class GetIconByIdController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Get(
     *     path="/api/child/books/{book}/icons/{iconId}",
     *     summary="Get a specific icon by ID for a book",
     *     tags={"Parent"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="book",
     *         in="path",
     *         required=true,
     *         description="Book ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="iconId",
     *         in="path",
     *         required=true,
     *         description="Icon ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Icon found successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Book icon found"),
     *             @OA\Property(property="data", type="object", ref="#/components/schemas/BookIcon")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Access denied",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Access denied to this book")
     *         )
     *     ),
     * )
     */

    public function __invoke(Book $book, $iconId)
    {
        $user = auth()->user();


    if (!BookAccessService::canAccess($user, $book)) {
        return $this->returnForbidden(__('book.access_denied'));
    }

    try {
        $icon = BookRepository::getBookIconById($book, $iconId);

        return $this->returnSuccessResponse(__('book.icon_found'), $icon, ResponseAlias::HTTP_OK);
    } catch (\Throwable $e) {
        Log::error($e);
        return $this->returnErrorResponse($e->getMessage(), $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
    }
    }
}
