<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LevelMaterialServiceSetting extends Model
{
    protected $fillable = ['level_material_id', 'service_id', 'is_enabled'];

    protected $casts = ['is_enabled' => 'boolean'];

    public function levelMaterial(): BelongsTo
    {
        return $this->belongsTo(LevelMaterial::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
