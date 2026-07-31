<?php

namespace App\Enum;

enum DiscountBehaviorEnum: string
{
    case NUMERIC_WITH_UNIT = 'numeric_with_unit';
    case SINGLE_NUMBER     = 'single_number';
    case DATE_RANGE        = 'date_range';
    case NONE              = 'none';

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
