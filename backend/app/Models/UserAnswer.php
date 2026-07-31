<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['child_id', 'question_id', 'answer_id', 'open_answer', 'is_binary_question', 'is_valid'];

    protected $casts = [
        'is_binary_question' => 'boolean',
        'is_valid' => 'boolean',
    ];

    /**
     * Child (user) who gave the answer.
     */
    public function child()
    {
        return $this->belongsTo(User::class, 'child_id');
    }

    /**
     * The question being answered.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * The selected answer (nullable).
     */
    public function answer()
    {
        return $this->belongsTo(Answer::class);
    }

}
