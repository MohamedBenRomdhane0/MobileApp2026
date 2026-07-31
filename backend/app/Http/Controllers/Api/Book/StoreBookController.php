<?php
namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\StoreBookRequest;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/books",
 *     summary="Store a new book with optional PDF upload",
 *     tags={"Book"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 required={"title", "user_id"},
 *                 @OA\Property(
 *                     property="title",
 *                     type="string",
 *                     example="Physics Book"
 *                 ),
 *                 @OA\Property(
 *                     property="type",
 *                     type="integer",
 *                     example=1
 *                 ),
 *                 @OA\Property(
 *                     property="user_id",
 *                     type="integer",
 *                     example=5,
 *                     description="ID of the user creating the book"
 *                 ),
 *                 @OA\Property(
 *                     property="level_material_id",
 *                     type="integer",
 *                     example=3
 *                 ),
 *                 @OA\Property(
 *                     property="media_file_path",
 *                     type="string",
 *                     format="binary",
 *                     description="Optional PDF file"
 *                 ),
 *                @OA\Property(property="cover_image", type="string", format="binary", description="Optional book cover image (jpg/png/webp)"),

 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Book created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Book created"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */

class StoreBookController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreBookRequest $request)
    {
        
        $user = auth()->user();

        if (!BookAccessService::canStore($user)) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        try {
            $attributes = $this->getAttributes($request);

            if (BookAccessService::requiresValidation($user)) {
                $attributes['status'] = \App\Enum\StatusEnum::INACTIVE->value;
            } else {
                $attributes['status'] = \App\Enum\StatusEnum::ACTIVE->value;
            }

            $book = BookRepository::storeBook($attributes);

            return $this->returnSuccessResponse(__('book.book_created'), $book, ResponseAlias::HTTP_CREATED);
        } catch (\Throwable $exception) {
            Log::error($exception);
            return $this->returnErrorResponse($exception->getMessage() ?? __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getAttributes(StoreBookRequest $request): array
    {
        return 
        [
            ...$request->validated(),
            'media_file_path' => $request->file('media_file_path'),
            'cover_image' => $request->file('cover_image'),
        ];
    }
}
