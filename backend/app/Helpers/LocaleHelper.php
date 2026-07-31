<?php

namespace App\Helpers;

use Illuminate\Http\Request;

class LocaleHelper
{
    /**
     * Resolve the language from the Accept-Language header or default.
     */
    public static function resolve(Request $request): string
    {
        $supported = ['ar', 'fr'];
        $default = 'ar';

        $header = $request->header('Accept-Language');
        if ($header) {
            $lang = substr($header, 0, 2);
            if (in_array($lang, $supported)) {
                return $lang;
            }
        }

        return $default;
    }
}
