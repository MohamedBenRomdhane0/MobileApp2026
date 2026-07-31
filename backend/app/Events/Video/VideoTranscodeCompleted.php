<?php

namespace App\Events\Video;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VideoTranscodeCompleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly int $mediaId,
        public readonly string $hlsUrl,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('users.' . $this->userId)];
    }

    public function broadcastAs(): string
    {
        return 'video.completed';
    }

    public function broadcastWith(): array
    {
        return [
            'media_id' => $this->mediaId,
            'hls_url'  => $this->hlsUrl,
        ];
    }
}
