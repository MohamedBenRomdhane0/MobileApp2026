<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class BookPage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'book_id', 'page_number', 'disk',
        'path_thumb', 'path_md', 'path_lg',
        'width', 'height', 'mime_type', 'size_bytes', 'checksum', 'meta',
    ];

    protected $casts = [
        'width' => 'int',
        'height' => 'int',
        'size_bytes' => 'int',
        'meta' => 'array',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class); // 
    }

    public function url(string $size = 'md'): ?string
    {
        $path = match ($size) {
            'thumb' => $this->path_thumb,
            'lg'    => $this->path_lg,
            default => $this->path_md,
        };

        return $path ? Storage::disk($this->disk)->url($path) : null;
    }
}
