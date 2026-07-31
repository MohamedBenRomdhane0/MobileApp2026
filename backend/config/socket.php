<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Realtime Socket Bridge
    |--------------------------------------------------------------------------
    |
    | Configuration for the dedicated Socket.IO server bridge. Laravel publishes
    | realtime event envelopes onto a Redis Pub/Sub channel; the Node Socket.IO
    | cluster subscribes and fans them out to the appropriate rooms.
    |
    */

    // Redis connection (from config/database.php "redis") used for publishing.
    'redis_connection' => env('SOCKET_REDIS_CONNECTION', 'default'),

    // Pub/Sub channel that the Socket.IO server subscribes to.
    // MUST match REDIS_EVENT_CHANNEL in abajim-socket-server.
    'channel' => env('SOCKET_REDIS_CHANNEL', 'socket-events'),

];
