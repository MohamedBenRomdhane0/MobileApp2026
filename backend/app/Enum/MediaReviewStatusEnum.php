<?php

namespace App\Enum;

enum MediaReviewStatusEnum: string
{
    case PENDING          = 'pending';
    case APPROVED         = 'approved';
    case REJECTED         = 'rejected';
    case CHANGES_REQUESTED = 'changes_requested';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
