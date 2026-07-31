<?php

namespace App\Helpers;

class PhoneHelper
{
    /**
     * This function normalizes a phone number by removing any spaces and
     * ensuring it is in the format +216XXXXXXXX
     *
     * @param mixed $phone
     * @return array|string|null
     */
    public static function normalizeTunisiaPhone(?string $phone): ?string
    {
        if ($phone === null) {
            return null;
        }

        $normalized = preg_replace('/\s+/', '', trim($phone));
        if ($normalized === '' || $normalized === '+216') {
            return null;
        }

        if (str_starts_with($normalized, '00216')) {
            $normalized = '+216' . substr($normalized, 5);
        }

        if (str_starts_with($normalized, '216') && !str_starts_with($normalized, '+')) {
            $normalized = '+' . $normalized;
        }

        $digitsOnly = preg_replace('/\D+/', '', $normalized);
        if ($digitsOnly !== null && strlen($digitsOnly) === 8) {
            return '+216' . $digitsOnly;
        }

        return $normalized;
    }
}
