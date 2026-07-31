<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\DiskEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Book\CreateBookPdfMultipartUploadRequest;
use App\Models\Book;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CreateBookPdfMultipartUploadController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(CreateBookPdfMultipartUploadRequest $request, Book $book)
    {
        $user = auth()->user();

        if (!BookAccessService::canStore($user)) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        if ($book->user_id !== auth()->id()) {
            return $this->returnErrorResponse(__('book.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        try {
            $validated = $request->validated();

            $ext = pathinfo($validated['filename'], PATHINFO_EXTENSION);
            $ext = $ext ? strtolower($ext) : 'pdf';

            $key = 'uploads/books/' . $book->id . '/' . Str::uuid() . '.' . $ext;

            $disk = Storage::disk(DiskEnum::S3->value);
            $bucket = config('filesystems.disks.s3.bucket');

            if (!$bucket) {
                return $this->returnErrorResponse('S3 bucket is not configured', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
            }

            $client = null;

            if (method_exists($disk, 'getClient')) {
                $client = $disk->getClient();
            } elseif (method_exists($disk, 'getDriver')) {
                $driver = $disk->getDriver();
                if (is_object($driver) && method_exists($driver, 'getAdapter')) {
                    $adapter = $driver->getAdapter();
                    if (is_object($adapter) && method_exists($adapter, 'getClient')) {
                        $client = $adapter->getClient();
                    }
                }
            }

            if (!$client) {
                return $this->returnErrorResponse('S3 client not available', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
            }

            $result = $client->createMultipartUpload([
                'Bucket' => $bucket,
                'Key' => $key,
                'ACL' => 'public-read',
                'ContentType' => $validated['contentType'],
            ]);

            return $this->returnSuccessResponse('Multipart upload created', [
                'key' => $key,
                'uploadId' => $result['UploadId'] ?? null,
            ], ResponseAlias::HTTP_OK);
        } catch (\Exception $exception) {
            Log::error($exception);
            return $this->returnErrorResponse($exception->getMessage() ?? __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
