<?php

namespace App\Enum;

enum UserStatusEnum: int
{
    case INACTIVE = 0;
    case ACTIVE = 1;
    case PENDING = 2;
    case SUSPENDED = 3;

    public static function getValues() : array
    {
        return array_column(self::cases(), 'value');
    }
}


