<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookModule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['book_id', 'title', 'start_page', 'end_page', 'order'];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function icons()
    {
        return $this->hasMany(BookIcon::class);
    }
}
