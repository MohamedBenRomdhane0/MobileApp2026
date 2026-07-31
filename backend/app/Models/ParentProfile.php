<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['address', 'guide_progress', 'user_id'];

    protected $casts = [
        'guide_progress' => 'array',
    ];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function children()
    {
        return $this->hasMany(ChildProfile::class, 'parent_id', 'user_id');
    }
}
