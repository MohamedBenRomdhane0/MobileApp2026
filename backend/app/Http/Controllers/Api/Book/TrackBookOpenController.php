<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Repositories\BookRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

final class TrackBookOpenController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $book = Book::findOrFail($id);

            if (!BookAccessService::canAccess($user, $book)) {
                return $this->returnErrorResponse(__('book.access_denied'), ResponseAlias::HTTP_FORBIDDEN);
            }

            $validated = $request->validate([
                'page' => 'nullable|integer|min:1',
            ]);

            $tracking = BookRepository::trackBookOpen($book->id, $user->id, $validated['page'] ?? null);

            return $this->returnSuccessResponse(__('book.tracking_saved'), [
                'has_started'      => true,
                'last_page'        => $tracking->last_page,
                'started_at'       => $tracking->started_at,
                'last_accessed_at' => $tracking->last_accessed_at,
            ], ResponseAlias::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->returnErrorResponse(__('book.not_found'), ResponseAlias::HTTP_NOT_FOUND);
        } catch (\Throwable $e) {
            Log::error($e);
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
