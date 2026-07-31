<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiscountTemplate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'color',
        'behavior',
        'behavior_config',
        'enabled',
        'sort_order',
    ];

    protected $casts = [
        'behavior_config' => 'array',
        'enabled'         => 'boolean',
        'sort_order'      => 'integer',
    ];

    public function kinds(): HasMany
    {
        return $this->hasMany(DiscountTemplateKind::class, 'discount_template_id');
    }

    public function defaultKind(): ?DiscountTemplateKind
    {
        return $this->kinds()->where('is_default', true)->first();
    }
}
