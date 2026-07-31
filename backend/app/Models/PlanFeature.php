<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="PlanFeature",
 *     title="Plan Feature",
 *     type="object",
 *     required={"id", "is_available"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="is_available", type="boolean", example=true),
 *     @OA\Property(
 *         property="translations",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             @OA\Property(property="locale", type="string", example="en"),
 *             @OA\Property(property="text", type="string", example="Unlimited storage")
 *         )
 *     )
 * )
 */

class PlanFeature extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes;

    protected $fillable = ['is_available'];

    protected $hidden = ['pivot'];

    /**
     * The plans that belong to the feature.
     */
    public function plans()
    {
        return $this->belongsToMany(Plan::class, 'plan_plan_features')->withTimestamps();
    }

    public function translations()
    {
        return $this->morphMany(Translation::class, 'model');
    }

    public function scopeByKeyword($query, $keyword)
    {
        return $query->whereHas('translations', function ($q) use ($keyword) {
            $q->where('text', 'like', '%' . $keyword . '%');
        });
    }
}
