<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\App;

class DetectAppLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLanguages = ['fr', 'ar'];
        $language = 'en';

        // 1. Check if language is provided in the "lang" query parameter
        if ($request->has('lang') && in_array($request->query('lang'), $supportedLanguages)) {
            $language = $request->query('lang');
        }
        // 2. Check the "Accept-Language" header
        elseif ($request->hasHeader('Accept-Language')) {
            $preferredLang = substr($request->header('Accept-Language'), 0, 2);

            if (in_array($preferredLang, $supportedLanguages)) {
                $language = $preferredLang;
            }
        }
        
        // 3. Fallback to checking the URL path
        else {
            $path = strtolower($request->path());
            foreach ($supportedLanguages as $lang) {
                if (strpos($path, "$lang/") === 0 || $path === $lang) {
                    $language = $lang;
                    break;
                }
            }
        }

        // Set the locale for the Laravel app
        App::setLocale($language);

        // Share the language globally
        view()->share('language', $language);

        return $next($request);
    }
}
