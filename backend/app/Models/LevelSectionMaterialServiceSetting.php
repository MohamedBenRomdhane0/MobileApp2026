<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LevelSectionMaterialServiceSetting extends Model
{
    protected $fillable = ['level_section_material_id', 'service_id', 'is_enabled'];

    protected $casts = ['is_enabled' => 'boolean'];

    public function levelSectionMaterial(): BelongsTo
    {
        return $this->belongsTo(LevelSectionMaterial::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
