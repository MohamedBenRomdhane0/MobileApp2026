<?php

namespace App\Repositories;

use App\Enum\DiskEnum;
use App\Enum\MediaTagEnum;
use Illuminate\Support\Facades\Auth;
use App\Enum\RoleEnum;
use App\Enum\StatusEnum;
use App\Enum\UserStatusEnum;
use App\Mail\VerificationMail;
use App\Models\User;
use App\Helpers\TokenHelper;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Helpers\AvatarHelper;
use App\Mail\ResetPasswordMail;
use App\Repositories\MediaRepository;
use Tymon\JWTAuth\Facades\JWTFactory;
use App\Services\SMSService;
use Illuminate\Support\Facades\Log;
use App\Models\ChildProfile;
use Illuminate\Validation\ValidationException;
use App\Helpers\PhoneHelper;
use Exception;
use Illuminate\Http\Exceptions\HttpResponseException;

class AuthRepository
{
    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param array $credentials
     * @param array|null $allowedRoles
     * @return array
     */
    final public static function authenticate(array $credentials = [], ?array $allowedRoles = null, $user = null, $isImpersonating = false): array
    {
        $identifier = $credentials['email'] ?? ($credentials['phone'] ?? null);
        $password = $credentials['password'] ?? null;

        $user = $user ?? User::with('roles.permissions')->where('email', $identifier)->orWhere('phone', $identifier)->first();

        if (!$user) {
            throw new Exception(__('invalid_credentials'), ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($allowedRoles !== null) {
            $userRole = $user->roles->first()->name ?? null;
            if (!in_array($userRole, $allowedRoles)) {
                throw new Exception(__('invalid_credentials'), ResponseAlias::HTTP_UNAUTHORIZED);
            }
        }

        if (!Hash::check($password, $user->password) && !$isImpersonating) {
            throw new Exception(__('invalid_credentials'), ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($user->hasRole(RoleEnum::TEACHER->value) || $user->hasRole(RoleEnum::PARENT->value)) {
            if ((int) $user->status !== UserStatusEnum::ACTIVE->value) {
                throw new Exception(__('account_not_verified'), ResponseAlias::HTTP_FORBIDDEN);
            }
        }

        if ($user->hasRole(RoleEnum::PARENT->value)) {
            $user->load(['parentProfile.children.user.media', 'parentProfile.children.level.levelType']);
        }

        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            $user->load('teacherProfile');
        }

        return self::buildLoginAuthData($user);
    }

    /**
     * Refreshes the JWT token.
     *
     * @return array
     * @throws Exception
     */
    final public function refreshToken(): array
    {
        $user = auth()->user();

        $oldToken = request()->bearerToken();
        if (!$oldToken) {
            throw new Exception(__('messages.token_missing'), ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $payload = JWTAuth::setToken($oldToken)->getPayload();

        $claims = [];

        if ($payload->get('impersonation_key')) {
            $claims['impersonation_key'] = $payload->get('impersonation_key');
            $claims['impersonator_id'] = $payload->get('impersonator_id');
        }

        if ($payload->get('impersonation_active')) {
            $claims['impersonation_active'] = (bool) $payload->get('impersonation_active');
            $claims['impersonator_id'] = $payload->get('impersonator_id');
            $claims['impersonation_type'] = $payload->get('impersonation_type');
        }

        return self::buildAuthData($user, $claims);
    }

    /**
     * Admin connects to another user’s account
     *
     * @param int $targetUserId
     * @return array
     * @throws Exception
     */
    public static function impersonate(int $targetUserId): array
    {
        $admin = request()->user();
        if (!$admin->hasRole(RoleEnum::ADMIN->value)) {
            throw new Exception(__('messages.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $targetUser = User::where('id', $targetUserId)->with('roles.permissions')->first();

        if (!$targetUser) {
            throw new Exception(__('messages.user_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        if ($targetUser->hasRole(RoleEnum::PARENT->value)) {
            $targetUser->load(['parentProfile.children.user.media', 'parentProfile.children.level.levelType']);
        }

        if ($targetUser->hasRole(RoleEnum::TEACHER->value)) {
            $targetUser->load('teacherProfile');
        }

        $customClaims = [
            'impersonator_id' => $admin->id,
            'impersonation_type' => 'admin_to_user',
            'impersonation_active' => true,
        ];

        $authData = self::buildLoginAuthData($targetUser, $customClaims);
        $authData['handoff_code'] = self::issueHandoffCode($authData);

        return $authData;
    }

    /**
     * Exit impersonation and return to admin account
     *
     * @return array
     * @throws Exception
     */
    public static function exitImpersonation(): array
    {
        $rawToken = request()->bearerToken();
        if (!$rawToken) {
            throw new Exception(__('messages.token_missing'), ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $payload = JWTAuth::setToken($rawToken)->getPayload();

        $adminId = $payload->get('impersonator_id');
        $isImpersonating = $payload->get('impersonation_active');

        if (!$isImpersonating || !$adminId) {
            throw new Exception(__('messages.no_impersonation_context'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $admin = User::where('id', $adminId)->with('roles.permissions', 'media')->first();
        if (!$admin) {
            throw new Exception(__('messages.admin_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        if (!$admin->hasRole(RoleEnum::ADMIN->value)) {
            throw new Exception(__('messages.original_user_not_admin'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $authData = self::buildLoginAuthData($admin);
        $authData['handoff_code'] = self::issueHandoffCode($authData);

        return $authData;
    }

    /**
     * Register a new teacher.
     *
     * @param array $data
     * @return User
     */
    public function registerTeacher(array $data): User
    {
        $phone = PhoneHelper::normalizeTunisiaPhone($data['phone'] ?? null);

        $user = User::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $phone,
            'password' => bcrypt($data['password']),
            'status' => StatusEnum::INACTIVE->value,
        ]);
        $user->assignRole(RoleEnum::TEACHER->value);
        $user->teacherProfile()->create([
            'is_valid' => false,
            'is_valid_financial' => false,
        ]);
        //----> Generate email code
        $code = $this->generateVerificationCode($user->id, 'email');
        Mail::to($user->email)->send(new VerificationMail($code, $user));
        return $user;
    }

    /**
     * Register a new parent.
     *
     * @param array $data
     * @return array
     */
    public function registerParent(array $data): array
    {
        try {
            $phone = PhoneHelper::normalizeTunisiaPhone($data['phone'] ?? null);
            if ($phone === null) {
                throw ValidationException::withMessages(['phone' => __('validation.required')]);
            }

            Log::info('[Auth] Register parent start', [
                'phone' => $phone,
                'full_name' => $data['full_name'] ?? null,
            ]);

            $user = User::create([
                'full_name' => $data['full_name'],
                'email' => $data['email'] ?? null,
                'phone' => $phone,
                'password' => bcrypt($data['password']),
                'status' => StatusEnum::INACTIVE->value,
            ]);

            $user->assignRole(RoleEnum::PARENT->value);

            $user->parentProfile()->create([
                'address' => $data['address'] ?? null,
                'guide_progress' => $data['guide_progress'],
            ]);

            $code = $this->generateVerificationCode($user->id, 'sms');
            Log::info('[Auth] Parent code generated', ['user_id' => $user->id, 'channel' => 'sms']);

            $sent = app(SMSService::class)->send($user->phone, "Your AbaJim verification code is: {$code}");

            Log::info('[Auth] SMS dispatch result', [
                'user_id' => $user->id,
                'phone' => $user->phone,
                'sent' => $sent,
            ]);

            return [
                'message' => $sent ? 'Verification code sent via SMS.' : 'Verification code generated but SMS failed.',
                'user_id' => $user->id,
            ];
        } catch (Exception $e) {
            Log::error('[Auth] Register parent failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new Exception($e->getMessage(), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function generateVerificationCode($userId, $channel = 'sms')
    {
        $code = rand(100000, 999999);
        $expiresAt = now()->addMinutes(10);

        Cache::put("verify_code_{$userId}", $code, $expiresAt);
        DB::table('user_verifications')->insert([
            'user_id' => $userId,
            'channel' => $channel,
            // Stored in plaintext in local env only, so the code can be read
            // straight from the DB while SMS delivery to Tunisia is unreliable
            // during Vonage trial/route setup. Always hashed elsewhere.
            'code' => app()->environment('local') ? $code : Hash::make($code),
            'expires_at' => $expiresAt,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Log::info('[Auth] Code stored', [
            'user_id' => $userId,
            'channel' => $channel,
            'expires_at' => $expiresAt->toDateTimeString(),
        ]);

        return $code;
    }

    /**
     * Compare a user-submitted code against the stored one, matching the
     * hashed-vs-plaintext storage mode used by generateVerificationCode().
     */
    private function codeMatches(string $inputCode, string $storedCode): bool
    {
        return app()->environment('local')
            ? hash_equals($storedCode, $inputCode)
            : Hash::check($inputCode, $storedCode);
    }

    /**
     * Parent create a new child.
     *
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function createChild(array $data): array
    {
        if (isset($data['parent_id'])) {
            $parent = User::with('parentProfile.children')->findOrFail($data['parent_id']);
        } else {
            $parent = request()->user()->load('parentProfile.children');
        }

        if (!$parent->parentProfile) {
            throw new Exception(__('messages.parent_profile_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        if ($parent->parentProfile->children()->where('level_id', $data['level_id'])->exists()) {
            throw new Exception(__('messages.child_already_exists'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $maxChildren = config('constants.MAX_CHILDREN_ACCOUNTS', 3);

        if ($parent->parentProfile->children->count() >= $maxChildren) {
            throw new Exception(__('messages.max_children_reached'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $child = User::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'] ?? null,
            'phone' => null,
            'password' => null,
            'status' => StatusEnum::ACTIVE->value,
        ]);

        $child->assignRole(RoleEnum::CHILD->value);

        $child->childProfile()->create([
            'parent_id' => $parent->id,
            'level_id' => $data['level_id'],
            'gender' => $data['gender'],
        ]);

        $avatarPath = $data['avatar'] ?? AvatarHelper::getRandomUniqueAvatarPath($parent, $data['gender']);

        MediaRepository::uploadMedia(
            model: $child,
            path: $avatarPath,
            disk: DiskEnum::S3->value,
            folder: 'users/avatars',
            tag: MediaTagEnum::AVATAR->value
        );

        return [
            'message' => __('messages.child_created'),
            'user' => $child->load(['childProfile', 'media']),
        ];
    }

    /**
     * Switch to a child account.
     *
     * @param int $childIdOrUserId
     * @return array
     * @throws \Exception
     */
    public static function switchToChild(int $childIdOrUserId): array
    {
        $parentId = self::getParentIdFromToken();

        $parent = self::validateParentUser($parentId);

        $childProfile = self::findChildProfileForParent($parent->id, $childIdOrUserId);

        $child = self::prepareChildUser($childProfile);

        return self::buildChildSwitchResponse($child, $parent->id);
    }

    /**
     * Extract parent ID from current JWT token.
     *
     * @return int
     * @throws \Exception
     */
    private static function getParentIdFromToken(): int
    {
        $rawToken = request()->bearerToken();

        if (!$rawToken) {
            throw new Exception('Token missing from Authorization header', ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $payload = JWTAuth::setToken($rawToken)->getPayload();

        // impersonator_id is reused by two unrelated chains: admin->user
        // ("who do I return to") and parent->child ("who is the real
        // parent"). Only trust it as "the parent" when the current token
        // is itself a parent_to_child token (switching between siblings).
        // Otherwise the parent is whoever this token authenticates as -
        // a normal parent, or an admin impersonating a parent.
        $isChildToken = $payload->get('impersonation_type') === 'parent_to_child'
            && (bool) $payload->get('impersonation_active');

        if ($isChildToken) {
            return (int) $payload->get('impersonator_id');
        }

        return (int) auth()->id();
    }

    /**
     * Validate that the user is a parent.
     *
     * @param int $parentId
     * @return User
     * @throws Exception
     */
    private static function validateParentUser(int $parentId): User
    {
        $parent = User::find($parentId);

        if (!$parent) {
            throw new Exception('Parent user not found', ResponseAlias::HTTP_NOT_FOUND);
        }

        if (!$parent->hasRole(RoleEnum::PARENT->value)) {
            throw new Exception('Only parents can switch to child', ResponseAlias::HTTP_FORBIDDEN);
        }

        return $parent;
    }

    /**
     * Find child profile belonging to the parent.
     *
     * @param int $parentId
     * @param int $childIdOrUserId
     * @return ChildProfile
     * @throws ValidationException
     */
    private static function findChildProfileForParent(int $parentId, int $childIdOrUserId): ChildProfile
    {
        $childProfile = ChildProfile::query()
            ->where('parent_id', $parentId)
            ->where(function ($query) use ($childIdOrUserId) {
                $query->where('user_id', $childIdOrUserId)->orWhere('id', $childIdOrUserId);
            })
            ->with(['user.media', 'user.roles'])
            ->first();

        if (!$childProfile) {
            throw ValidationException::withMessages([
                'child_id' => [__('messages.child_not_belong_to_parent')],
            ]);
        }

        return $childProfile;
    }

    /**
     * Prepare child user with proper role assignment.
     *
     * @param ChildProfile $childProfile
     * @return User
     */
    private static function prepareChildUser(ChildProfile $childProfile): User
    {
        $child = $childProfile->user;

        if (!$child->hasRole(RoleEnum::CHILD->value)) {
            DB::transaction(function () use ($child) {
                $child->syncRoles([RoleEnum::CHILD->value]);
            });
        }

        return $child;
    }

    /**
     * Build the authentication response for child switch.
     *
     * @param User $child
     * @param int $parentId
     * @return array
     */
    private static function buildChildSwitchResponse(User $child, int $parentId): array
    {
        $customClaims = [
            'sub' => $child->id,
            'impersonator_id' => $parentId,
            'impersonation_type' => 'parent_to_child',
            'impersonation_active' => true,
        ];

        $payload = JWTFactory::customClaims($customClaims)->make();
        $token = JWTAuth::encode($payload)->get();

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $child->load(['childProfile', 'media']),
        ];
    }
    /**
     * Exit child impersonation and return to parent account
     *
     * @return array
     * @throws Exception
     */
    public static function returnToParent(): array
    {
        $rawToken = request()->bearerToken();
        if (!$rawToken) {
            throw new Exception(__('messages.token_missing'), ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $payload = JWTAuth::setToken($rawToken)->getPayload();

        $parentId = $payload->get('impersonator_id');
        $isImpersonating = $payload->get('impersonation_active');

        if (!$isImpersonating || !$parentId) {
            throw new Exception(__('messages.no_impersonation_context'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $parent = User::with('media')->findOrFail($parentId);

        $token = JWTAuth::fromUser($parent);

        return [
            'access_token' => $token,
            'user' => $parent->load('parentProfile'),
        ];
    }

    /**
     * Verify the code sent to the user.
     * @param int $userId
     * @param string $code
     * @return array
     * @throws ValidationException
     */
    public function verifyCode(int $userId, string $code): array
    {
        $user = User::with('roles.permissions')->findOrFail($userId);

        $expectedCode = Cache::get("verify_code_{$user->id}");

        $verification = DB::table('user_verifications')->where('user_id', $user->id)->where('expires_at', '>=', now())->latest()->first();

        if (!$expectedCode || !$verification || !$this->codeMatches($code, $verification->code)) {
            throw new HttpResponseException(response()->json(['message' => 'Invalid or expired code.'], 422));
        }

        $user->update([
            'status' => StatusEnum::ACTIVE->value,
            'email_verified_at' => now(),
        ]);

        Cache::forget("verify_code_{$user->id}");
        DB::table('user_verifications')->where('id', $verification->id)->delete();

        if ($user->hasRole('teacher')) {
            $user->load('teacherProfile');
        } elseif ($user->hasRole('parent')) {
            $user->load(['parentProfile.children.user.media', 'parentProfile.children.level.levelType']);
        } elseif ($user->hasRole('child')) {
            $user->load('childProfile');
        }

        return self::buildLoginAuthData($user);
    }

    /**
     * Send a password reset code to the user's phone or email
     * @param string $identifier
     * @return array
     */
    public function sendResetCode(string $identifier): array
    {
        $identifier = trim($identifier);

        $user = User::where('phone', $identifier)->orWhere('email', $identifier)->first();

        if (!$user) {
            throw new Exception(__('messages.user_not_found'));
        }

        $channel = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'sms';

        $code = $this->generateVerificationCode($user->id, $channel);
        Log::info('[Auth] Reset code generated', ['user_id' => $user->id, 'channel' => $channel]);

        try {
            if ($channel === 'email') {
                Mail::to($user->email)->send(new ResetPasswordMail($code, $user));
                Log::info('[Auth] Reset code email sent', ['user_id' => $user->id, 'email' => $user->email]);
                $message = 'Password reset code sent via Email.';
            } else {
                $sent = app(SMSService::class)->send($user->phone, "Reset code: {$code}");
                Log::info('[Auth] Reset code SMS status', ['user_id' => $user->id, 'phone' => $user->phone, 'sent' => $sent]);
                $message = $sent ? 'Password reset code sent via SMS.' : 'Password reset code generated but SMS failed.';
            }
        } catch (\Throwable $e) {
            Log::error('[Auth] Reset code dispatch failed', [
                'user_id' => $user->id,
                'channel' => $channel,
                'err' => $e->getMessage(),
            ]);

            if (app()->environment('local')) {
                $message = 'Reset code generated (dev). Check logs.';
            } else {
                throw $e;
            }
        }

        return [
            'message' => $message,
            'user_id' => $user->id,
        ];
    }

    /**
     * Resend the account verification code to the user's email or phone.
     * @param string $identifier
     * @return array
     */
    public function resendVerificationCode(string $identifier): array
    {
        $identifier = trim($identifier);

        $user = User::where('email', $identifier)->orWhere('phone', $identifier)->first();

        if (!$user) {
            throw new Exception(__('messages.user_not_found'));
        }

        if ((int) $user->status === UserStatusEnum::ACTIVE->value) {
            throw new Exception(__('messages.account_already_verified'), ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
        }

        $channel = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'sms';

        DB::table('user_verifications')->where('user_id', $user->id)->delete();
        Cache::forget("verify_code_{$user->id}");

        $code = $this->generateVerificationCode($user->id, $channel);

        try {
            if ($channel === 'email') {
                Mail::to($user->email)->send(new VerificationMail($code, $user));
                $message = 'verification_code_sent_email';
            } else {
                app(SMSService::class)->send($user->phone, "Verification code: {$code}");
                $message = 'verification_code_sent_sms';
            }
        } catch (\Throwable $e) {
            Log::error('[Auth] Resend verification dispatch failed', [
                'user_id' => $user->id,
                'channel' => $channel,
                'err' => $e->getMessage(),
            ]);
            if (!app()->environment('local')) {
                throw $e;
            }
            $message = 'verification_code_sent_email';
        }

        return [
            'message' => $message,
            'user_id' => $user->id,
        ];
    }

    /**
     * Reset the user's password using the verification code.
     *
     * @param int $userId
     * @param string $code
     * @param string $newPassword
     * @throws \Exception
     */
    public function resetPassword(int $userId, string $code, string $newPassword): void
    {
        $user = User::findOrFail($userId);

        $expectedCode = Cache::get("verify_code_{$user->id}");
        $verification = DB::table('user_verifications')->where('user_id', $user->id)->where('expires_at', '>=', now())->latest()->first();

        if (!$expectedCode || !$verification || !$this->codeMatches($code, $verification->code)) {
            throw new Exception('Invalid or expired code.');
        }

        $user->update([
            'password' => bcrypt($newPassword),
            'status' => StatusEnum::ACTIVE->value,
        ]);

        Cache::forget("verify_code_{$user->id}");
        DB::table('user_verifications')->where('id', $verification->id)->delete();
    }

    /**
     * Save the auto login token in the user's record
     * @param User $user
     * @return string
     */
    public static function storeAutoLoginToken(User $user): string
    {
        $token = TokenHelper::generateSecureToken();

        $user->auto_login_token = $token;
        $user->save();

        return $token;
    }

    /**
     * Wrap an already-built auth payload in a short-lived, single-use,
     * cache-backed handoff code so it can be redeemed across an origin
     * boundary (e.g. handing an impersonation session off to another
     * frontend app) without putting tokens in a URL query string.
     *
     * @param array $authData Output of buildAuthData()/buildLoginAuthData()
     * @return string
     */
    private static function issueHandoffCode(array $authData): string
    {
        $code = TokenHelper::generateSecureToken(40);
        Cache::put("impersonation_handoff_{$code}", $authData, now()->addSeconds(60));

        return $code;
    }

    private static function buildAuthData($user, array $claims = [], bool $includeRefresh = true): array
    {
        if (!$user instanceof User) {
            throw new Exception('Invalid user instance.', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }

        $accessToken = Auth::setTTL(config('jwt.ttl'))
            ->claims(array_merge($claims, ['refresh_token' => false]))
            ->login($user);

        $refreshToken = null;
        if ($includeRefresh) {
            $refreshToken = Auth::setTTL(config('jwt.refresh_ttl'))
                ->claims(array_merge($claims, ['refresh_token' => true]))
                ->login($user);
        }

        $userPayload = [...array_diff_key($user->toArray(), ['roles' => true]), 'roles' => $user->roles];

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'user' => $userPayload,
            'media' => $user->media()->get() ?? null,
        ];
    }
    /**
     * Build login authentication data
     * @param User $user
     * @param array $claims
     * @return array
     */
    public static function buildLoginAuthData(User $user, array $claims = []): array
    {
        $payload = self::buildAuthData($user, $claims);

        $roleName = $user->roles->first()->name;
        $roles = $user->roles->pluck('name')->toArray();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        [$children, $childrenCount] = self::buildParentChildrenPayload($user);

        $parentProfile = $user->parentProfile
            ? array_merge($user->parentProfile->toArray(), [
                'children' => $children,
                'children_count' => $childrenCount,
            ])
            : null;

        $userPayload = is_array($payload['user'] ?? null) ? $payload['user'] : [];

        $payload['user'] = array_merge($userPayload, [
            'role' => $roleName,
            'roles' => $roles,
            'permissions' => $permissions,
            'children' => $children,
            'children_count' => $childrenCount,
            'parent_profile' => $parentProfile,
        ]);

        return $payload;
    }

    private static function buildParentChildrenPayload(User $user): array
        {
            if (!$user->relationLoaded('parentProfile') || !$user->parentProfile) {
                return [[], 0];
            }

            if (!$user->parentProfile->relationLoaded('children')) {
                return [[], 0];
            }

            $children = $user->parentProfile->children
                ->map(function ($child) {
                    $childUser = $child->user;

                    $childUserId = (int) ($childUser->id ?? ($child->user_id ?? ($child->id ?? 0)));

                    $fullName = (string) ($childUser->full_name ?? ($child->full_name ?? ''));
                    $avatar = null;
                    if ($childUser && $childUser->relationLoaded('media')) {
                        $m = $childUser->media->firstWhere('tag', 'avatar') ?? $childUser->media->first();
                        $avatar = $m ? ($m->file_path ?? null) : null;
                    }

                    $level = $child->relationLoaded('level') ? $child->level : null;
                    $levelType = $level && $level->relationLoaded('levelType') ? $level->levelType : null;

                    return [
                        'id'              => $childUserId,
                        'full_name'       => $fullName,
                        'avatar'          => $avatar,
                        'gender'          => $child->gender,
                        'level_id'        => $child->level_id,
                        'level_name'      => $level ? ($level->name_fr ?? $level->name) : null,
                        'level_type_name' => $levelType ? ($levelType->name_fr ?? $levelType->name) : null,
                        'parent_id'       => (int) $child->parent_id,
                    ];
                })
                ->values();

            return [$children->toArray(), $children->count()];
        }
    }
