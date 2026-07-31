<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SwaggerAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
        $username = env('SWAGGER_USERNAME');
        $password = env('SWAGGER_PASSWORD');

        if ($request->getUser() !== $username || $request->getPassword() !== $password) {
            return response()->json(['message' => 'Unauthorized'], 401, [
                'WWW-Authenticate' => 'Basic'
            ]);
        }

        
    }
}
