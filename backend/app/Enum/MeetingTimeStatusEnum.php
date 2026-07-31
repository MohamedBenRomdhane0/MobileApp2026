<?php

namespace App\Enum;

enum MeetingTimeStatusEnum: string
{
    case ACTIVE = 'active';
    case CANCELED = 'canceled';
    case RESCHEDULED = 'rescheduled';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
