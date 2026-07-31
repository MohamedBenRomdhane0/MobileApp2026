<?php

namespace App\Models;

use App\Models\Section;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LevelType extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = ['name', 'color'];

    protected $appends = ['name_fr', 'name_ar'];

    public function periods(): HasMany
    {
        return $this->hasMany(LevelTypePeriod::class)->orderBy('order');
    }

    public function levels(): HasMany
    {
        return $this->hasMany(Level::class);
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'level_type_sections');
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
