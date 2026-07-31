<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes;

    protected $fillable = ['name'];

    public function levels(): BelongsToMany
    {
        return $this->belongsToMany(Level::class, 'level_sections');
    }

    public function levelSections(): HasMany
    {
        return $this->hasMany(LevelSection::class);
    }

    public function scopeByKeyword($query, $keyword)
    {
        if ($keyword) {
            $query->where('name', 'like', '%' . $keyword . '%');
        }
        return $query;
    }
}
