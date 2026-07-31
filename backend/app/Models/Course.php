<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OpenApi\Annotations as OA;
use Illuminate\Database\Eloquent\Builder;


/**
 * @OA\Schema(
 *     schema="Course",
 *     type="object",
 *     title="Course",
 *     required={"user_id", "level_material_id", "title", "type"},
 *     @OA\Property(property="id", type="integer", readOnly=true, example=1),
 *     @OA\Property(property="user_id", type="integer", example=2),
 *     @OA\Property(property="level_material_id", type="integer", example=3),
 *     @OA\Property(property="title", type="string", example="Introduction to Algebra"),
 *     @OA\Property(property="description", type="string", example="A basic algebra course."),
 *     @OA\Property(property="status", type="string", enum={"draft", "published", "archived", "refused"}, example="published"),
 *     @OA\Property(property="type", type="integer", description="1: Manual, 2: Concours, 3: Personalized", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time", readOnly=true, example="2024-06-01T12:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", readOnly=true, example="2024-06-01T12:00:00Z"),
 *     @OA\Property(property="deleted_at", type="string", format="date-time", nullable=true, example=null)
 * )
 */

class Course extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes;

    protected $fillable = [
        'user_id',
        'level_id',
        'material_id',
        'title',
        'description',
        'status',
    ];

    protected $casts = [
        'type' => 'integer',
    ];

    /**
     * The user that owns the course.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The level this course belongs to.
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    /**
     * The chapters that belong to this course.
     */
    public function chapters()
    {
        return $this->hasMany(CourseChapter::class);
    }

    /**
     * Polymorphic relation for media (videos, images, etc.).
     */
    public function media()
    {
        return $this->morphOne(Media::class, 'model');
    }

    /**
     * Plan accessible entities where this course is accessible
     */
    public function planAccessibleEntities()
    {
        return $this->morphMany(PlanAccessibleEntity::class, 'accessible');
    }

    /**
     * Scope to filter courses by keyword.
     */
    public function scopeByKeyword($query, $keyword)
    {
        if(!empty($keyword)){
            return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
              ->orWhere('description', 'like', "%{$keyword}%");
        });
        }
        return null;
    }
    /**
     * Scope to filter courses by level.
     */
    public function scopeByLevelId($query, $levelId)
    {   
        if (! is_null($levelId)) {
            $query->where('level_id', $levelId);
        }       
    }
    /**
     * Scope to filter courses by material.
     */
     public function scopeByMaterialId(Builder $query, $materialId){
        if (! is_null($materialId)) {
            $query->where('material_id', $materialId);
        }
     }
}
