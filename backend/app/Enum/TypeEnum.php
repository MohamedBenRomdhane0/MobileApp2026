<?php

namespace App\Enum;

enum TypeEnum: int
{
    case MANUAL = 1;
    case CONCOURSE = 2;

    public static function getValues() : array
    {
        return array_column(self::cases(), 'value');
    }
}


