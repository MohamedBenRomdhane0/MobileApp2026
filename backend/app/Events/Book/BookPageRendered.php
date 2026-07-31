<?php

namespace App\Events\Book;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookPageRendered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly int $bookId,
        public readonly int $pagesRendered,
        public readonly int $pagesTotal,
        public readonly int $progress,
        public readonly int $pageNumber,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('users.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'book.page';
    }

    public function broadcastWith(): array
    {
        return [
            'book_id'        => $this->bookId,
            'pages_rendered' => $this->pagesRendered,
            'pages_total'    => $this->pagesTotal,
            'progress'       => $this->progress,
            'page_number'    => $this->pageNumber,
        ];
    }
}
