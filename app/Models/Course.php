<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'level_material_id',
        'title',
        'description',
        'type', // 1: Manual, 2: Concours, 3: Personalized
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
     * The level material this course belongs to.
     */
    public function levelMaterial()
    {
        return $this->belongsTo(LevelMaterial::class);
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
        return $this->morphMany(Media::class, 'model');
    }
}
