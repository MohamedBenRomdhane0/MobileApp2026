<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Http\Controllers\Controller;
use App\Http\Requests\Draft\LogDraftInteractionRequest;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class LogDraftInteractionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(LogDraftInteractionRequest $request): JsonResponse
    {
        $draftUser = $request->attributes->get('draft_user');
        $type = $request->input('type');

        if ($draftUser->hasUsedInteraction($type)) {
            return response()->json([
                'message' => __('messages.draft_interaction_limit_reached'),
                'code'    => 'interaction_limit_reached',
                'type'    => $type,
            ], ResponseAlias::HTTP_PAYMENT_REQUIRED);
        }

        $draftUser->recordInteraction($type);

        return $this->returnSuccessResponse('draft_interaction_logged', [
            'type'         => $type,
            'interactions' => $draftUser->interactions,
        ], ResponseAlias::HTTP_OK);
    }
}
