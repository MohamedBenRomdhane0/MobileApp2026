<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Http\Controllers\Controller;
use App\Repositories\BookRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetDraftBookByIdController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, int $id): JsonResponse
    {
        try {
            $book = BookRepository::getBookById($id);

            return $this->returnSuccessResponse('success', $book, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('GetDraftBookById failed: ' . $e->getMessage());
            return $this->returnErrorResponse('general_error', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
