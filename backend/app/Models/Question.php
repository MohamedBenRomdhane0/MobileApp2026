<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'quiz_id',
        'question',
        'is_valid',
        'type',
    ];

    /**!SECTION
     * Relations
     */
    /**
     * The quiz that belongs to the question.
     */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
    /**
     * The answers that belong to the question.
     */
    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

}
