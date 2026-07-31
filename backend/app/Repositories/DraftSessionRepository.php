<?php

namespace App\Repositories;

use App\Enum\DiskEnum;
use App\Enum\MediaTagEnum;
use App\Enum\RoleEnum;
use App\Enum\StatusEnum;
use App\Helpers\AvatarHelper;
use App\Helpers\PhoneHelper;
use App\Models\DraftUser;
use App\Models\User;
use App\Services\SMSService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DraftSessionRepository
{
    protected AuthRepository $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * Convert a draft session into a real parent + child account.
     *
     * @throws Exception|ValidationException
     */
    public function complete(DraftUser $draftUser, array $data): array
    {
        $parentData = $data['parent'];
        $childData  = $data['child'];

        $phone = PhoneHelper::normalizeTunisiaPhone($parentData['phone'] ?? null);
        if ($phone === null) {
            throw ValidationException::withMessages(['parent.phone' => __('validation.required')]);
        }

        DB::beginTransaction();
        try {
            // 1. Create parent user
            $parent = User::create([
                'full_name' => $parentData['full_name'],
                'email'     => $parentData['email'] ?? null,
                'phone'     => $phone,
                'password'  => Hash::make($parentData['password']),
                'status'    => StatusEnum::INACTIVE->value,
            ]);

            $parent->assignRole(RoleEnum::PARENT->value);
            $parent->parentProfile()->create([
                'address'        => null,
                'guide_progress' => null,
            ]);

            // 2. Create child user
            $child = User::create([
                'full_name' => $childData['full_name'],
                'email'     => null,
                'phone'     => null,
                'password'  => null,
                'status'    => StatusEnum::ACTIVE->value,
            ]);

            $child->assignRole(RoleEnum::CHILD->value);
            $child->childProfile()->create([
                'parent_id' => $parent->id,
                'level_id'  => $draftUser->level_id,
                'gender'    => $childData['gender'],
                'age'       => $childData['age'],
            ]);

            // 3. Assign avatar to child
            $avatarPath = AvatarHelper::getRandomUniqueAvatarPath($parent, $childData['gender']);
            MediaRepository::uploadMedia(
                model: $child,
                path: $avatarPath,
                disk: DiskEnum::S3->value,
                folder: 'users/avatars',
                tag: MediaTagEnum::AVATAR->value
            );

            // 4. Send SMS verification to parent
            $code = $this->authRepository->generateVerificationCode($parent->id, 'sms');
            $sent = app(SMSService::class)->send($parent->phone, "Your AbaJim verification code is: {$code}");

            Log::info('[DraftSession] Complete: parent created', [
                'parent_id' => $parent->id,
                'child_id'  => $child->id,
                'sms_sent'  => $sent,
            ]);

            // 5. Soft-delete the draft
            $draftUser->delete();

            DB::commit();

            return ['user_id' => $parent->id];
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('[DraftSession] Complete failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
