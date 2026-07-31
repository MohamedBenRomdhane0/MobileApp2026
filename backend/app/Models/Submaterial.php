<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submaterial extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'level_material_id'];

    /**
     * Relation with level material
     */
    public function levelMaterial()
    {
        return $this->belongsTo(LevelMaterial::class);
    }
}
