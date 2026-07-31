<?php

namespace App\Enum;

enum QuizResultEnum: string
{
    case PASSED = 'PASSED';
    case FAILED = 'FAILED';
    case NEEDS_REVIEW = 'NEEDS_REVIEW';
    
    public static function getValues(): array
        {
            return array_column(self::cases(), 'value');
        }
}

