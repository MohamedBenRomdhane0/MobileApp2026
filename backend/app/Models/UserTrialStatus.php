<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserTrialStatus extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'user_trial_status';

    protected $fillable = [
        'user_id',
        'total_watched_seconds',
        'trial_exhausted',
        'exhausted_at',
        'is_subscribed',
        'subscribed_at',
    ];

    protected $casts = [
        'total_watched_seconds' => 'integer',
        'trial_exhausted'       => 'boolean',
        'is_subscribed'         => 'boolean',
        'exhausted_at'          => 'datetime',
        'subscribed_at'         => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}