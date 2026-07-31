<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RealtimeNotifier
{
    /**
     * Envoie une notification temps réel au serveur Node (Socket.IO)
     */
    public static function notifyUser(
        int $userId,
        string $title,
        string $body = '',
        array $data = []
    ): void {
        $baseUrl = rtrim(config('services.websocket.url'), '/');

        if (empty($baseUrl)) {
            Log::error('WS notify failed: services.websocket.url is empty');
            return;
        }

        $url = $baseUrl . '/notify';

        try {
            Http::post($url, [
                'userId' => $userId,
                'title'  => $title,
                'body'   => $body,
                'data'   => $data,
            ]);
        } catch (\Throwable $e) {
            Log::error('WS notify failed: ' . $e->getMessage());
        }
    }
}
