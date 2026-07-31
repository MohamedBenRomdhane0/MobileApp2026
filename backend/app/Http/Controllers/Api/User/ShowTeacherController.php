<?php

namespace App\Http\Controllers\Api\User;

use App\Enum\RoleEnum;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ShowTeacherController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id): JsonResponse
    {
        try {
            $teacher = UserRepository::getUserById($id);

            if (!$teacher->hasRole(RoleEnum::TEACHER->value)) {
                return $this->returnErrorResponse(__('messages.teacher_not_found'), ResponseAlias::HTTP_NOT_FOUND);
            }

            return $this->returnSuccessResponse(__('messages.teacher_found'), $teacher, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            $code = $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR;
            return $this->returnErrorResponse($e->getMessage(), $code);
        }
    }
}
