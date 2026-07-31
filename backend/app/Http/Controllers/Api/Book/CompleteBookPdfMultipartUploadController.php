<?php

namespace App\Http\Controllers\Api\Book;

use App\Enum\DiskEnum;
use App\Enum\MediaTagEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Book\CompleteBookPdfMultipartUploadRequest;
use App\Models\Book;
use App\Services\BookAccessService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CompleteBookPdfMultipartUploadController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(CompleteBookPdfMultipartUploadRequest $request, Book $book)
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

            $parts = $validated['parts'];
            usort($parts, fn ($a, $b) => ((int) $a['PartNumber']) <=> ((int) $b['PartNumber']));

            $client->completeMultipartUpload([
                'Bucket' => $bucket,
                'Key' => $validated['key'],
                'UploadId' => $validated['uploadId'],
                'MultipartUpload' => [
                    'Parts' => $parts,
                ],
            ]);

            $fileUrl = $disk->url($validated['key']);

            DB::transaction(function () use ($book, $fileUrl, $validated) {
                $media = $book->media()->create([
                    'file_name' => basename($validated['key']),
                    'mime_type' => $validated['contentType'],
                    'file_path' => $fileUrl,
                    'title' => null,
                    'description' => null,
                    'size' => (int) $validated['size'],
                    'tag' => MediaTagEnum::BOOK_PDF->value,
                ]);

                $media->creator_id = auth()->id();
                $media->save();
            });

            $book->update(['ingest_status' => 'processing']);

            \App\Jobs\IngestBookPdfJob::dispatch(
                $book->id,
                DiskEnum::S3->value,
                $validated['key'],
            )->onQueue('video_processing');

            return $this->returnSuccessResponse('Upload completed', $book->fresh(['media']), ResponseAlias::HTTP_OK);
        } catch (\Exception $exception) {
            Log::error($exception);
            return $this->returnErrorResponse($exception->getMessage() ?? __('messages.general_error'), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
