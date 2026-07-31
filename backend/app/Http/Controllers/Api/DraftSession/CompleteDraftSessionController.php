<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Http\Controllers\Controller;
use App\Http\Requests\Draft\CompleteDraftSessionRequest;
use App\Repositories\DraftSessionRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CompleteDraftSessionController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __construct(protected DraftSessionRepository $draftSessionRepository) {}

    public function __invoke(CompleteDraftSessionRequest $request): JsonResponse
    {
        try {
            $draftUser = $request->attributes->get('draft_user');
            $result = $this->draftSessionRepository->complete($draftUser, $request->validated());

            return $this->returnSuccessResponse('verification_sent', [
                'user_id' => $result['user_id'],
            ], ResponseAlias::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => __('messages.validation_error'),
                'errors'  => $e->errors(),
            ], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('CompleteDraftSession failed: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? 'general_error', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
