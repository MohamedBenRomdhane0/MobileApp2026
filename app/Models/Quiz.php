<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quiz extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['model_type', 'model_id', 'teacher_id', 'level_material_id', 'status', 'title', 'score', 'is_exam', 'duration', 'attempts', 'pass_mark'];

    protected $casts = [
        'status' => 'integer',
        'score' => 'float',
        'is_exam' => 'boolean',
        'duration' => 'integer',
        'attempts' => 'integer',
        'pass_mark' => 'integer',
    ];
    /**
     * Polymorphic relation to model (could be course, lesson, etc.)
     */
    public function model()
    {
        return $this->morphTo();
    }

    /**
     * Teacher who created the quiz.
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
    /**
     * Level-material association (nullable).
     */
    public function levelMaterial()
    {
        return $this->belongsTo(LevelMaterial::class);
    }
    /**
     * Questions associated with this quiz.
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }
    /**
     * Results associated with this quiz.
     */
    public function results()
    {
        return $this->hasMany(QuizUserResult::class);
    }

    /**
     * Users who have replied to this quiz.
     */
    public function userAnswers()
    {
        return $this->hasManyThrough(UserAnswer::class, Question::class);
    }
}
