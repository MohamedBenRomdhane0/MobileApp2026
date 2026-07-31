<?php

namespace App\Jobs;

use App\Events\Video\VideoStatusUpdated;
use App\Models\Media;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redis;

class TranscodeVideoToHLSJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Media $media;
    protected string $filePath;
    protected string $filename;
    protected string $chunkDir;
    protected int $totalChunks;

    // Progress tracking
    protected ?float $videoDuration = null;
    protected int $currentProgress = 30;

    // Enhanced job configuration
    public $timeout = 7200;
    public $tries = 2;
    public $maxExceptions = 1;
    public $backoff = [300, 900];

    public function __construct(Media $media, string $filePath, string $filename, string $chunkDir, int $totalChunks)
    {
        $this->media = $media;
        $this->filePath = $filePath;
        $this->filename = $filename;
        $this->chunkDir = $chunkDir;
        $this->totalChunks = $totalChunks;
        $this->onQueue('video_processing');
    }

    /**
     * Updated handle method - Remove outer transaction for progress updates
     */
    public function handle(): void
    {
        $mediaId = $this->media->id;
        $this->debugCurrentProgress();

        $lockKey = "video_transcode:{$mediaId}";
        $lock = Redis::set($lockKey, '1', 'EX', 7200, 'NX');

        if (!$lock) {
            return;
        }

        try {
            $this->verifyDatabaseConnection();

            $this->updateProgress('TRANSCODING_STARTED', 35);

            $this->updateProgress('ANALYZING_VIDEO', 37);
            $localFile = $this->copyMergedFileToTemp();

            $this->videoDuration = $this->getVideoDuration($localFile);

            $this->updateProgress('PREPARING_OUTPUT', 40);
            [$hlsOutputPath, $segmentPattern, $playlistPattern] = $this->setupHLSDirectories();

            $this->updateProgress('TRANSCODING', 45);
            $this->runFFmpegTranscodingWithRealTimeProgress($localFile, $segmentPattern, $playlistPattern);

            $this->updateProgress('UPLOADING_TO_S3', 75);
            $baseKey = $this->uploadHLSFilesToS3($hlsOutputPath);

            $this->updateProgress('FINALIZING', 95);
            $this->finalizeDatabaseUpdates($baseKey);

            $this->scheduleCleanup();

            $this->updateProgress('COMPLETED', 100);


        } catch (\Throwable $e) {
            $this->updateProgress('FAILED', 0, $e->getMessage());

            Log::error('VIDEO TRANSCODING FAILED', [
                'media_id' => $mediaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        } finally {
            Redis::del($lockKey);
        }
    }
    /**
     * Test method to verify database connection and metadata table
     */
    private function verifyDatabaseConnection(): void
    {
        try {
            DB::connection()->getPdo();

            $metadata = $this->media->metadata;

            if (!$metadata) {
                $this->media->metadata()->create([
                    'transcoding_status' => 'TRANSCODING_STARTED',
                    'progress' => 30,
                    'views' => 0,
                    'watch_time' => 0,
                    'status' => \App\Enum\StatusEnum::ACTIVE->value,
                    'processing_started_at' => now(),
                ]);

            }
        } catch (\Exception $e) {
            Log::error('Database verification failed', [
                'media_id' => $this->media->id,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Database connection or metadata table issue: ' . $e->getMessage());
        }
    }

    /**
     * Copy the merged video file to temp directory for processing
     */
    private function copyMergedFileToTemp(): string
    {
        $videoId = $this->media->id;
        $tmpPath = storage_path("app/tmp/{$videoId}/");
        $localFile = "{$tmpPath}{$this->filename}";

        if (!File::exists($tmpPath)) {
            File::makeDirectory($tmpPath, 0777, true);
        }

        if (!copy($this->filePath, $localFile)) {
            throw new \Exception('Failed to copy merged file to temp directory');
        }

        if (!is_file($localFile) || filesize($localFile) === 0) {
            throw new \Exception("Copied file is missing or empty: {$localFile}");
        }

        return $localFile;
    }

    /**
     * Setup HLS output directory structure
     */
    private function setupHLSDirectories(): array
    {
        $videoId = $this->media->id;
        $tmpPath = storage_path("app/tmp/{$videoId}/");
        $hlsOutputPath = $tmpPath . 'hls';

        if (!File::exists($hlsOutputPath)) {
            File::makeDirectory($hlsOutputPath, 0777, true);
        }

        foreach (range(0, 2) as $v) {
            $qualityDir = "{$hlsOutputPath}/{$v}";
            if (!File::exists($qualityDir)) {
                File::makeDirectory($qualityDir, 0777, true);
            }
        }

        $segmentPattern = str_replace('\\', '/', "{$hlsOutputPath}/seg_%v_%03d.ts");
        $playlistPattern = str_replace('\\', '/', "{$hlsOutputPath}/playlist_%v.m3u8");

        return [$hlsOutputPath, $segmentPattern, $playlistPattern];
    }

    /**
     * Run FFmpeg transcoding with REAL-TIME progress monitoring
     */
    private function runFFmpegTranscodingWithRealTimeProgress(string $localFile, string $segmentPattern, string $playlistPattern): void
    {
        $ffmpeg = escapeshellcmd($this->ffmpegPath());

        // Add progress reporting to FFmpeg command
        $progressFile = storage_path("app/tmp/{$this->media->id}/progress.txt");
        $cmd = $this->buildOptimizedFFmpegCommand($ffmpeg, $localFile, $segmentPattern, $playlistPattern, $progressFile);

        Log::info('[HLS] Starting FFmpeg transcoding with real-time progress', [
            'media_id' => $this->media->id,
            'duration' => $this->videoDuration,
            'progress_file' => $progressFile,
        ]);

        // Execute FFmpeg with real-time progress monitoring
        $this->executeFFmpegWithRealTimeProgress($cmd, $progressFile);
    }

    /**
     * Build optimized FFmpeg command with progress reporting
     */
    /**
     * Build optimized FFmpeg command with proper Windows path handling
     */
    private function buildOptimizedFFmpegCommand(string $ffmpeg, string $localFile, string $segmentPattern, string $playlistPattern, string $progressFile): string
    {
        // Use forward slashes and proper escaping for Windows
        $localFile = str_replace('\\', '/', $localFile);
        $progressFile = str_replace('\\', '/', $progressFile);
        $segmentPattern = str_replace('\\', '/', $segmentPattern);
        $playlistPattern = str_replace('\\', '/', $playlistPattern);

        return $ffmpeg .
            ' -y' .
            ' -threads 0' .
            ' -i ' .
            '"' .
            $localFile .
            '"' . // Use quotes instead of escapeshellarg for better Windows support
            ' -progress ' .
            '"' .
            $progressFile .
            '"' .
            ' -preset medium' .
            ' -g 48 -keyint_min 48 -sc_threshold 0' .
            ' -pix_fmt yuv420p -movflags +faststart' .
            ' -filter_complex "[0:v]split=3[v0][v1][v2];' .
            '[v0]scale=1280:720[v0o];[v1]scale=854:480[v1o];' .
            '[v2]scale=640:360[v2o]"' .
            ' -map "[v0o]" -c:v:0 libx264 -b:v:0 2500k -profile:v:0 high -level:v:0 4.0' .
            ' -map "[v1o]" -c:v:1 libx264 -b:v:1 1250k -profile:v:1 main -level:v:1 3.1' .
            ' -map "[v2o]" -c:v:2 libx264 -b:v:2 650k -profile:v:2 baseline -level:v:2 3.0' .
            ' -map 0:a:0? -c:a:0 aac -b:a:0 128k' .
            ' -map 0:a:0? -c:a:1 aac -b:a:1 128k' .
            ' -map 0:a:0? -c:a:2 aac -b:a:2 128k' .
            ' -f hls -hls_flags independent_segments' .
            ' -hls_time 6 -hls_playlist_type vod' .
            ' -hls_segment_type mpegts' .
            ' -hls_segment_filename ' .
            '"' .
            $segmentPattern .
            '"' .
            ' -master_pl_name master.m3u8 -master_pl_publish_rate 1' .
            ' -max_muxing_queue_size 9999' .
            ' -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2"' .
            ' ' .
            '"' .
            $playlistPattern .
            '"';
    }

    /**
     * Enhanced FFmpeg execution with better error handling
     */
    private function executeFFmpegWithRealTimeProgress(string $cmd, string $progressFile): void
    {
        // Clear any existing progress file
        if (file_exists($progressFile)) {
            unlink($progressFile);
        }

        Log::info('[HLS] Executing FFmpeg command', [
            'media_id' => $this->media->id,
            'command' => $cmd,
        ]);

        // For Windows, we need to handle the command differently
        $process = proc_open(
            $cmd,
            [
                0 => ['pipe', 'r'], // stdin
                1 => ['pipe', 'w'], // stdout
                2 => ['pipe', 'w'], // stderr
            ],
            $pipes,
            null,
            null,
            ['bypass_shell' => true],
        );

        if (!is_resource($process)) {
            throw new \Exception('Failed to start FFmpeg process');
        }

        fclose($pipes[0]); // Close stdin

        // Monitor progress in real-time
        $lastProgressUpdate = time();
        $stalled = false;
        $outputBuffer = '';
        $errorBuffer = '';
        $capturedExitCode = null;

        while (true) {
            $status = proc_get_status($process);

            // Check if process is still running
            if (!$status['running']) {
                // Capture exit code HERE — proc_get_status consumes it via waitpid().
                // proc_close() will return -1 if we don't capture it now.
                $capturedExitCode = $status['exitcode'];
                break;
            }

            // Read stderr for any immediate errors
            $stderr = stream_get_contents($pipes[2]);
            if ($stderr) {
                $errorBuffer .= $stderr;
                Log::debug('[HLS] FFmpeg stderr', [
                    'media_id' => $this->media->id,
                    'stderr' => trim($stderr),
                ]);
            }

            // Read stdout
            $stdout = stream_get_contents($pipes[1]);
            if ($stdout) {
                $outputBuffer .= $stdout;
            }

            // Read and parse progress file
            if (file_exists($progressFile)) {
                $progressContent = file_get_contents($progressFile);
                if ($progressContent) {
                    $this->parseFFmpegProgressFile($progressContent);
                    $lastProgressUpdate = time();
                    $stalled = false;
                }
            }

            // Check for stalled process
            if (time() - $lastProgressUpdate > 60) {
                // Increased to 60 seconds
                if (!$stalled) {
                    Log::warning('FFmpeg progress stalled, but continuing...', [
                        'media_id' => $this->media->id,
                        'last_update' => $lastProgressUpdate,
                    ]);
                    $stalled = true;
                }
            }

            // Small delay to prevent excessive CPU usage
            usleep(1000000); // 1 second for better stability
        }

        // Get final output
        $finalOutput = stream_get_contents($pipes[1]);
        $finalErrors = stream_get_contents($pipes[2]);

        if ($finalOutput) {
            $outputBuffer .= $finalOutput;
        }
        if ($finalErrors) {
            $errorBuffer .= $finalErrors;
        }

        fclose($pipes[1]);
        fclose($pipes[2]);

        // proc_close() returns -1 when proc_get_status() already consumed the
        // exit code via waitpid(). Use the value captured in the loop instead.
        proc_close($process);
        $exitCode = $capturedExitCode ?? -1;

        // Clean up progress file
        if (file_exists($progressFile)) {
            unlink($progressFile);
        }

        Log::info('[HLS] FFmpeg process completed', [
            'media_id' => $this->media->id,
            'exit_code' => $exitCode,
            'output_length' => strlen($outputBuffer),
            'error_length' => strlen($errorBuffer),
        ]);

        if ($exitCode !== 0) {
            Log::error('[HLS] FFmpeg failed', [
                'exit_code' => $exitCode,
                'command' => $cmd,
                'output' => $outputBuffer,
                'errors' => $errorBuffer,
                'media_id' => $this->media->id,
            ]);
            throw new \Exception("FFmpeg failed with exit code {$exitCode}. Error: " . trim($errorBuffer));
        }

        Log::info('[HLS] FFmpeg completed successfully', ['media_id' => $this->media->id]);
    }
    /**
     * Parse FFmpeg progress file and update status in real-time
     */
    /**
     * Parse FFmpeg progress file with CORRECT progress calculation
     */
    private function parseFFmpegProgressFile(string $content): void
    {
        if (empty($content) || !$this->videoDuration) {
            return;
        }

        // Parse the progress file content
        $lines = explode("\n", trim($content));
        $progressData = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || $line === 'progress=continue' || $line === 'progress=end') {
                continue;
            }

            if (strpos($line, '=') !== false) {
                [$key, $value] = explode('=', $line, 2);
                $progressData[trim($key)] = trim($value);
            }
        }

        // Extract current time processed
        if (isset($progressData['out_time_ms'])) {
            $currentMicroseconds = (int) $progressData['out_time_ms'];
            $currentSeconds = $currentMicroseconds / 1000000;

            // Calculate transcoding progress as percentage (0-100%)
            $transcodingProgress = ($currentSeconds / $this->videoDuration) * 100;
            $transcodingProgress = max(0, min(100, $transcodingProgress));

            // CORRECT MAPPING: Map transcoding progress to job progress
            // Transcoding phase should span from 40% to 75% (35% total range)
            $jobProgress = 40 + $transcodingProgress * 0.35;
            $jobProgress = (int) round($jobProgress);

            // Ensure we don't exceed the transcoding phase range
            $jobProgress = max(40, min(75, $jobProgress));

            // Only update if progress actually increased
            if ($jobProgress > $this->currentProgress) {
                $this->currentProgress = $jobProgress;
                $this->updateProgress('TRANSCODING', $jobProgress);

                Log::info('FFmpeg progress update', [
                    'media_id' => $this->media->id,
                    'current_time' => round($currentSeconds, 2),
                    'total_duration' => $this->videoDuration,
                    'transcoding_progress' => round($transcodingProgress, 1) . '%',
                    'job_progress' => $jobProgress . '%',
                    'calculation' => "40 + ({$transcodingProgress}/100 * 35) = {$jobProgress}",
                ]);
            }
        }
    }

    /**
     * CORRECTED upload progress tracking
     */
    private function uploadHLSFilesToS3(string $hlsOutputPath): string
    {
        $baseKey = "media/hls/{$this->media->id}/";
        $s3Disk = Storage::disk('s3');
        $uploadedFiles = 0;
        $totalFiles = 0;

        // Count total files
        $allFiles = array_merge(glob("{$hlsOutputPath}/*"), glob("{$hlsOutputPath}/*/*"));
        foreach ($allFiles as $file) {
            if (!is_dir($file)) {
                $totalFiles++;
            }
        }

        Log::info('Starting S3 upload', [
            'total_files' => $totalFiles,
            'media_id' => $this->media->id,
        ]);

        foreach ($allFiles as $file) {
            if (is_dir($file)) {
                continue;
            }

            $relativePath = str_replace("{$hlsOutputPath}/", '', $file);
            $key = $baseKey . $relativePath;
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $mime = $extension === 'm3u8' ? 'application/vnd.apple.mpegurl' : 'video/MP2T';

            try {
                $s3Disk->put($key, fopen($file, 'r'), [
                    'visibility' => 'public',
                    'ACL' => 'public-read',
                    'ContentType' => $mime,
                    'CacheControl' => $extension === 'm3u8' ? 'no-cache' : 'public, max-age=31536000',
                    'ContentDisposition' => 'inline',
                ]);

                $uploadedFiles++;

                // CORRECT PROGRESS CALCULATION
                // Upload phase: 75% to 95% (20% range)
                $uploadProgress = ($uploadedFiles / $totalFiles) * 100; // 0-100%
                $jobProgress = 75 + ($uploadProgress / 100) * 20; // Map to 75-95%
                $jobProgress = (int) round($jobProgress);

                // Update every 5 files or for important files
                if ($uploadedFiles % 5 === 0 || $extension === 'm3u8' || $uploadedFiles === $totalFiles) {
                    $this->updateProgress('UPLOADING_TO_S3', $jobProgress);

                    Log::info('S3 upload progress', [
                        'uploaded' => $uploadedFiles,
                        'total' => $totalFiles,
                        'upload_progress' => round($uploadProgress, 1) . '%',
                        'job_progress' => $jobProgress . '%',
                        'file' => $relativePath,
                        'calculation' => "75 + ({$uploadProgress}/100 * 20) = {$jobProgress}",
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to upload HLS file to S3', [
                    'file' => $file,
                    'key' => $key,
                    'error' => $e->getMessage(),
                ]);
                throw new \Exception('Failed to upload HLS files to S3: ' . $e->getMessage());
            }
        }

        Log::info('S3 upload completed', [
            'total_files' => $totalFiles,
            'media_id' => $this->media->id,
        ]);

        return $baseKey;
    }
    /**
     * Finalization method with its own transaction (only for final updates)
     */
    private function finalizeDatabaseUpdates(string $baseKey): void
    {
        try {
            Log::info('Finalizing database updates', [
                'media_id' => $this->media->id,
                'base_key' => $baseKey,
            ]);

            // Use transaction only for the final, critical updates
            DB::transaction(function () use ($baseKey) {
                // Update metadata
                $this->media->metadata()->updateOrCreate(
                    ['media_id' => $this->media->id],
                    [
                        'transcoding_status' => 'COMPLETED',
                        'progress' => 100,
                        'error_message' => null,
                        'processing_completed_at' => now(),
                        'updated_at' => now(),
                    ],
                );

                // Update main media record
                $this->media->update([
                    'file_path' => $baseKey . 'master.m3u8',
                    'mime_type' => 'application/vnd.apple.mpegurl',
                    'updated_at' => now(),
                ]);
            });

            Log::info('Database finalization completed', [
                'media_id' => $this->media->id,
                'final_url' => $baseKey . 'master.m3u8',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to finalize database updates', [
                'media_id' => $this->media->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Schedule cleanup of temporary files
     */
    private function scheduleCleanup(): void
    {
        CleanupVideoFilesJob::dispatch($this->filePath, $this->chunkDir, $this->filename, $this->totalChunks, $this->media->id)->delay(now()->addHour());
    }

    /**
     * Get video duration with better error handling and path support
     */
    private function getVideoDuration(string $filePath): ?float
    {
        try {
            $ffprobe = str_replace('ffmpeg', 'ffprobe', $this->ffmpegPath());

            // Use forward slashes and quotes for Windows compatibility
            $filePath = str_replace('\\', '/', $filePath);
            $cmd = $ffprobe . ' -v quiet -show_entries format=duration -of csv="p=0" "' . $filePath . '"';

            Log::info('Getting video duration', [
                'media_id' => $this->media->id,
                'command' => $cmd,
                'file_path' => $filePath,
            ]);

            $duration = trim(shell_exec($cmd . ' 2>&1'));

            Log::info('Duration command result', [
                'media_id' => $this->media->id,
                'raw_output' => $duration,
            ]);

            $durationFloat = is_numeric($duration) ? (float) $duration : null;

            if (!$durationFloat || $durationFloat <= 0) {
                Log::warning('Could not determine video duration', [
                    'raw_duration' => $duration,
                    'file' => $filePath,
                    'media_id' => $this->media->id,
                ]);
                return null;
            }

            return $durationFloat;
        } catch (\Exception $e) {
            Log::error('Failed to get video duration', [
                'error' => $e->getMessage(),
                'file' => $filePath,
                'media_id' => $this->media->id,
            ]);
            return null;
        }
    }

    /**
     * SIMPLIFIED and RELIABLE updateProgress method
     */
    private function updateProgress(string $status, int $progress, ?string $error = null): void
    {
        try {
            Log::info('=== ATTEMPTING PROGRESS UPDATE ===', [
                'media_id' => $this->media->id,
                'status' => $status,
                'progress' => $progress,
            ]);

            $updated = DB::update('UPDATE media_metadata SET transcoding_status = ?, progress = ?, error_message = ?, updated_at = ? WHERE media_id = ?', [$status, $progress, $error, now()->format('Y-m-d H:i:s'), $this->media->id]);

            Log::info('Database update result', [
                'affected_rows' => $updated,
                'expected_progress' => $progress,
            ]);

            event(new VideoStatusUpdated(
                userId:   (int) $this->media->creator_id,
                mediaId:  (int) $this->media->id,
                status:   $status,
                progress: $progress,
                error:    $error,
            ));

            Log::info('Progress broadcast sent', [
                'media_id' => $this->media->id,
                'status' => $status,
                'progress' => $progress,
            ]);
        } catch (\Exception $e) {
            Log::error('=== PROGRESS UPDATE FAILED ===', [
                'media_id' => $this->media->id,
                'status' => $status,
                'progress' => $progress,
                'error' => $e->getMessage(),
            ]);

            // Try fallback approach
            $this->fallbackUpdateProgress($status, $progress, $error);
        }
    }
    /**
     * Add debug method to check current database state
     */
    private function debugCurrentProgress(): void
    {
        try {
            $current = DB::selectOne('SELECT transcoding_status, progress, error_message, updated_at FROM media_metadata WHERE media_id = ?', [$this->media->id]);

            Log::info('=== CURRENT DATABASE STATE ===', [
                'media_id' => $this->media->id,
                'current_status' => $current->transcoding_status ?? 'NULL',
                'current_progress' => $current->progress ?? 'NULL',
                'current_error' => $current->error_message ?? 'NULL',
                'last_updated' => $current->updated_at ?? 'NULL',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to debug current progress', [
                'media_id' => $this->media->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
    /**
     * Fallback update method using Eloquent ORM
     */
    private function fallbackUpdateProgress(string $status, int $progress, ?string $error = null): void
    {
        try {
            Log::info('Attempting fallback progress update', [
                'media_id' => $this->media->id,
                'status' => $status,
                'progress' => $progress,
            ]);

            // Use updateOrCreate as fallback
            $metadata = $this->media->metadata()->updateOrCreate(
                ['media_id' => $this->media->id],
                [
                    'transcoding_status' => $status,
                    'progress' => $progress,
                    'error_message' => $error,
                    'updated_at' => now(),
                ],
            );

            Log::info('Fallback update successful', [
                'media_id' => $this->media->id,
                'metadata_id' => $metadata->id,
                'final_progress' => $metadata->progress,
            ]);
        } catch (\Exception $e) {
            Log::error('Fallback progress update also failed', [
                'media_id' => $this->media->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
    /**
     * Handle job failure
     */
    public function failed(\Throwable $exception): void
    {
        $this->updateProgress('FAILED', 0, $exception->getMessage());

        Log::error('Video transcoding job failed permanently', [
            'media_id' => $this->media->id,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts(),
        ]);

        $this->cleanupTempFiles();
    }

    /**
     * Clean up temporary files
     */
    private function cleanupTempFiles(): void
    {
        try {
            $tmpPath = storage_path("app/tmp/{$this->media->id}/");
            if (File::exists($tmpPath)) {
                File::deleteDirectory($tmpPath);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to cleanup temp files', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Updated ffmpegPath method
     */
    private function ffmpegPath(): string
    {
        return match (config('app.env')) {
            'local' => 'ffmpeg', // Use PATH version since it works
            'staging' => '/home/abajimx/www/devtest/bin/ffmpeg',
            default => '/usr/bin/ffmpeg',
        };
    }
    /**
     * Get the tags that should be assigned to the job.
     */
    public function tags(): array
    {
        return ['video_processing', 'transcoding', 'media:' . $this->media->id, 'hls_job'];
    }
}
