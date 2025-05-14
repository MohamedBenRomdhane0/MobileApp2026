<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'parent_id', 'level_id', 'sexe'];

    protected $casts = [
        'sexe' => 'integer',
    ];

    /**Relation with user */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    /**Relation with parent */
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }
    /**Relation with level */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}
