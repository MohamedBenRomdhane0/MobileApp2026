<?php
namespace App\Enum;

enum IconTypeEnum: string
{
    case TEXT = 'text';
    case IMAGE = 'image';
    case VIDEO = 'video';
    case AUDIO = 'audio';
    case PDF = 'pdf';
    
    public static function getValues(): array
        {
            return array_column(self::cases(), 'value');
        }
}

