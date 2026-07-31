<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateParentRequest;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CreateParentController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(CreateParentRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $data = $request->validated();
            $parent = UserRepository::createParent($data);
            DB::commit();
            return $this->returnSuccessResponse(__('messages.parent_created'), $parent, ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?: __('messages.parent_creation_failed'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
