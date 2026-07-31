<?php

namespace App\Models;

use App\Enum\ServiceEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'icon',
        'color',
        'level_ids',
        'is_active',
        'order',
    ];

    protected $casts = [
        'level_ids' => 'array',
        'is_active' => 'boolean',
    ];

    public function getEnumAttribute(): ServiceEnum
    {
        return ServiceEnum::from($this->slug);
    }

    /**
     * Whether this service is available for a given level ID.
     * Null level_ids means available for all levels.
     */
    public function isAvailableForLevel(int $levelId): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->level_ids === null) {
            return true;
        }

        return in_array($levelId, $this->level_ids);
    }

    public function levelSettings(): HasMany
    {
        return $this->hasMany(LevelServiceSetting::class);
    }

    public function levelSectionSettings(): HasMany
    {
        return $this->hasMany(LevelSectionServiceSetting::class);
    }

    public function levelSectionMaterialSettings(): HasMany
    {
        return $this->hasMany(LevelSectionMaterialServiceSetting::class);
    }

    public function levelMaterialSettings(): HasMany
    {
        return $this->hasMany(LevelMaterialServiceSetting::class);
    }
}
