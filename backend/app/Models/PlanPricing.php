<?php

namespace App\Models;

use App\Enum\StatusEnum;
use App\Enum\PricingTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanPricing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'plan_id',
        'price',
        'months',
        'discount',
        'status',
        'is_highlighted',
        'pricing_type',
    ];

    protected $casts = [
        'price'        => 'decimal:2',
        'months'       => 'integer',
        'is_highlighted' => 'boolean',
        'status' => StatusEnum::class,
        'pricing_type' => PricingTypeEnum::class,
    ];

    /**
     * The plan that owns the level.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Material pricing details for per-material pricing
     */
    public function materialPricings(): HasMany
    {
        return $this->hasMany(PlanMaterialPricing::class);
    }
}
