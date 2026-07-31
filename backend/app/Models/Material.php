<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Material extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes, HasTranslations;

    protected $fillable = ['name', 'color'];

    protected $appends = ['name_fr', 'name_ar'];

    public function levels(): BelongsToMany
    {
        return $this->belongsToMany(Level::class, 'level_materials');
    }

    public function levelSections(): BelongsToMany
    {
        return $this->belongsToMany(LevelSection::class, 'level_section_materials');
    }

    protected function nameFr(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getTranslation('name', 'fr')
        );
    }

    protected function nameAr(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getTranslation('name', 'ar')
        );
    }
}
