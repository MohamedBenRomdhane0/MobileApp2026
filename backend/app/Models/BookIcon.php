<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @OA\Schema(
 *     schema="BookIcon",
 *     title="BookIcon",
 *     description="BookIcon model",
 *     @OA\Property(property="id", type="string", example=1),
 *     @OA\Property(property="book_id", type="integer", example=1),
 *     @OA\Property(property="page", type="integer", example=1),
 *     @OA\Property(property="x", type="integer", example=100),
 *     @OA\Property(property="y", type="integer", example=200),
 *     @OA\Property(property="icon_type", type="string", example="bookmark"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
 *     @OA\Property(property="deleted_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
 * )
 *
 */
class BookIcon extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['book_id', 'book_module_id', 'page', 'x', 'y', 'icon_type', 'size', 'title'];

    /**
     * Book that owns the icon.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the media associated with the icon.
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }
}
