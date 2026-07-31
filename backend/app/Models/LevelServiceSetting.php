<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LevelServiceSetting extends Model
{
    protected $fillable = ['level_id', 'service_id', 'is_enabled'];

    protected $casts = ['is_enabled' => 'boolean'];

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
