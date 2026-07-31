<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherLevelMaterial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['teacher_id', 'level_material_id'];

    /**Relation with teacher */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
    /**Relation with level material */
    public function levelMaterial()
    {
        return $this->belongsTo(LevelMaterial::class, 'level_material_id');
    }
}
