<?php

namespace App\Enum;

enum PlanEnum
{
    public const ANNEE_SCOLAIRE = 'ANNEE_SCOLAIRE';
    public const CONCOURS = 'CONCOURS';

    public static function toArray(): array
    {
        return [self::ANNEE_SCOLAIRE, self::CONCOURS];
    }
}
