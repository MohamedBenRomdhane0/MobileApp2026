<?php

namespace App\Enum;

enum DiscountKindEnum: string
{
    case PERCENT = 'percent';
    case FIXED   = 'fixed';
    case FREE    = 'free';

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
