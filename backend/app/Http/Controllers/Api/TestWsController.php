<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TestWsController extends Controller
{
    public function __invoke(Request $request)
    {
        $userId = (int) $request->input('user_id', 0);

        if ($userId <= 0) {
            return response()->json([
                'ok' => false,
                'error' => 'user_id obligatoire',
            ], 400);
        }

        $wsUrl = rtrim(config('services.ws_server.url'), '/') . '/notify';

        $response = Http::post($wsUrl, [
            'userId' => $userId,
            'title'  => '🧪 Test WebSocket',
            'body'   => 'Notification envoyée depuis Laravel',
            'data'   => [
                'source' => 'laravel-test',
            ],
        ]);

        return response()->json([
            'ok'          => $response->successful(),
            'status'      => $response->status(),
            'ws_response' => $response->json(),
        ]);
    }
}
