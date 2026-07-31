<?php

namespace App\Services;

use Aws\S3\S3Client;

class S3MultipartUploadService
{
    protected S3Client $client;

    protected string $bucket;

    public function __construct()
    {
        $config = config('filesystems.disks.s3');

        $this->bucket = (string) ($config['bucket'] ?? '');
        $this->client = new S3Client([
            'version' => 'latest',
            'region' => $config['region'] ?? env('AWS_DEFAULT_REGION', 'de'),
            'credentials' => [
                'key' => $config['key'] ?? env('AWS_ACCESS_KEY_ID'),
                'secret' => $config['secret'] ?? env('AWS_SECRET_ACCESS_KEY'),
            ],
            'endpoint' => $config['endpoint'] ?? env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => (bool) ($config['use_path_style_endpoint'] ?? env('AWS_PATH_STYLE', true)),
        ]);
    }

    public function createMultipartUpload(string $key, string $contentType): array
    {
        $result = $this->client->createMultipartUpload([
            'Bucket' => $this->bucket,
            'Key' => $key,
            'ContentType' => $contentType,
            'ACL' => 'public-read',
        ]);

        return [
            'key' => $key,
            'uploadId' => (string) $result['UploadId'],
        ];
    }

    public function signUploadPart(string $key, string $uploadId, int $partNumber): array
    {
        $command = $this->client->getCommand('UploadPart', [
            'Bucket' => $this->bucket,
            'Key' => $key,
            'UploadId' => $uploadId,
            'PartNumber' => $partNumber,
        ]);

        $request = $this->client->createPresignedRequest($command, '+60 minutes');

        return [
            'url' => (string) $request->getUri(),
            'headers' => [],
        ];
    }

    public function completeMultipartUpload(string $key, string $uploadId, array $parts): void
    {
        $this->client->completeMultipartUpload([
            'Bucket' => $this->bucket,
            'Key' => $key,
            'UploadId' => $uploadId,
            'MultipartUpload' => [
                'Parts' => array_map(fn (array $part) => [
                    'PartNumber' => (int) $part['PartNumber'],
                    'ETag' => (string) $part['ETag'],
                ], $parts),
            ],
        ]);
    }

    public function abortMultipartUpload(string $key, string $uploadId): void
    {
        $this->client->abortMultipartUpload([
            'Bucket' => $this->bucket,
            'Key' => $key,
            'UploadId' => $uploadId,
        ]);
    }
}
