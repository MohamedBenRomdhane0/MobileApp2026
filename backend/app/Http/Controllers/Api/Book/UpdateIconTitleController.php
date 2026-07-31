<?php

namespace App\Http\Controllers\Api\Book;

use App\Http\Controllers\Controller;
use App\Models\BookIcon;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UpdateIconTitleController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request, string $iconId): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $icon = BookIcon::findOrFail($iconId);
        $icon->title = $request->input('title');
        $icon->save();

        return $this->returnSuccessResponse(__('book.icon_updated'), null, ResponseAlias::HTTP_OK);
    }
}
