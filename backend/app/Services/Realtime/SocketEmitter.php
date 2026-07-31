<?php

namespace App\Services\Realtime;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

/**
 * Publishes realtime event envelopes onto Redis Pub/Sub for the dedicated
 * Socket.IO server (abajim-socket-server) to fan out to connected clients.
 *
 * Envelope shape consumed by the Node server:
 *   { "room": "user:42", "event": "video.status", "payload": {...} }
 */
class SocketEmitter
{
    /**
     * Emit an event to a specific room.
     *
     * @param  array<string, mixed>  $payload
     */
    public static function emit(string $room, string $event, array $payload): void
    {
        $envelope = [
            'room' => $room,
            'event' => $event,
            'payload' => $payload,
            'id' => (string) Str::uuid(),
            'emittedAt' => now()->toISOString(),
        ];

        try {
            Redis::connection(config('socket.redis_connection', 'default'))
                ->publish(config('socket.channel', 'socket-events'), json_encode($envelope));
        } catch (\Throwable $e) {
            // Realtime delivery is best-effort; never break the calling flow.
            Log::error('SocketEmitter publish failed', [
                'room' => $room,
                'event' => $event,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Emit to a user's private room (user:{id}).
     *
     * @param  array<string, mixed>  $payload
     */
    public static function toUser(int $userId, string $event, array $payload): void
    {
        self::emit("user:{$userId}", $event, $payload);
    }

    /**
     * Emit to a shared book room (book:{id}).
     *
     * @param  array<string, mixed>  $payload
     */
    public static function toBook(int $bookId, string $event, array $payload): void
    {
        self::emit("book:{$bookId}", $event, $payload);
    }
}
