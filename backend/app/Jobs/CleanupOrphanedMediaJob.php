<?php

namespace App\Jobs;

use App\Models\Media;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CleanupOrphanedMediaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $expired = now()->subHours(24);

        $mediaItems = Media::whereNull('model_type')
            ->whereNull('model_id')
            ->where('created_at', '<=', $expired)
            ->get();

        foreach ($mediaItems as $media) {
            try {
                // Delete from disk
                if (Storage::disk($media->disk ?? 's3')->exists($media->file_path)) {
                    Storage::disk($media->disk ?? 's3')->delete($media->file_path);
                }

                // Delete HLS assets if present
                if (str_ends_with($media->mime_type, 'mpegurl')) {
                    $hlsFolder = dirname($media->file_path);
                    Storage::disk($media->disk ?? 's3')->deleteDirectory($hlsFolder);
                }

                // Delete metadata
                $media->metadata()->delete();

                // Delete record
                $media->delete();

            } catch (\Throwable $e) {
                Log::error("[Cleanup] Failed to delete media #{$media->id}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}