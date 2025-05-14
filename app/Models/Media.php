<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['model_type', 'model_id', 'file_name', 'mime_type', 'file_path', 'title', 'description', 'size'];

    protected $casts = [
        'size' => 'integer',
    ];

    public function model()
    {
        return $this->morphTo();
    }

    public function metadata()
    {
        return $this->hasOne(MediaMetadata::class);
    }
    /** 
     * The likes that belong to the media.
     * This is a polymorphic relation.
     * It allows us to like any model that uses this trait.
     */
    public function likes()
    {
        return $this->morphMany(MediaLike::class, 'likeable');
    }
}
