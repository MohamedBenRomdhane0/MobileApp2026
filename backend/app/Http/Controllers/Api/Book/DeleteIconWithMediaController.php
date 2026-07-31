<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;

class DeleteIconWithMediaController extends Controller
{
    /**
     * @OA\Delete(
     * path="/api/admin/books/{book}/icon-with-media/{iconId}",
     * summary="Delete a book icon and its associated media",
     * description="Permanently deletes a book icon and cascades the deletion to its associated media files.",
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
     * description="Icon and media deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Icon deleted"),
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
     * @OA\Property(property="message", type="string", example="You do not have permission to delete this icon.")
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
     * @OA\Property(property="message", type="string", example="Failed to delete icon and media.")
     * )
     * )
     * )
     */
    use SuccessResponse, ErrorResponse;
    public function __invoke(Book $book, string $iconId): JsonResponse
    {
        $user = auth()->user();

        if (!BookAccessService::canManageIcons($user, $book)) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }
        try {
            DB::beginTransaction();
            BookRepository::deleteBookIconById(book: $book, iconId: $iconId);
            DB::commit();
            return $this->returnSuccessResponse(__('book.icon_deleted'), null, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.delete_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
