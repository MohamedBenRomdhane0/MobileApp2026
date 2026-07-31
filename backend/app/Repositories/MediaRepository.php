<?php

namespace App\Repositories;

use App\Enum\DiskEnum;
use App\Enum\MediaReviewStatusEnum;
use App\Enum\MediaTagEnum;
use App\Enum\MediaTypeEnum;
use App\Enum\StatusEnum;
use App\Enum\TranscodeStatusEnum;
use App\Models\Book;
use App\Models\Media;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

class MediaRepository
{
    public static function uploadMedia(object $model, string|UploadedFile $path, string $disk, ?string $folder = 'uploads', ?string $title = null, ?string $description = null, ?string $tag = null): Media
    {
        $folder = trim($folder ?? 'uploads', '/');

        Log::info('Starting media upload', compact('disk', 'folder', 'title', 'description', 'tag'));

        if ($path instanceof UploadedFile) {
            return self::handleUploadedFile($model, $path, $disk, $folder, $title, $description, $tag);
        }

        if (is_string($path)) {
            return self::handleFilePath($model, $path, $disk, $folder, $title, $description, $tag);
        }

        Log::error('Invalid file input', ['type' => gettype($path)]);
        throw new InvalidArgumentException('Invalid path or file for uploadMedia().');
    }

    /**
     * Summary of handleUploadedFile
     * @param object $model
     * @param UploadedFile $file
     * @param string $disk
     * @param string $folder
     * @param mixed $title
     * @param mixed $description
     * @param mixed $tag
     * @param mixed $store
     * @return Media|string
     */
    public static function handleUploadedFile(object $model, UploadedFile $file, string $disk, string $folder, ?string $title, ?string $description, ?string $tag, ?bool $store = true): Media|string
    {
        $storedFile = self::storeUploadedFile($file, $disk, $folder);
        $filePath = self::resolveStoredFilePath($disk, $storedFile['stored_path']);

        if ($store) {
            return self::storeMedia(
                model: $model,
                filePath: $filePath,
                originalName: $file->getClientOriginalName(),
                mimeType: $file->getClientMimeType(),
                size: $file->getSize(),
                title: $title,
                description: $description,
                tag: $tag,
            );
        }

        return $filePath;
    }

    protected static function handleFilePath(object $model, string $filePath, string $disk, string $folder, ?string $title, ?string $description, ?string $tag): Media
    {
        $resolvedPath = realpath($filePath);

        if (!$resolvedPath || !file_exists($resolvedPath)) {
            Log::error('File path does not exist', ['path' => $filePath]);
            throw new InvalidArgumentException("Invalid file path: {$filePath}");
        }

        $file = new File($resolvedPath);
        $extension = pathinfo($file->getFilename(), PATHINFO_EXTENSION) ?: 'mp4';
        $baseName = pathinfo($file->getFilename(), PATHINFO_FILENAME);
        $fileName = Str::uuid() . '_' . $baseName . '.' . $extension;

        $targetPath = "{$folder}/{$fileName}";

        Log::info('Uploading file to S3', ['targetPath' => $targetPath]);

        try {
            $stream = fopen($file->getRealPath(), 'rb');

            if (!$stream) {
                throw new \RuntimeException('Failed to open file stream.');
            }

            $success = Storage::disk($disk)->put($targetPath, $stream, [
                'visibility' => 'public',
                'ACL' => 'public-read',
            ]);

            fclose($stream);

            if (!$success) {
                throw new \RuntimeException('Upload to S3 failed.');
            }

            return self::storeMedia(
                model: $model,
                filePath: self::resolveStoredFilePath($disk, $targetPath),
                originalName: $file->getFilename(),
                mimeType: $file->getMimeType(),
                size: $file->getSize(),
                title: $title,
                description: $description,
                tag: $tag,
            );
        } catch (\Throwable $e) {
            Log::error('Upload exception', ['message' => $e->getMessage()]);
            throw $e;
        }
    }

    protected static function storeMedia(object $model, string $filePath, string $originalName, string $mimeType, int $size, ?string $title, ?string $description, ?string $tag, ?string $thumbnail = null, ?bool $isExternal = false, ?string $mediaType = null, bool $isActive = true): Media
    {
        $resolvedMediaType = $mediaType ?? self::resolveMediaType($mimeType)->value;

        return self::createMediaRecord($model, [
            'file_name' => $originalName,
            'mime_type' => $mimeType,
            'media_type' => $resolvedMediaType,
            'file_path' => $filePath,
            'title' => $title,
            'description' => $description,
            'size' => $size,
            'tag' => $tag,
            'thumbnail' => self::resolveThumbnailValue(
                filePath: $filePath,
                mimeType: $mimeType,
                mediaType: $resolvedMediaType,
                thumbnail: $thumbnail,
            ),
            'is_external' => $isExternal ?? false,
            'is_active' => $isActive,
        ]);
    }

