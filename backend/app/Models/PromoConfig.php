<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoConfig extends Model
{
    protected $fillable = [
        'promo_system_enabled',
        'require_admin_approval',
        'allow_teachers_to_create',
        'available_discount_kinds',
        'max_discount_percent',
        'max_discount_fixed',
        'max_free_sessions',
        'min_discount_percent',
        'min_discount_fixed',
    ];

    protected $attributes = [
        'available_discount_kinds' => '["percent","fixed","free"]',
    ];

    protected $casts = [
        'promo_system_enabled'      => 'boolean',
        'require_admin_approval'    => 'boolean',
        'allow_teachers_to_create'  => 'boolean',
        'available_discount_kinds'  => 'array',
        'max_discount_percent'      => 'float',
        'max_discount_fixed'        => 'float',
        'max_free_sessions'         => 'integer',
        'min_discount_percent'      => 'float',
        'min_discount_fixed'        => 'float',
    ];
}
