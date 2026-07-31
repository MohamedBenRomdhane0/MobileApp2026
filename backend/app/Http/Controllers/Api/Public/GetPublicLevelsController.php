<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetPublicLevelsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'level_type_id' => 'nullable|integer|exists:level_types,id',
            ]);

            $query = Level::query()->orderBy('id');

            if ($request->filled('level_type_id')) {
                $query->where('level_type_id', $request->integer('level_type_id'));
            }

            $levels = $query->get(['id', 'name', 'level_type_id']);

            return $this->returnSuccessResponse('success', $levels, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse('general_error', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
