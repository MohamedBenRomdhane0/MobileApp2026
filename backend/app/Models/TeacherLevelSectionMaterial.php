<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherLevelSectionMaterial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['teacher_id', 'level_section_material_id'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function levelSectionMaterial()
    {
        return $this->belongsTo(LevelSectionMaterial::class, 'level_section_material_id');
    }
}
