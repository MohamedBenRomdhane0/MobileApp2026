<?php

namespace App\Enum;

enum PricingTypeEnum: string
{
    case TOTAL = 'total';
    case PER_MATERIAL = 'per_material';

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
