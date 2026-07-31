<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'parent_id', 'level_id', 'gender', 'age'];

    protected $casts = [
        'gender' => 'string',
    ];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
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
    public function media()
    {
        return $this->morphMany(\App\Models\Media::class, 'model');
    }
}
