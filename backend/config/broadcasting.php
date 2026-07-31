<?php

return [

    'default' => env('BROADCAST_DRIVER', 'reverb'),

    'connections' => [

        // Pusher is an alias for Reverb — Reverb speaks the Pusher protocol,
        // so BROADCAST_DRIVER=pusher in .env routes here transparently.
        'pusher' => [
            'driver'  => 'reverb',
            'key'     => env('PUSHER_APP_KEY', env('REVERB_APP_KEY')),
            'secret'  => env('PUSHER_APP_SECRET', env('REVERB_APP_SECRET')),
            'app_id'  => env('PUSHER_APP_ID', env('REVERB_APP_ID')),
            'options' => [
                'host'   => env('REVERB_HOST', '127.0.0.1'),
                'port'   => env('REVERB_PORT', 8080),
                'scheme' => env('REVERB_SCHEME', 'http'),
                'useTLS' => env('REVERB_SCHEME', 'http') === 'https',
            ],
            'client_options' => [],
        ],

        'reverb' => [
            'driver'  => 'reverb',
            'key'     => env('REVERB_APP_KEY'),
            'secret'  => env('REVERB_APP_SECRET'),
            'app_id'  => env('REVERB_APP_ID'),
            'options' => [
                'host'   => env('REVERB_HOST', '127.0.0.1'),
                'port'   => env('REVERB_PORT', 8080),
                'scheme' => env('REVERB_SCHEME', 'http'),
                'useTLS' => env('REVERB_SCHEME', 'http') === 'https',
            ],
            'client_options' => [],
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
