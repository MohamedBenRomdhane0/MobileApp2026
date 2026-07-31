<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VideoSession extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'video_id',
        'watch_segments',
        'total_seconds',
        'last_position_sec',
        'last_synced_at',
    ];

    protected $casts = [
        'watch_segments'    => 'array',
        'total_seconds'     => 'integer',
        'last_position_sec' => 'float',
        'last_synced_at'    => 'datetime',
    ];

    protected $attributes = [
        'watch_segments' => '[]',
        'total_seconds'  => 0,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getTotalMinutesAttribute(): float
    {
        return round($this->total_seconds / 60, 1);
    }
}