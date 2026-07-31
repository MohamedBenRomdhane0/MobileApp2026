<?php

namespace App\Enum;
enum DiskEnum: string
{
    case LOCAL = 'local';
    case PUBLIC = 'public';
    case S3 = 's3';

    /**
     * Get all disk values.
     *
     * @return array
     */
    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
