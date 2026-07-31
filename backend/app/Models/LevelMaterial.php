<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LevelMaterial extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes;
    protected $fillable = ['level_id', 'material_id'];
    protected $casts = [
        'level_id' => 'integer',
        'material_id' => 'integer',
    ];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    /**
     * Relation with level
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
    /**
     * Relation with material
     */
    public function material()
    {
        return $this->belongsTo(Material::class);
    }
    /**
     * Relation with books
     */
    public function books()
    {
        return $this->hasMany(Book::class);
    }
    /**
     * Relation with teacher level material
     */
    public function teacherLevelMaterials()
    {
        return $this->hasMany(TeacherLevelMaterial::class);
    }

    public function scopeByLevelId($query, $levelId)
    {
        if ($levelId) {
            return $query->where('level_id', $levelId);
        }
        return $query;
    }

}
