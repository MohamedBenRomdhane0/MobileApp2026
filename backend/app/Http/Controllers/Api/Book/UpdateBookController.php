<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Models\Book;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class UpdateBookController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Put(
     *     path="/api/admin/books/{book}",
     *     summary="Update a book",
     *     tags={"Book"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="book",
     *         in="path",
     *         required=true,
     *         description="ID of the book",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="title", type="string", example="Updated Book Title"),
     *                 @OA\Property(property="type", type="integer", example=2),
     *                 @OA\Property(property="level_material_id", type="integer", example=5),
     *                 @OA\Property(property="media_file_path", type="string", format="binary", description="PDF document"),
     *                 @OA\Property(property="cover_image", type="string", format="binary", description="Cover image (jpg/png)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Book updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Book updated"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized to update this book"
     *     )
     * )
     */
    public function __invoke(UpdateBookRequest $request, Book $book)
    {
        $user = auth()->user();

        if (!BookAccessService::canUpdate($user, $book)) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $attributes = $this->getAttributes($request);

        //---> If teacher: always reset to INACTIVE
        if (BookAccessService::requiresValidation($user)) {
            $attributes['status'] = \App\Enum\StatusEnum::INACTIVE->value;
        }

        try {
            DB::beginTransaction();
            $updatedBook = BookRepository::updateBook($book, $attributes);

            DB::commit();
            return $this->returnSuccessResponse(__('book.book_updated'), $updatedBook, ResponseAlias::HTTP_OK);
        } catch (\Throwable $exception) {
            Log::error($exception);
            DB::rollBack();
            return $this->returnErrorResponse(
                $exception->getMessage() ?? __('messages.general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    private function getAttributes(UpdateBookRequest $request): array
    {
        return $request->validated();
    }
}
 