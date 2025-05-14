<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookIcon extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['book_id', 'page', 'x', 'y', 'icon_type'];

    /**
     * Book that owns the icon.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
