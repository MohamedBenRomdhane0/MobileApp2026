<?php

namespace App\Jobs;

use App\Enum\MediaTagEnum;
use App\Events\Book\BookPageRendered;
use App\Events\Book\BookUploadCompleted;
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

class ProcessBookPageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;
    public int $tries   = 3;
    public int $backoff = 30;

    public function __construct(
        private int    $bookId,
        private string $pdfPath,
        private int    $pageNumber,
        private int    $pagesTotal,
    ) {}

    public function handle(): void
    {
        $book = Book::findOrFail($this->bookId);

        if (!file_exists($this->pdfPath)) {
            throw new \RuntimeException("Shared PDF not found at {$this->pdfPath}");
        }

        $idx   = $this->pageNumber - 1;
        $sizes = ['thumb' => 220, 'md' => 800, 'lg' => 1600];
        $paths = [];
        $dims  = null;

        foreach ($sizes as $key => $width) {
            $im = new \Imagick();
            $im->setResolution(150, 150);
            $im->readImage("{$this->pdfPath}[{$idx}]");
            $im->setImageFormat('webp');
            $im->setImageCompressionQuality(80);
            $im->resizeImage($width, 0, \Imagick::FILTER_LANCZOS, 1);

            if ($dims === null) {
                $dims = [$im->getImageWidth(), $im->getImageHeight()];
            }

            $bin = $im->getImageBlob();
            $im->clear();
            $im->destroy();

            $keyPath = sprintf('uploads/books/%d/pages/p%04d_%s.webp', $this->bookId, $this->pageNumber, $key);
            Storage::disk('s3')->put($keyPath, $bin, ['visibility' => 'public']);
            $paths[$key] = $keyPath;
        }

        [$w, $h] = $dims;

        BookPage::updateOrCreate(
            ['book_id' => $this->bookId, 'page_number' => $this->pageNumber],
            [
                'disk'       => 's3',
                'path_thumb' => $paths['thumb'],
                'path_md'    => $paths['md'],
                'path_lg'    => $paths['lg'],
                'width'      => $w,
                'height'     => $h,
                'mime_type'  => 'image/webp',
            ],
        );

        if ($this->pageNumber === 1) {
            $s3Url = rtrim(config('filesystems.disks.s3.url'), '/');
            $book->media()->where('tag', MediaTagEnum::BOOK_COVER->value)->delete();
            $book->media()->create([
                'file_name' => 'cover.webp',
                'mime_type' => 'image/webp',
                'file_path' => $s3Url . '/' . ltrim($paths['md'], '/'),
                'title'     => 'Book Cover',
                'tag'       => MediaTagEnum::BOOK_COVER->value,
            ]);
        }

        Book::where('id', $this->bookId)->increment('pages_rendered');

        $pagesRendered = (int) Book::find($this->bookId)->pages_rendered;
        $progress      = (int) round(($pagesRendered / $this->pagesTotal) * 100);

        event(new BookPageRendered(
            userId:        (int) $book->user_id,
            bookId:        $this->bookId,
            pagesRendered: $pagesRendered,
            pagesTotal:    $this->pagesTotal,
            progress:      $progress,
            pageNumber:    $this->pageNumber,
        ));

        Log::info("ProcessBookPageJob: book {$this->bookId} page {$this->pageNumber}/{$this->pagesTotal}");

        // Only the job that atomically transitions the book from 'processing' → 'ready' fires completion.
        // The WHERE clause acts as a lock so this runs exactly once even if two jobs finish simultaneously.
        $booked = Book::where('id', $this->bookId)
            ->where('ingest_status', 'processing')
            ->where('pages_rendered', '>=', $this->pagesTotal)
            ->update(['ingest_status' => 'ready']);

        if ($booked) {
            event(new BookUploadCompleted(
                userId: (int) $book->user_id,
                bookId: $this->bookId,
            ));
            @unlink($this->pdfPath);
            Log::info("ProcessBookPageJob: book {$this->bookId} completed ({$this->pagesTotal} pages)");
        }
    }

    public function failed(\Throwable $e): void
    {
        Log::error("ProcessBookPageJob failed for book {$this->bookId} page {$this->pageNumber}: {$e->getMessage()}");

        $book = Book::find($this->bookId);
        if (!$book) {
            return;
        }

        // Only mark as failed if still processing (another page may have already completed the book)
        $marked = Book::where('id', $this->bookId)
            ->where('ingest_status', 'processing')
            ->update(['ingest_status' => 'failed']);

        if ($marked) {
            event(new BookUploadFailed(
                userId: (int) $book->user_id,
                bookId: $this->bookId,
                error:  $e->getMessage(),
            ));
            @unlink($this->pdfPath);
        }
    }
}
