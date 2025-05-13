<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Auth;
use App\Enum\RoleEnum;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Exception;

class AuthRepository
{
    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param array $credentials
     * @return \Illuminate\Http\JsonResponse
     */
    final public function authenticate(array $credentials): array
    {
        $identifier = $credentials['email'] ?? ($credentials['phone'] ?? null);
        $password = $credentials['password'] ?? null;

        $user = User::where('email', $identifier)->orWhere('phone', $identifier)->first();

        if (!$user) {
            throw new \Exception(
                json_encode([
                    'email_or_phone' => __('messages.user_not_found'),
                ]),
                ResponseAlias::HTTP_UNAUTHORIZED,
            );
        }

        if (!Hash::check($password, $user->password)) {
            throw new \Exception(
                json_encode([
                    'password' => __('messages.password_incorrect'),
                ]),
                ResponseAlias::HTTP_UNAUTHORIZED,
            );
        }

        if (!$user->is_valid) {
            throw new \Exception(__('messages.user_not_validated'), ResponseAlias::HTTP_FORBIDDEN);
        }

        //----> Access token
        $accessToken = Auth::setTTL(config('jwt.ttl'))
            ->claims(['refresh_token' => false])
            ->login($user);

        //----> Refresh token
        $refreshToken = Auth::setTTL(config('jwt.refresh_ttl'))
            ->claims(['refresh_token' => true])
            ->login($user);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'user' => $user,
            'media' => $user->media()->first() ?? null,
        ];
    }

    /**
     * Refreshes the JWT token.
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     *
     */
    final public function refreshToken(): array
    {
        $user = auth()->user();
        $token = auth()
            ->setTTL(config('jwt.ttl'))
            ->claims(['refresh_token' => false])
            ->login($user);
        $refreshToken = auth()
            ->setTTL(config('jwt.refresh_ttl'))
            ->claims(['refresh_token' => true])
            ->login($user);
        return [
            'access_token' => $token,
            'refresh_token' => $refreshToken,
        ];
    }

    /**
     * Admin connects to another user’s account
     *
     * @param int $targetUserId
     * @return array
     */
    public function impersonate(int $targetUserId): array
    {
        $admin = Auth::user();
        if (!$admin->hasRole(RoleEnum::ADMIN->value)) {
            abort(403, 'Unauthorized.');
        }
        $targetUser = User::findOrFail($targetUserId);
        $token = JWTAuth::fromUser($targetUser);
        return [
            'access_token' => $token,
            'user' => $targetUser,
        ];
    }
    /**
     * Register a new teacher.
     *
     * @param array $data
     * @return array
     */

    public function registerTeacher(array $data): array
    {
        $user = User::create($data);

        $user->assignRole(RoleEnum::TEACHER->value);

        $user->teacherProfile()->create([
            'address' => $data['address'],
            'subject' => $data['subject'],
            'level_id' => $data['level_id'],
        ]);

        $token = JWTAuth::fromUser($user);

        return [
            'access_token' => $token,
            'user' => $user,
        ];
    }
    /**
     * Register a new parent.
     *
     * @param array $data
     * @return array
     */

    public function registerParent(array $data): array
    {
        $user = User::create($data);

        $user->assignRole(RoleEnum::PARENT->value);

        $user->parentProfile()->create([
            'address' => $data['address'],
            'guide_progress' => $data['guide_progress'],
        ]);

        $token = JWTAuth::fromUser($user);

        return [
            'access_token' => $token,
            'user' => $user,
        ];
    }
    /**
     * Parent create a new child.
     *
     * @param array $data
     * @return array
     */
    public function registerChild(array $data): array
    {
        $user = User::create($data);
        
        $user->assignRole(RoleEnum::CHILD->value);

        $user->childProfile()->create(
            [
                'parent_id' => auth()->user()->id,
                'level_id' => $data['level_id'],
                'sexe' => $data['sexe'],
            ]
        );

        $token = JWTAuth::fromUser($user);

        return [
            'access_token' => $token,
            'user' => $user,
        ];
    }
}