    public static function uploadVideoForModel(object $model, string $videoPath, string $title, ?string $description = null, ?string $tag = null, string $folder = 'videos', string $disk = 's3'): Media
    {
        $media = self::uploadMedia(model: $model, path: $videoPath, disk: $disk, folder: $folder, title: $title, description: $description, tag: $tag);

        $media->metadata()->create([
            'views' => 0,
            'watch_time' => 0,
            'transcoding_status' => TranscodeStatusEnum::PENDING->value,
            'status' => StatusEnum::ACTIVE->value,
        ]);

        return $media;
    }

    public static function deleteMediaFile(string $filePath, string $disk): void
    {
        try {
            $storage = Storage::disk($disk);
            if ($disk === DiskEnum::PUBLIC->value) {
                $pathToDelete = str_replace('storage/', '', $filePath);
                $storage->delete($pathToDelete);
                Log::info('Deleted public media file', ['original_path' => $filePath, 'deleted_path' => $pathToDelete]);
            } else {
                $storage->delete($filePath);
                Log::info('Deleted media file', ['path' => $filePath, 'disk' => $disk]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to delete media file', ['path' => $filePath, 'disk' => $disk, 'error' => $e->getMessage()]);
        }
    }

    public static function deleteMediaByTag(object $model, string $tag): void
    {
        try {
            $mediaItems = $model->media()->where('tag', $tag)->get();

            foreach ($mediaItems as $media) {
                if ($media->file_path) {
                    $disk = str_starts_with($media->file_path, 'http') ? DiskEnum::S3->value : DiskEnum::PUBLIC->value;
                    self::deleteMediaFile($media->file_path, $disk);
                }
                $media->delete();
            }

            Log::info('Deleted media by tag', ['model' => get_class($model), 'tag' => $tag, 'count' => $mediaItems->count()]);
        } catch (\Exception $e) {
            Log::error('Failed to delete media by tag', ['model' => get_class($model), 'tag' => $tag, 'error' => $e->getMessage()]);
        }
    }

    public static function getMediaById(int $id): Media
    {
       return Media::with('metadata')->findOrFail($id);
    }

    public static function updateMedia(Media $media, array $data): Media
    {
        $media->update([
            'title' => $data['title'] ?? $media->title,
            'description' => $data['description'] ?? $media->description,
        ]);

        if (array_key_exists('thumbnail', $data) && $data['thumbnail']) {
            if ($data['thumbnail'] === 'null') {
                $media->thumbnail = null;
            } else {
                $thumb = $data['thumbnail'];

                if ($thumb instanceof UploadedFile) {
                    $thumbnailUrl = MediaRepository::handleUploadedFile(model: new Book(), file: $thumb, disk: \App\Enum\DiskEnum::S3->value, folder: 'thumbnails', title: $data['title'] ?? null, description: $data['description'] ?? null, tag: 'THUMBNAIL', store: false);

                    $media->thumbnail = $thumbnailUrl;
                } elseif (is_string($thumb)) {
                    $media->thumbnail = $thumb;
                }
            }
        }
        $media->save();
        return $media;
    }

    public static function uploadMediaWithType(object $model, UploadedFile $file, string $title, ?string $description, string $tag, string $disk = 's3', bool $isActive = true): Media
    {
        $mimeType = $file->getMimeType() ?: $file->getClientMimeType();
        $mediaType = self::resolveMediaType($mimeType);
        $folder = $mediaType->value . 's';
        $storedFile = self::storeUploadedFile($file, $disk, $folder);
        $filePath = self::resolveStoredFilePath($disk, $storedFile['stored_path']);

        $media = self::storeMedia(
            model: $model,
            filePath: $filePath,
            originalName: $file->getClientOriginalName(),
            mimeType: $mimeType,
            size: $file->getSize(),
            title: $title,
            description: $description,
            tag: $tag,
            isExternal: false,
            mediaType: $mediaType->value,
            isActive: $isActive,
        );

        if ($mediaType === MediaTypeEnum::VIDEO) {
            self::setupVideoTranscoding($media, $storedFile['stored_path'], $disk);
        }

        return $media;
    }

    public static function uploadMediaFromUrl(object $model, string $url, string $title, ?string $description, string $tag, bool $isActive = true): Media
    {
        [$mimeType, $mediaType] = self::resolveExternalUrlMedia($url);
        $fileName = self::resolveExternalFileName($url, $title);

        if (!in_array($mediaType->value, MediaTypeEnum::getValues(), true)) {
            throw new InvalidArgumentException(__('type_not_allowed'));
        }

        return self::createMediaRecord($model, [
            'file_name' => $fileName,
            'mime_type' => $mimeType,
            'media_type' => $mediaType->value,
            'file_path' => $url,
            'size' => 0,
            'title' => $title,
            'description' => $description,
            'tag' => $tag,
            'thumbnail' => self::resolveThumbnailValue(
                filePath: $url,
                mimeType: $mimeType,
                mediaType: $mediaType->value,
            ),
            'is_external' => true,
            'is_active' => $isActive,
        ]);
    }

    protected static function resolveExternalUrlMedia(string $url): array
    {
        $mimeType = self::getMimeTypeFromUrl($url);

        if ($mimeType !== null) {
            return [$mimeType, self::resolveMediaType($mimeType)];
        }

        $isValidUrl = filter_var($url, FILTER_VALIDATE_URL) !== false;

        if ($isValidUrl) {
            return ['text/html', MediaTypeEnum::PDF];
        }

        throw new InvalidArgumentException('Only image, video, audio, pdf, and supported external URLs are allowed.');
    }

    public static function createMediaFromS3Object(object $model, string $storedPath, string $originalName, string $mimeType, int $size, ?string $title, ?string $description, string $tag, bool $isActive = true): Media
    {
        $mediaType = self::resolveMediaType($mimeType);
        $filePath = self::resolveStoredFilePath(DiskEnum::S3->value, $storedPath);

        $media = self::storeMedia(
            model: $model,
            filePath: $filePath,
            originalName: $originalName,
            mimeType: $mimeType,
            size: $size,
            title: $title,
            description: $description,
            tag: $tag,
            isExternal: false,
            mediaType: $mediaType->value,
            isActive: $isActive,
        );

        if ($mediaType === MediaTypeEnum::VIDEO) {
            self::setupVideoTranscoding($media, $storedPath, DiskEnum::S3->value);
        }

        return $media;
    }

    protected static function setupVideoTranscoding(Media $media, string $storedPath, string $disk): void
    {
        $media->metadata()->create([
            'views' => 0,
            'watch_time' => 0,
            'transcoding_status' => TranscodeStatusEnum::PENDING->value,
            'status' => StatusEnum::ACTIVE->value,
            'progress' => 0,
            'processing_started_at' => now(),
        ]);

        $tempDir = storage_path('app/temp');
        $filename = basename($storedPath);
        $tempPath = $tempDir . '/' . $filename;

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        file_put_contents($tempPath, Storage::disk($disk)->get($storedPath));

        \App\Jobs\TranscodeVideoToHLSJob::dispatch($media, $tempPath, $filename, $tempDir, 1)
            ->onQueue('video_processing');
    }

    protected static function getMimeTypeFromUrl(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: '';
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mimeType = $extension ? MediaTypeEnum::getMimeTypeForExtension($extension) : null;

        if ($mimeType !== null) {
            return $mimeType;
        }

        $lowerUrl = strtolower($url);

        if (preg_match('/\.(m3u8|mp4|webm|ogg|mov|avi|mkv)(\?|#|$)/i', $lowerUrl)) {
            return 'video/mp4';
        }

        if (preg_match('/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|#|$)/i', $lowerUrl)) {
            return 'image/jpeg';
        }

        if (preg_match('/\.pdf(\?|#|$)/i', $lowerUrl)) {
            return 'application/pdf';
        }

        if (preg_match('/\.(mp3|wav|ogg|m4a)(\?|#|$)/i', $lowerUrl)) {
            return 'audio/mpeg';
        }

        $host = strtolower(parse_url($url, PHP_URL_HOST) ?: '');

        if ($host !== '') {
            if (
                str_contains($host, 'youtube.com') ||
                str_contains($host, 'youtu.be') ||
                str_contains($host, 'vimeo.com')
            ) {
                return 'video/mp4';
            }

            if (str_contains($host, 'soundcloud.com')) {
                return 'audio/mpeg';
            }
        }

        return null;
    }

    protected static function resolveExternalFileName(string $url, string $title): string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: '';
        $fileName = basename($path);

        if (!empty($fileName) && $fileName !== '/' && $fileName !== '.') {
            return $fileName;
        }

        return Str::slug($title) ?: Str::uuid()->toString();
    }

    protected static function resolveThumbnailValue(string $filePath, string $mimeType, string $mediaType, ?string $thumbnail = null): ?string
    {
        if ($thumbnail !== null) {
            return $thumbnail;
        }

        if ($mediaType === MediaTypeEnum::VIDEO->value || str_starts_with($mimeType, 'video/')) {
            return null;
        }

        return $filePath;
    }

    protected static function storeUploadedFile(UploadedFile $file, string $disk, string $folder): array
    {
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $storedPath = $disk === DiskEnum::S3->value
            ? $file->storePubliclyAs($folder, $fileName, $disk)
            : $file->storeAs($folder, $fileName, $disk);

        Log::info('Uploaded file stored', ['path' => $storedPath]);

        return [
            'file_name' => $fileName,
            'stored_path' => $storedPath,
        ];
    }

    protected static function resolveStoredFilePath(string $disk, string $storedPath): string
    {
        $storage = Storage::disk($disk);

        return $disk === DiskEnum::S3->value
            ? ($storage instanceof FilesystemAdapter ? $storage->url($storedPath) : $storedPath)
            : $storedPath;
    }

    protected static function createMediaRecord(object $model, array $attributes): Media
    {
        return Media::create([
            'model_type' => get_class($model),
            'model_id' => $model->id ?? 0,
            'creator_id' => auth()->id(),
            ...$attributes,
        ]);
    }

    protected static function resolveMediaType(string $mimeType): MediaTypeEnum
    {
        return MediaTypeEnum::fromMimeType($mimeType);
    }

    public static function approveMedia(int $mediaId, ?string $feedback = null): array
    {
        $media = Media::findOrFail($mediaId);

        abort_if($media->tag !== MediaTagEnum::ICON_MEDIA->value, 422, 'Only icon media can go through approbation.');

        $media->update([
            'review_status'   => MediaReviewStatusEnum::APPROVED,
            'review_feedback' => $feedback,
            'reviewed_at'     => now(),
            'reviewed_by'     => auth()->id(),
            'is_active'       => true,
        ]);

        return self::buildReviewResponse($media);
    }

    public static function bulkApproveMedia(array $mediaIds): array
    {
        $now      = now();
        $reviewer = auth()->id();

        Media::whereIn('id', $mediaIds)
            ->where('tag', MediaTagEnum::ICON_MEDIA->value)
            ->update([
                'review_status'   => MediaReviewStatusEnum::APPROVED,
                'review_feedback' => null,
                'reviewed_at'     => $now,
                'reviewed_by'     => $reviewer,
                'is_active'       => true,
            ]);

        return [
            'approved_count' => count($mediaIds),
            'media_ids'      => $mediaIds,
        ];
    }

    public static function rejectMedia(int $mediaId, ?string $feedback = null): array
    {
        $media = Media::findOrFail($mediaId);

        abort_if($media->tag !== MediaTagEnum::ICON_MEDIA->value, 422, 'Only icon media can go through approbation.');

        $media->update([
            'review_status'   => MediaReviewStatusEnum::REJECTED,
            'review_feedback' => $feedback,
            'reviewed_at'     => now(),
            'reviewed_by'     => auth()->id(),
            'is_active'       => false,
        ]);

        return self::buildReviewResponse($media);
    }

    public static function requestChangesOnMedia(int $mediaId, ?string $feedback = null): array
    {
        $media = Media::findOrFail($mediaId);

        abort_if($media->tag !== MediaTagEnum::ICON_MEDIA->value, 422, 'Only icon media can go through approbation.');

        $media->update([
            'review_status'   => MediaReviewStatusEnum::CHANGES_REQUESTED,
            'review_feedback' => $feedback,
            'reviewed_at'     => now(),
            'reviewed_by'     => auth()->id(),
            'is_active'       => false,
        ]);

        return self::buildReviewResponse($media);
    }

    private static function buildReviewResponse(Media $media): array
    {
        return [
            'media_id'        => $media->id,
            'review_status'   => $media->review_status->value,
            'review_feedback' => $media->review_feedback,
            'reviewed_at'     => $media->reviewed_at?->toIso8601String(),
            'reviewed_by'     => $media->reviewed_by,
            'is_active'       => $media->is_active,
        ];
    }
}
