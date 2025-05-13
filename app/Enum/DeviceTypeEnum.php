<?php
namespace App\Enum;

enum DeviceTypeEnum: string
{
    case ANDROID = 'android';
    case IOS = 'ios';
    case WEB = 'web';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
