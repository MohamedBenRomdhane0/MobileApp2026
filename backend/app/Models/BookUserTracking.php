<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookUserTracking extends Model
{
    protected $table = 'book_user_trackings';

    protected $fillable = [
        'book_id',
        'user_id',
        'last_page',
        'started_at',
        'last_accessed_at',
    ];

    protected $casts = [
        'last_page'        => 'integer',
        'started_at'       => 'datetime',
        'last_accessed_at' => 'datetime',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
