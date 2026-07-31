<?php

namespace App\Jobs;

use App\Events\Book\BookUploadFailed;
use App\Models\Book;
use App\Models\BookPage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class IngestBookPdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $tries   = 1;

    public function __construct(
        private int    $bookId,
        private string $pdfDisk,
        private string $pdfPath,
    ) {}

    public function handle(): void
    {
        $book   = Book::findOrFail($this->bookId);
        $tmpDir = storage_path('app/temp');
        $tmpPdf = "{$tmpDir}/book_{$this->bookId}.pdf";

        if (!is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }

        // Download PDF from S3 to shared temp volume (accessible by all queue workers)
        $stream = Storage::disk($this->pdfDisk)->readStream($this->pdfPath);
        if (!$stream) {
            throw new \RuntimeException("Could not open PDF stream from {$this->pdfPath}");
        }
        file_put_contents($tmpPdf, stream_get_contents($stream));
        fclose($stream);

        // Count pages — ground truth, overrides frontend estimate
        $counter = new \Imagick($tmpPdf);
        $total   = $counter->getNumberImages();
        $counter->clear();
        $counter->destroy();

        if ($total === 0) {
            @unlink($tmpPdf);
            throw new \RuntimeException('PDF has 0 pages');
        }

        // Reset book state (idempotent)
        $book->update(['pages_total' => $total, 'pages_rendered' => 0]);
        BookPage::where('book_id', $book->id)->delete();

        // Dispatch one job per page — each runs independently on available workers
        for ($page = 1; $page <= $total; $page++) {
            ProcessBookPageJob::dispatch(
                bookId:     $this->bookId,
                pdfPath:    $tmpPdf,
                pageNumber: $page,
                pagesTotal: $total,
            )->onQueue('video_processing');
        }

        Log::info("IngestBookPdfJob: book {$this->bookId} dispatched {$total} page jobs");
        // Temp file is kept until the last ProcessBookPageJob cleans it up
    }

    public function failed(\Throwable $e): void
    {
        Log::error("IngestBookPdfJob failed for book {$this->bookId}: {$e->getMessage()}");

        // Clean up temp file if it was created before the failure
        $tmpPdf = storage_path("app/temp/book_{$this->bookId}.pdf");
        @unlink($tmpPdf);

        $book = Book::find($this->bookId);
        if ($book) {
            $book->update(['ingest_status' => 'failed']);
            event(new BookUploadFailed(
                userId: (int) $book->user_id,
                bookId: (int) $book->id,
                error:  $e->getMessage(),
            ));
        }
    }
}
