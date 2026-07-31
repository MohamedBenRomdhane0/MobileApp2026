<?php

namespace App\Http\Controllers\Api\User;

use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Repositories\MediaRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DeleteTeacherTrailerController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $user = request()->user();

            DB::transaction(function () use ($user) {
                MediaRepository::deleteMediaByTag($user, MediaTagEnum::TEACHER_TRAILER->value);
            });

            return $this->returnSuccessResponse(
                __('messages.update_success'),
                [],
                Response::HTTP_OK,
            );
        } catch (\Throwable $exception) {
            Log::error('Failed to delete teacher trailer', ['error' => $exception->getMessage()]);
            return $this->returnErrorResponse($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
