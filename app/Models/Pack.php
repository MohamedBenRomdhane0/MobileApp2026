<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pack extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
    ];

    /**
     * The levels that belong to the pack.
     */
    public function packLevels()
    {
        return $this->hasMany(PackLevel::class);
    }
    
}
