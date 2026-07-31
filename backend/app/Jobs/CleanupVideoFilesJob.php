<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class CleanupVideoFilesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $mergedFilePath;
    protected string $chunkDir;
    protected string $filename;
    protected int $totalChunks;
    protected int $mediaId;

    public $timeout = 300; // 5 minutes
    public $tries = 2;

    public function __construct(string $mergedFilePath, string $chunkDir, string $filename, int $totalChunks, int $mediaId)
    {
        $this->mergedFilePath = $mergedFilePath;
        $this->chunkDir = $chunkDir;
        $this->filename = $filename;
        $this->totalChunks = $totalChunks;
        $this->mediaId = $mediaId;
        
        // Use low priority queue for cleanup
        $this->onQueue('default');
    }

    public function handle(): void
    {

        $cleanupTasks = [
            'chunk_files' => 0,
            'merged_file' => 0,
            'temp_directory' => 0,
        ];

        try {
            for ($i = 0; $i < $this->totalChunks; $i++) {
                $chunkFile = "{$this->chunkDir}/{$this->filename}_chunk_{$i}.part";
                if (file_exists($chunkFile)) {
                    if (unlink($chunkFile)) {
                        $cleanupTasks['chunk_files']++;
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning('Failed to cleanup some chunk files', [
                'error' => $e->getMessage(),
                'media_id' => $this->mediaId
            ]);
        }

        try {
            if (file_exists($this->mergedFilePath)) {
                if (unlink($this->mergedFilePath)) {
                    $cleanupTasks['merged_file'] = 1;
                }
            }
        } catch (\Exception $e) {
            Log::warning('Failed to cleanup merged file', [
                'file' => $this->mergedFilePath,
                'error' => $e->getMessage(),
                'media_id' => $this->mediaId
            ]);
        }

        try {
            $tmpPath = storage_path("app/tmp/{$this->mediaId}/");
            if (File::exists($tmpPath)) {
                if (File::deleteDirectory($tmpPath)) {
                    $cleanupTasks['temp_directory'] = 1;
                }
            }
        } catch (\Exception $e) {
            Log::warning('Failed to cleanup temp directory', [
                'directory' => $tmpPath,
                'error' => $e->getMessage(),
                'media_id' => $this->mediaId
            ]);
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Video cleanup job failed', [
            'media_id' => $this->mediaId,
            'error' => $exception->getMessage()
        ]);
    }

    public function tags(): array
    {
        return ['cleanup', 'video', 'media:' . $this->mediaId];
    }
}