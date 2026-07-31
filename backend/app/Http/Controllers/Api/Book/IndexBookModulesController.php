<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Repositories\BookModuleRepository;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class IndexBookModulesController extends Controller
{
    use ErrorResponse;

    public function __invoke(Book $book): JsonResponse
    {
        $user = auth()->user();

        if (!BookAccessService::canAccess($user, $book)) {
            return $this->returnErrorResponse('unauthorized', HttpResponse::HTTP_FORBIDDEN);
        }

        $modules = BookModuleRepository::index($book);

        return response()->json([
            'message' => __('messages.success'),
            'data'    => $modules,
        ]);
    }
}
