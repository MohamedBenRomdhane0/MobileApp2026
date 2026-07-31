<?php

namespace App\Models;

use App\Enum\DraftInteractionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DraftUser extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'token',
        'level_id',
        'interactions',
        'ip_address',
        'expires_at',
    ];

    protected $casts = [
        'interactions' => 'array',
        'expires_at'   => 'datetime',
    ];

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function hasUsedInteraction(string $type): bool
    {
        $interactions = $this->interactions ?? [];
        return ($interactions[$type] ?? 0) >= 1;
    }

    public function recordInteraction(string $type): void
    {
        $interactions = $this->interactions ?? [];
        $interactions[$type] = ($interactions[$type] ?? 0) + 1;
        $this->interactions = $interactions;
        $this->save();
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Sliding expiration: extend expires_at on genuine activity so an actively
     * browsing draft user never approaches the 30-day boundary. Throttled to
     * avoid a write on every single request — only touches once the current
     * expiry has drifted more than a day away from the target.
     */
    public function touchExpiry(): void
    {
        $target = now()->addDays(30);

        if ($this->expires_at->lt(now()->addDays(29))) {
            $this->update(['expires_at' => $target]);
        }
    }
}
