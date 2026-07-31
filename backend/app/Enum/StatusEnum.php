<?php

namespace App\Enum;

enum StatusEnum: string
{
    case INACTIVE = '0';
    case ACTIVE = '1';

    public static function getValues() : array
    {
        return array_column(self::cases(), 'value');
    }
}


