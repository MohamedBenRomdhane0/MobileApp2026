<?php

use Illuminate\Support\Facades\Broadcast;

// Private channel for all user-specific events (book ingestion, video transcoding)
Broadcast::channel('users.{userId}', function ($user, int $userId) {
    return (int) $user->id === $userId;
});

// Private channel scoped to a specific book (used for book-room subscriptions)
Broadcast::channel('books.{bookId}', function ($user, int $bookId) {
    $book = \App\Models\Book::find($bookId);
    return $book && (int) $user->id === (int) $book->user_id;
});
