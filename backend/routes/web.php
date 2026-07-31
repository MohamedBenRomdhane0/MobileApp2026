<?php

use Illuminate\Support\Facades\Route;
use App\Services\RealtimeNotifier;

Route::get('/', function () {
    return view('welcome');
});


Route::get('storage/{path}', function (string $path) {
    // On ne gère que les avatars des users
    if (strpos($path, 'users/avatars/') !== 0) {
        abort(404);
    }

    $filename = basename($path); // ex : boy5.png

    $candidates = [
        // 1) si un jour tu mets les fichiers ici, ça marchera aussi
        storage_path('app/public/' . $path),

        // 2) ton dossier actuel "boys"
        storage_path('app/avatars/children/boys/' . $filename),

        // 3) ton dossier actuel "girls"
        storage_path('app/avatars/children/girls/' . $filename),
    ];

    foreach ($candidates as $fullPath) {
        if (is_file($fullPath)) {
            $mime = mime_content_type($fullPath) ?: 'image/png';

            return response()->file($fullPath, [
                'Content-Type' => $mime,
            ]);
        }
    }

    abort(404);
})->where('path', '.*');

// 👇 ROUTE DE TEST WEBSOCKET
Route::get('/test-ws', function () {
    // ⚠️ Mets ici l'id d'un user qui sera connecté au WS côté front
    $userId = 1;

    RealtimeNotifier::notifyUser(
        $userId,
        'Test WebSocket',
        'Hello depuis Laravel 👋',
        ['foo' => 'bar']
    );

    return 'Notification envoyée (si le serveur Node tourne).';
});