<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Icon\UpdateBookIconRequest;
use App\Models\Book;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateBookIconController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * @OA\Put(
     *     path="/api/admin/books/{book}/icons/{iconId}",
     *     summary="Update a specific icon for a book",
     *     tags={"Book"},
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
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"page", "x", "y", "icon_type"},
     *             @OA\Property(property="page", type="integer", example=1),
     *             @OA\Property(property="x", type="number", format="float", example=128.5),
     *             @OA\Property(property="y", type="number", format="float", example=256.3),
     *             @OA\Property(property="icon_type", type="string", enum={"video", "link", "image"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Book icon updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Book icon updated"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error"
     *     )
     * )
     */
public function __invoke(UpdateBookIconRequest $request, Book $book, string $iconId)
{
    $user = auth()->user();

    if (!BookAccessService::canManageIcons($user, $book)) {
        return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
    }

    try {
        BookRepository::updateBookIcon($book, $iconId, $request->validated());

        return $this->returnSuccessResponse(__('book.book_icons_updated'), null, ResponseAlias::HTTP_OK);
    } catch (\Throwable $exception) {
        Log::error($exception);
        return $this->returnErrorResponse(
            $exception->getMessage() ?? __('messages.general_error'),
            ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
        );
    }
}

}
