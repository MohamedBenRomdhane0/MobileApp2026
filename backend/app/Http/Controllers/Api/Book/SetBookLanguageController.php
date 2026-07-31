<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\SetBookLanRequestRequest;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Models\Book;

class SetBookLanguageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse;
    public function __invoke(Book $book, SetBookLanRequestRequest $request): JsonResponse
    {
        try {
           $data = $request->validated();
            $response = BookRepository::setBookLanguage($book, $data['language']);

            return $this->returnSuccessResponse(__('book.language_updated'), $response, ResponseAlias::HTTP_OK);
        } catch (\Throwable $e) {
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.update_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
