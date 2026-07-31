<?php

namespace App\Enum;

enum BlockedSlotReasonEnum: string
{
    case UNAVAILABLE       = 'unavailable';
    case PERSONAL          = 'personal';
    case LESSON_PREP       = 'lesson_prep';
    case REST              = 'rest';
    case OTHER             = 'other';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
