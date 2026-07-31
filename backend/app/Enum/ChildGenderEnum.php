<?php
namespace App\Enum;

enum ChildGenderEnum: string
{
    case GIRL = 'girl';
    case BOY =  'boy';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
