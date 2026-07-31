<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LevelSectionServiceSetting extends Model
{
    protected $fillable = ['level_section_id', 'service_id', 'is_enabled'];

    protected $casts = ['is_enabled' => 'boolean'];

    public function levelSection(): BelongsTo
    {
        return $this->belongsTo(LevelSection::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
