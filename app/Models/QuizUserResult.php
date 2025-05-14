<?php

namespace App\Models;

use App\Enums\QuizResultEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuizUserResult extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['quiz_id', 'child_id', 'score', 'status'];

    protected $casts = [
        'status' => QuizResultEnum::class,
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function child()
    {
        return $this->belongsTo(User::class, 'child_id');
    }
}
