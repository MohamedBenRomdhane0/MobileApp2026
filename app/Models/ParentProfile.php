<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'address',
        'guide_progress',
        'user_id',
    ];

    protected $casts = [
        'guide_progress' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function children()
    {
        return $this->hasMany(User::class, 'parent_id');
    }
    
}
