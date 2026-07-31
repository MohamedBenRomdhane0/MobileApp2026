<?php
namespace App\Enum;

enum MediaTypeEnum: string
{
    case VIDEO = 'video';
    case IMAGE = 'image';
    case AUDIO = 'audio';
    case PDF = 'pdf';

    public const MIME_TYPES_BY_EXTENSION = [
        'm3u8' => 'application/x-mpegURL',
        'mp4' => 'video/mp4',
        'mov' => 'video/quicktime',
        'avi' => 'video/x-msvideo',
        'mkv' => 'video/x-matroska',
        'webm' => 'video/webm',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'mp3' => 'audio/mpeg',
        'wav' => 'audio/wav',
        'm4a' => 'audio/mp4',
        'pdf' => 'application/pdf',
    ];

    public const UPLOADED_FILE_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'audio/mpeg',
        'audio/wav',
        'audio/mp4',
        'audio/x-m4a',
        'application/pdf',
    ];

    public static function fromMimeType(string $mimeType): self
    {
        if (str_starts_with($mimeType, 'video/')) {
            return self::VIDEO;
        }
        if (str_starts_with($mimeType, 'image/')) {
            return self::IMAGE;
        }
        if (str_starts_with($mimeType, 'audio/')) {
            return self::AUDIO;
        }
        if ($mimeType === 'application/pdf') {
            return self::PDF;
        }
        throw new \InvalidArgumentException("Unsupported media mime type [{$mimeType}].");
    }

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function getUploadedFileMimeTypes(): array
    {
        return self::UPLOADED_FILE_MIME_TYPES;
    }

    public static function getMimeTypeForExtension(string $extension): ?string
    {
        return self::MIME_TYPES_BY_EXTENSION[strtolower($extension)] ?? null;
    }

    public function getDefaultIcon(): string
    {
        return match($this) {
            self::VIDEO => 'video',
            self::IMAGE => 'image',
            self::AUDIO => 'audio',
            self::PDF => 'pdf',
        };
    }
}
