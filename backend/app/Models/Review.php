<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'child_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'teacher_id' => 'integer',
        'child_id' => 'integer',
        'rating' => 'integer',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function child()
    {
        return $this->belongsTo(User::class, 'child_id');
    }
}
