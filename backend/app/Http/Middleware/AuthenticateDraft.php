<?php

namespace App\Http\Middleware;

use App\Models\DraftUser;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateDraft
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Draft token missing.', 'code' => 'draft_missing'], 401);
        }

        // withTrashed so we can tell "never existed" apart from "already completed"
        // apart from "genuinely time-expired" instead of collapsing them all into
        // one generic 401.
        $draftUser = DraftUser::withTrashed()->where('token', $token)->first();

        if (!$draftUser) {
            $this->logRejection('draft_invalid', $request, null);
            return response()->json(['message' => 'Draft session not found.', 'code' => 'draft_invalid'], 401);
        }

        if ($draftUser->trashed()) {
            $this->logRejection('draft_completed', $request, $draftUser);
            return response()->json(['message' => 'Draft session already completed.', 'code' => 'draft_completed'], 401);
        }

        if ($draftUser->isExpired()) {
            $this->logRejection('draft_expired', $request, $draftUser);
            return response()->json(['message' => 'Draft session expired.', 'code' => 'draft_expired'], 401);
        }

        $draftUser->touchExpiry();

        $request->attributes->set('draft_user', $draftUser);

        return $next($request);
    }

    private function logRejection(string $reason, Request $request, ?DraftUser $draftUser): void
    {
        Log::warning('[AuthenticateDraft] rejected', [
            'reason'        => $reason,
            'draft_user_id' => $draftUser?->id,
            'token_hash'    => substr(hash('sha256', (string) $request->bearerToken()), 0, 12),
            'ip'            => $request->ip(),
            'path'          => $request->path(),
        ]);
    }
}
