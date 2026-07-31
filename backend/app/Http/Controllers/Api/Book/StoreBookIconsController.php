<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Icon\StoreBookIconsRequest;
use App\Models\Book;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StoreBookIconsController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * @OA\Post(
     *     path="/api/admin/books/{book}/icons",
     *     summary="Store icons for a book",
     *     tags={"Book"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="book",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="icons",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="page", type="integer", example=1),
     *                     @OA\Property(property="x", type="number", example=120.5),
     *                     @OA\Property(property="y", type="number", example=220.0),
     *                     @OA\Property(property="icon_type", type="string", enum={"video", "link", "image"})
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Icons added",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Icons added"),
     *             @OA\Property(property="data", type="null")
     *         )
     *     )
     * )
     */
public function __invoke(StoreBookIconsRequest $request, Book $book)
{
    $user = auth()->user();

    if (!BookAccessService::canManageIcons($user, $book)) {
        return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
    }

    try {
        $icon = BookRepository::storeBookIcon($book, $request->validated());
        return $this->returnSuccessResponse(__('book.book_icons_created'), $icon, ResponseAlias::HTTP_CREATED);
    } catch (\Throwable $exception) {
        Log::error($exception);
        return $this->returnErrorResponse(
            $exception->getMessage() ?? __('messages.general_error'),
            ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
        );
    }
}

}
