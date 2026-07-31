<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanMaterialPricing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'plan_pricing_id',
        'material_id',
        'price',
        'discount',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
    ];

    public function planPricing(): BelongsTo
    {
        return $this->belongsTo(PlanPricing::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
