<?php
namespace App\Enum;

enum TranscodeStatusEnum: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case TRANSCODED = 'transcoded';
    case FAILED = 'failed';
    case UNKNOWN = 'unknown';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
