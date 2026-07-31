<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Http\Controllers\Controller;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class RestoreDraftSessionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        $draftUser = $request->attributes->get('draft_user');
        $draftUser->load('level');

        return $this->returnSuccessResponse('draft_session_restored', [
            'draft_token'  => $draftUser->token,
            'level_id'     => $draftUser->level_id,
            'level'        => $draftUser->level,
            'interactions' => $draftUser->interactions ?? [],
            'expires_at'   => $draftUser->expires_at,
        ], ResponseAlias::HTTP_OK);
    }
}
