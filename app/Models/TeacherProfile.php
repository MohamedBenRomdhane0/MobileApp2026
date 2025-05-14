<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'bio', 'about', 'education', 'experience', 'is_valid', 'is_valid_financial', 'user_id'
    ];
    
    protected $casts = [
        'is_valid' => 'boolean',
        'is_valid_financial' => 'boolean'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
