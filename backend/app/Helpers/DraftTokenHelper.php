<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class DraftTokenHelper
{
    public static function generate(): string
    {
        return Str::random(80);
    }
}
