<?php

namespace App\Enums;

enum CancellationReasonEnum: string
{
    case ILLNESS      = 'illness';
    case FORCE_MAJEURE = 'force_majeure';
    case PERSONAL     = 'personal';
}
