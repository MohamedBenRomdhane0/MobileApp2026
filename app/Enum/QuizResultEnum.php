<?php

namespace App\Enums;

enum QuizResultEnum: string
{
    case PASSED = 'PASSED';
    case FAILED = 'FAILED';
    case NEEDS_REVIEW = 'NEEDS_REVIEW';
}
