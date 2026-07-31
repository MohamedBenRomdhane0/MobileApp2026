<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscountTemplateKind extends Model
{
    protected $fillable = [
        'discount_template_id',
        'kind',
        'is_default',
        'min_value',
        'max_value',
        'default_value',
    ];

    protected $casts = [
        'is_default'    => 'boolean',
        'min_value'     => 'float',
        'max_value'     => 'float',
        'default_value' => 'float',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(DiscountTemplate::class, 'discount_template_id');
    }
}
