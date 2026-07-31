<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VideoWatchStat extends Model
{
    use SoftDeletes, HasFactory;
    protected $fillable = [
        'video_id',
        'total_seconds_all_users',
        'unique_viewers',
        'avg_completion_pct',
        'last_updated_at',
    ];

    protected $casts = [
        'total_seconds_all_users' => 'integer',
        'unique_viewers'          => 'integer',
        'avg_completion_pct'      => 'float',
        'last_updated_at'         => 'datetime',
    ];

    public function getTotalMinutesAllUsersAttribute(): float
    {
        return round($this->total_seconds_all_users / 60, 1);
    }
}