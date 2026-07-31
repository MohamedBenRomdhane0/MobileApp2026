<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LevelSection extends Model
{
    protected $table = 'level_sections';

    protected $fillable = ['level_id', 'section_id'];

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'level_section_materials');
    }

    public function levelSectionMaterials(): HasMany
    {
        return $this->hasMany(LevelSectionMaterial::class);
    }
}
