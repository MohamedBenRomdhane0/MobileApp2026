<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Plan extends Model
{
    use HasFactory;
    use ApplyQueryScopes, SoftDeletes;

    protected $fillable = ['is_popular', 'plan_type', 'level_id', 'creator_id', 'has_meeting'];

    protected $casts = [
        'is_popular' => 'boolean',
        'plan_type' => 'string',
        'has_meeting' => 'boolean',
    ];

    public function planPricings()
    {
        return $this->hasMany(PlanPricing::class);
    }

    public function translations()
    {
        return $this->morphMany(Translation::class, 'model');
    }

    public function features()
    {
        return $this->belongsToMany(PlanFeature::class, 'plan_plan_features')->withTimestamps();
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function accessibleEntities()
    {
        return $this->hasMany(PlanAccessibleEntity::class);
    }

    public function scopeByFeature($query, $featureId)
    {
        return $query->whereHas('features', fn($q) => $q->where('plan_features.id', $featureId));
    }

    public function scopeByKeyword($query, $keyword)
    {
        return $query->whereHas('translations', function ($q) use ($keyword) {
            $q->where('text', 'like', '%' . $keyword . '%');
        });
    }

    public function scopeByLevelId($query, $levelId)
    {
        return $query->where('level_id', $levelId);
    }

    public function scopeByPlanType($query, $planType)
    {
        return $query->where('plan_type', $planType);
    }
}
