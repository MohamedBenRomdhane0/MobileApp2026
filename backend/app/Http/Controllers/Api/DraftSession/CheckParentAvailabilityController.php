<?php

namespace App\Http\Controllers\Api\DraftSession;

use App\Http\Controllers\Controller;
use App\Http\Requests\Draft\CheckParentAvailabilityRequest;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CheckParentAvailabilityController extends Controller
{
    use SuccessResponse;

    public function __invoke(CheckParentAvailabilityRequest $request): JsonResponse
    {
        return $this->returnSuccessResponse('available', true, ResponseAlias::HTTP_OK);
    }
}
