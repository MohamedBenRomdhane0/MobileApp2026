<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class HeartbeatController extends Controller
{
    use SuccessResponse;

    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->update(['last_seen_at' => now()]);

        return $this->returnSuccessResponse(
            'heartbeat_recorded',
            [
                'last_seen_at' => $user->last_seen_at,
                'is_online' => true,
            ],
            ResponseAlias::HTTP_OK
        );
    }
}
