<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseChapter extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'order',
        'type', // 1: Video, 2: Document, 3: Quiz
    ];

    protected $casts = [
        'type' => 'integer',
        'order' => 'integer',
    ];

    /**
     * The course that owns the chapter.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * The media (videos, images, pdf, etc.) that belong to this chapter.
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }
    /**
     * The quizzes that belong to this chapter. they are polymorphic
     */
    public function quizzes()
    {
        return $this->morphMany(Quiz::class, 'model');
    }

}
