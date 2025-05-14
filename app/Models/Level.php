<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Level extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name'];

    /**!SECTION!
     * Relations
     */

    /**
     * The children that belong to the level.
     */
    
    public function childProfiles()
    {
        return $this->hasMany(ChildProfile::class);
    }
    /**
     * The packs that belong to the level.
     */
    public function packs()
    {
        return $this->hasMany(PackLevel::class);
    }
    /**
     * Level materials that belong to the level.
     */
    public function levelMaterials()
    {
        return $this->hasMany(LevelMaterial::class);
    }
}
