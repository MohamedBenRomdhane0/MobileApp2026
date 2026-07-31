<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanAccessibleEntity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'plan_id',
        'material_id',
        'accessible_type',
        'accessible_id',
    ];

    protected $casts = [
        'plan_id' => 'integer',
        'material_id' => 'integer',
        'accessible_id' => 'integer',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function accessible(): MorphTo
    {
        return $this->morphTo();
    }
}
