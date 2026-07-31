<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaMetadata extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['media_id', 'views', 'watch_time', 'transcoding_status', 'last_seen_at', 'status'];

    protected $casts = [
        'views' => 'integer',
        'watch_time' => 'integer',
        'last_seen_at' => 'datetime',
        'status' => 'integer',
    ];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    /**
     * Relation with media
     */
    public function media()
    {
        return $this->belongsTo(Media::class);
    }
}
