<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LevelSectionMaterial extends Model
{
    use HasFactory;

    protected $fillable = ['level_section_id', 'material_id', 'sharing_group'];

    public function levelSection()
    {
        return $this->belongsTo(LevelSection::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function teacherLevelSectionMaterials()
    {
        return $this->hasMany(TeacherLevelSectionMaterial::class);
    }
}
