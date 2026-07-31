<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Helpers\DraftTokenHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Draft\CreateDraftSessionRequest;
use App\Models\DraftUser;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CreateDraftSessionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(CreateDraftSessionRequest $request): JsonResponse
    {
        try {
            $token = DraftTokenHelper::generate();

            $draftUser = DraftUser::create([
                'token'        => $token,
                'level_id'     => $request->integer('level_id'),
                'interactions' => [],
                'ip_address'   => $request->ip(),
                'expires_at'   => now()->addDays(30),
            ]);

            $draftUser->load('level');

            return $this->returnSuccessResponse('draft_session_created', [
                'draft_token' => $token,
                'level_id'    => $draftUser->level_id,
                'level'       => $draftUser->level,
                'expires_at'  => $draftUser->expires_at,
            ], ResponseAlias::HTTP_CREATED);
        } catch (Exception $e) {
            Log::error('CreateDraftSession failed: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? 'general_error', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
