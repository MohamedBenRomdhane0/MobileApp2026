<?php

namespace App\Enum;

enum ServiceEnum: string
{
    case BOOKS          = 'books';           // Manuels Scolaires
    case EXTRA_COURSES  = 'extra_courses';   // Extra courses
    case LIVE_MEETINGS  = 'live_meetings';   // Live meetings
    case QUIZZES        = 'quizzes';         // Quizzes & assessments
    case EXERCISES      = 'exercises';       // Exercises
    case CONCOURS       = 'concours';        // Exam prep (configurable per level)
    case TEACHER_BOOKS  = 'teacher_books';   // Teacher-authored books

    public function label(): string
    {
        return match($this) {
            self::BOOKS         => 'Manuels Scolaires',
            self::EXTRA_COURSES => 'Extra Courses',
            self::LIVE_MEETINGS => 'Live Meetings',
            self::QUIZZES       => 'Quizzes',
            self::EXERCISES     => 'Exercises',
            self::CONCOURS      => 'Concours',
            self::TEACHER_BOOKS => 'Teacher Books',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::BOOKS         => 'book-open',
            self::EXTRA_COURSES => 'video',
            self::LIVE_MEETINGS => 'radio',
            self::QUIZZES       => 'clock',
            self::EXERCISES     => 'target',
            self::CONCOURS      => 'award',
            self::TEACHER_BOOKS => 'book',
        };
    }

    public function order(): int
    {
        return match($this) {
            self::BOOKS         => 1,
            self::EXTRA_COURSES => 2,
            self::LIVE_MEETINGS => 3,
            self::QUIZZES       => 4,
            self::EXERCISES     => 5,
            self::CONCOURS      => 6,
            self::TEACHER_BOOKS => 7,
        };
    }
}
