<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Level extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes, HasTranslations;

    protected $fillable = ['name', 'level_type_id'];

    protected $appends = ['name_fr', 'name_ar'];

    public function childProfiles(): HasMany
    {
        return $this->hasMany(ChildProfile::class);
    }

    public function plans(): HasMany
    {
        return $this->hasMany(PlanPricing::class);
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'level_materials')->withPivot('id');
    }

    public function levelType(): BelongsTo
    {
        return $this->belongsTo(LevelType::class);
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'level_sections');
    }

    public function levelSections(): HasMany
    {
        return $this->hasMany(LevelSection::class);
    }

    public function scopeByKeyword($query, $keyword)
    {
        if ($keyword) {
            $query->where('name', 'like', "%{$keyword}%");
        }
        return $query;
    }

    public function scopeByServiceSlug($query, $slug)
    {
        $service = \App\Models\Service::where('slug', $slug)->first();
        if ($service && $service->level_ids !== null) {
            $query->whereIn('id', $service->level_ids);
        }
        return $query;
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
