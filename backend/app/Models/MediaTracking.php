<?php

namespace App\Models;

use App\Enum\MediaTrackingStatus;
use App\Enum\MediaTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaTracking extends Model
{
    use HasFactory;

    protected $table = 'media_trackings';

    protected $fillable = [
        'media_id',
        'user_id',
        'media_type',
        'status',
        'progress_percent',
        'watched_seconds',
        'last_position',
        'read_percent',
        'total_time_spent',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'media_type'     => MediaTypeEnum::class,
        'status'         => MediaTrackingStatus::class,
        'started_at'     => 'datetime',
        'completed_at'   => 'datetime',
        'watched_seconds'=> 'integer',
        'progress_percent' => 'integer',
        'total_time_spent' => 'integer',
        'last_position'  => 'integer',
        'read_percent'   => 'integer',
    ];

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByCompleted($query)
    {
        return $query->where('status', MediaTrackingStatus::COMPLETED);
    }

    public function scopeByType($query, MediaTypeEnum $type)
    {
        return $query->where('media_type', $type);
    }
}
