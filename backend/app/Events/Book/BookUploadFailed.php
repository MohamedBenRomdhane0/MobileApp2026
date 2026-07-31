<?php

namespace App\Events\Book;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookUploadFailed implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly int $bookId,
        public readonly string $error,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('users.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'book.failed';
    }

    public function broadcastWith(): array
    {
        return [
            'book_id' => $this->bookId,
            'error'   => $this->error,
        ];
    }
}
