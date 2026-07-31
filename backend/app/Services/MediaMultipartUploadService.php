<?php

namespace App\Services;

use App\Enum\MediaTypeEnum;
use Illuminate\Support\Str;

class MediaMultipartUploadService extends S3MultipartUploadService
{
    public function createMultipartUpload(string $filename, string $contentType): array
    {
        $key = $this->buildObjectKey($filename, $contentType);

        return parent::createMultipartUpload($key, $contentType);
    }

    protected function buildObjectKey(string $filename, string $contentType): string
    {
        $mediaType = MediaTypeEnum::fromMimeType($contentType);
        $folder = $mediaType->value . 's';
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $safeExtension = $extension ? '.' . strtolower($extension) : '';

        return trim($folder, '/') . '/' . Str::uuid() . $safeExtension;
    }

    public function signUploadPart(string $key, string $uploadId, int $partNumber): array
    {
        return parent::signUploadPart($key, $uploadId, $partNumber);
    }

    public function completeMultipartUpload(string $key, string $uploadId, array $parts): void
    {
        parent::completeMultipartUpload($key, $uploadId, $parts);
    }

    public function abortMultipartUpload(string $key, string $uploadId): void
    {
        parent::abortMultipartUpload($key, $uploadId);
    }
}
