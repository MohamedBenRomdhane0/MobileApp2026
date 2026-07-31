<?php
namespace App\Enum;

enum QuestionTypeEnum: string
{
    case BINARY = 'Binary';
    case QCM = 'QCM';
    case MATCHING = 'Matching';
    case OPEN = 'Open';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
