<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateStaffRequest;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CreateStaffController extends Controller
{
    /**
     * Handle the incoming request.
     */
    use SuccessResponse, ErrorResponse;
    public function __invoke(CreateStaffRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $data = $request->validated();
            $staff = UserRepository::createStaff($data);
            DB::commit();
            return $this->returnSuccessResponse(__('messages.staff_created'), $staff, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.staff_creation_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
