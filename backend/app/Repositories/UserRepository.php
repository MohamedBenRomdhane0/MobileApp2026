<?php

namespace App\Repositories;

use App\Enum\RoleEnum;
use App\Enum\UserStatusEnum;
use App\Mail\VerificationMail;
use App\Models\User;
use App\Models\ChildProfile;
use App\Models\TeacherLevelMaterial;
use App\Models\TeacherLevelSectionMaterial;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use App\Enum\DiskEnum;
use App\Enum\MediaTagEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use App\Helpers\QueryConfig;
use App\Traits\PaginationParams;
use App\Helpers\PhoneHelper;
use Illuminate\Auth\Access\AuthorizationException;
use Spatie\Permission\Models\Role;

class UserRepository
{
    protected AuthRepository $authRepoRepository;
    use PaginationParams;

    public function __construct(AuthRepository $authRepoRepository)
    {
        $this->authRepoRepository = $authRepoRepository;
    }

    public function updateProfile(array $data, ?int $targetUserId = null): User
    {
        $actor = request()->user();
        $user = $this->resolveProfileTarget($actor, $targetUserId);

        $this->authorizeProfileUpdate($actor, $user);
        $data = $this->normalizeProfileData($data);
        $isSelfUpdate = $actor->id === $user->id;

        $this->applyCommonProfileUpdates($user, $data, $isSelfUpdate);
        $this->applyRoleSpecificProfileUpdates($user, $data);

        return $this->loadUpdatedProfile($user);
    }

    private function shouldUpdateLevel(User $user, ?int $newLevelId): bool
    {
        if (!$newLevelId || !$user->hasRole(RoleEnum::CHILD->value)) {
            return false;
        }
        return true;
    }

    private function resolveProfileTarget(User $actor, ?int $targetUserId): User
    {
        if (!$targetUserId || $targetUserId === $actor->id) {
            $actor->loadMissing(['roles.permissions', 'teacherProfile', 'parentProfile.children.user.media', 'parentProfile.children.level', 'childProfile.level', 'media']);
            return $actor;
        }

        $target = User::with(['roles.permissions', 'teacherProfile', 'parentProfile.children.user.media', 'parentProfile.children.level', 'childProfile.level', 'media'])
            ->whereKey($targetUserId)
            ->first();

        if (!$target) {
            throw new \Exception(__('messages.user_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        if (!$target instanceof User) {
            throw new \Exception(__('messages.user_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        return $target;
    }

    private function authorizeProfileUpdate(User $actor, User $target): void
    {
        if ($actor->hasRole(RoleEnum::ADMIN->value)) {
            return;
        }

        if ($actor->id === $target->id) {
            return;
        }

        if ($actor->hasRole(RoleEnum::PARENT->value) && $target->hasRole(RoleEnum::CHILD->value) && $target->childProfile?->parent_id === $actor->id) {
            return;
        }

        if ($actor->hasRole(RoleEnum::CHILD->value) && $target->hasRole(RoleEnum::PARENT->value) && $actor->childProfile?->parent_id === $target->id) {
            return;
        }

        throw new \Exception(__('messages.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
    }

    private function normalizeProfileData(array $data): array
    {
        if (array_key_exists('fullName', $data) && !array_key_exists('full_name', $data)) {
            $data['full_name'] = $data['fullName'];
        }

        if (array_key_exists('user_media', $data) && !array_key_exists('avatar', $data)) {
            $data['avatar'] = $data['user_media'];
        }

        return $data;
    }

    private function applyCommonProfileUpdates(User $user, array $data, bool $isSelfUpdate): void
    {
        if (!empty($data['full_name'])) {
            $user->full_name = $data['full_name'];
        }

        if (!empty($data['email']) && $data['email'] !== $user->email) {
            $user->email = $data['email'];

            if ($isSelfUpdate) {
                $user->status = UserStatusEnum::INACTIVE->value;
                $user->email_verified_at = null;
                $code = $this->authRepoRepository->generateVerificationCode($user->id, 'email');
                Mail::to($user->email)->send(new VerificationMail($code, $user));
            }
        }

        $phone = PhoneHelper::normalizeTunisiaPhone($data['phone'] ?? null);
        if ($phone !== null && $phone !== $user->phone) {
            $user->phone = $phone;

            if ($isSelfUpdate && $user->hasRole(RoleEnum::PARENT->value)) {
                $user->status = UserStatusEnum::PENDING->value;
            }
        }

        if (!empty($data['password'])) {
            $user->password = bcrypt($data['password']);
        }

        $user->save();

        $this->syncAvatarMedia($user, $data);
        $this->handleDeletedMedia($user, $data);
    }

    private function syncAvatarMedia(User $user, array $data): void
    {
        if (isset($data['remove_avatar']) && (string) $data['remove_avatar'] === '1') {
            MediaRepository::deleteMediaByTag($user, MediaTagEnum::AVATAR->value);
            return;
        }

        if (!empty($data['avatar'])) {
            MediaRepository::deleteMediaByTag($user, MediaTagEnum::AVATAR->value);
            MediaRepository::uploadMedia(model: $user, path: $data['avatar'], disk: DiskEnum::S3->value, folder: 'users/avatars', tag: MediaTagEnum::AVATAR->value);
        }
    }

    private function handleDeletedMedia(User $user, array $data): void
    {
        if (!empty($data['deleted_media_ids'])) {
            foreach ($data['deleted_media_ids'] as $mediaId) {
                $media = $user->media()->find($mediaId);
                if ($media) {
                    if ($media->file_path) {
                        $disk = str_starts_with($media->file_path, 'http') ? DiskEnum::S3->value : DiskEnum::PUBLIC->value;
                        MediaRepository::deleteMediaFile($media->file_path, $disk);
                    }
                    $media->delete();
                }
            }
        }
    }

    private function applyRoleSpecificProfileUpdates(User $user, array $data): void
    {
        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            $this->applyTeacherProfileUpdates($user, $data);
        }

        if ($user->hasRole(RoleEnum::PARENT->value)) {
            $this->applyParentProfileUpdates($user, $data);
        }

        if ($user->hasRole(RoleEnum::CHILD->value)) {
            $this->applyChildProfileUpdates($user, $data);
        }
    }

    private function applyTeacherProfileUpdates(User $user, array $data): void
    {
        $updateData = [];
        
        if (array_key_exists('bio', $data)) {
            $updateData['bio'] = $data['bio'] ?? '';
        }
        
        if (array_key_exists('about', $data)) {
            $updateData['about'] = $data['about'] ?? '';
        }
        
        if (array_key_exists('education', $data)) {
            $updateData['education'] = $data['education'] ?? '';
        }
        
        if (array_key_exists('experience', $data)) {
            $updateData['experience'] = $data['experience'] ?? '';
        }

        if (!empty($updateData)) {
            $user->teacherProfile()->updateOrCreate(
                ['user_id' => $user->id],
                $updateData
            );
        }

        if (!empty($data['rib_file'])) {
            MediaRepository::deleteMediaByTag($user, MediaTagEnum::RIB->value);
            MediaRepository::uploadMedia($user, $data['rib_file'], DiskEnum::PUBLIC->value, 'teachers/proofs', MediaTagEnum::RIB->value);
        }

        if (array_key_exists('cin_file', $data)) {
            MediaRepository::deleteMediaByTag($user, MediaTagEnum::CIN->value);

            if (!empty($data['cin_file'])) {
                MediaRepository::uploadMedia($user, $data['cin_file'], DiskEnum::PUBLIC->value, 'teachers/proofs', MediaTagEnum::CIN->value);
            }
        }

        if (!empty($data['diploma_file'])) {
            MediaRepository::deleteMediaByTag($user, MediaTagEnum::DIPLOMA->value);
            MediaRepository::uploadMedia($user, $data['diploma_file'], DiskEnum::PUBLIC->value, 'teachers/proofs', MediaTagEnum::DIPLOMA->value);
        }

        if (isset($data['level_materials']) && is_array($data['level_materials'])) {
            TeacherLevelMaterial::where('teacher_id', $user->id)->delete();

            foreach ($data['level_materials'] as $levelMaterialId) {
                TeacherLevelMaterial::create([
                    'teacher_id' => $user->id,
                    'level_material_id' => $levelMaterialId,
                ]);
            }
        }

        if (isset($data['level_section_materials']) && is_array($data['level_section_materials'])) {
            TeacherLevelSectionMaterial::where('teacher_id', $user->id)->delete();

            foreach ($data['level_section_materials'] as $levelSectionMaterialId) {
                TeacherLevelSectionMaterial::create([
                    'teacher_id' => $user->id,
                    'level_section_material_id' => $levelSectionMaterialId,
                ]);
            }
        }
    }

    private function applyParentProfileUpdates(User $user, array $data): void
    {
        if (array_key_exists('address', $data)) {
            $user->parentProfile()->updateOrCreate(
                ['user_id' => $user->id],
                ['address' => $data['address']]
            );
        }
    }

    private function applyChildProfileUpdates(User $user, array $data): void
    {
        $update = [];

        if (array_key_exists('gender', $data)) {
            $update['gender'] = $data['gender'];
        }

        if (!empty($data['level_id']) && $this->shouldUpdateLevel($user, $data['level_id'])) {
            $update['level_id'] = $data['level_id'];
        }

        if (!empty($update)) {
            $user->childProfile()->updateOrCreate(['user_id' => $user->id], $update);
        }
    }

    public function loadUpdatedProfile(User $user): User
    {
        $user = $user->fresh(['roles.permissions', 'media']);

        if ($user->hasRole(RoleEnum::PARENT->value)) {
            $user->load(['parentProfile.children.user.media', 'parentProfile.children.level']);
        }

        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            $user->load([
                'teacherProfile',
                'teacherLevelMaterials.levelMaterial.level',
                'teacherLevelMaterials.levelMaterial.material',
                'teacherLevelSectionMaterials.levelSectionMaterial.levelSection.level',
                'teacherLevelSectionMaterials.levelSectionMaterial.levelSection.section',
                'teacherLevelSectionMaterials.levelSectionMaterial.material',
            ]);
        }

        if ($user->hasRole(RoleEnum::CHILD->value)) {
            $user->load('childProfile.level');
        }

        return $user;
    }

    public function setTeacherLevelMaterials(array $levelMaterials): array
    {
        $user = request()->user();

        if (!$user->hasRole(RoleEnum::TEACHER->value)) {
            throw new \Exception(__('messages.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $teacherId = $user->id;
        $existing = TeacherLevelMaterial::where('teacher_id', $teacherId)->get();

        if (!$existing) {
            foreach ($levelMaterials as $material) {
                TeacherLevelMaterial::create([
                    'teacher_id' => $teacherId,
                    'level_material_id' => $material['id'],
                ]);
            }
        } else {
            foreach ($existing as $material) {
                $existsInArray = false;

                foreach ($levelMaterials as $key => $item) {
                    if ($item['id'] == $material->level_material_id) {
                        $existsInArray = true;

                        unset($levelMaterials[$key]);

                        break;
                    }
                }

                if (!$existsInArray) {
                    $material->delete();
                }
            }

            foreach ($levelMaterials as $material) {
                TeacherLevelMaterial::create([
                    'teacher_id' => $teacherId,
                    'level_material_id' => $material['id'],
                ]);
            }
        }

        return [
            'message' => __('messages.level_materials_assigned'),
            'teacher_id' => $teacherId,
        ];
    }

    public static function setTeacherLevelSectionMaterials(array $levelSectionMaterials): array
    {
        $user = request()->user();

        if (!$user->hasRole(RoleEnum::TEACHER->value)) {
            throw new \Exception(__('messages.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

        $teacherId = $user->id;
        $existing = TeacherLevelSectionMaterial::where('teacher_id', $teacherId)->get();

        if ($existing->isEmpty()) {
            foreach ($levelSectionMaterials['level_section_materials'] as $material) {
                TeacherLevelSectionMaterial::create([
                    'teacher_id' => $teacherId,
                    'level_section_material_id' => $material['id'],
                ]);
            }
        } else {
            foreach ($existing as $material) {
                $existsInArray = false;

                foreach ($levelSectionMaterials['level_section_materials'] as $key => $item) {
                    if ($item['id'] == $material->level_section_material_id) {
                        $existsInArray = true;

                        unset($levelSectionMaterials['level_section_materials'][$key]);

                        break;
                    }
                }

                if (!$existsInArray) {
                    $material->delete();
                }
            }

            foreach ($levelSectionMaterials['level_section_materials'] as $material) {
                TeacherLevelSectionMaterial::create([
                    'teacher_id' => $teacherId,
                    'level_section_material_id' => $material['id'],
                ]);
            }
        }

        return [
            'message' => __('messages.level_section_materials_assigned'),
            'teacher_id' => $teacherId,
        ];
    }

    public static function getTeacherLevelMaterials(int $teacherId): array
    {
        $user = User::where('id', $teacherId)
            ->whereHas('roles', function ($query) {
                $query->where('name', RoleEnum::TEACHER->value);
            })
            ->with([
                'levelMaterials' => function ($query) use ($teacherId) {
                    $query->whereNull('level_materials.deleted_at')
                        ->whereHas('teacherLevelMaterials', function ($q) use ($teacherId) {
                            $q->where('teacher_id', $teacherId)
                              ->whereNull('teacher_level_materials.deleted_at');
                        });
                },
                'levelMaterials.teacherLevelMaterials' => function ($query) use ($teacherId) {
                    $query->where('teacher_id', $teacherId)
                          ->whereNull('teacher_level_materials.deleted_at');
                },
                'levelMaterials.level',
                'levelMaterials.material',
            ])
            ->firstOrFail();

        return [
            'teacher_id' => $user->id,
            'level_materials' => $user->levelMaterials,
        ];
    }

    public static function getTeacherLevelSectionMaterials(int $teacherId): array
    {
        $user = User::where('id', $teacherId)
            ->whereHas('roles', function ($query) {
                $query->where('name', RoleEnum::TEACHER->value);
            })
            ->with([
                'levelSectionMaterials' => function ($query) use ($teacherId) {
                    $query->whereHas('teacherLevelSectionMaterials', function ($q) use ($teacherId) {
                        $q->where('teacher_id', $teacherId);
                    });
                },
                'levelSectionMaterials.teacherLevelSectionMaterials' => function ($query) use ($teacherId) {
                    $query->where('teacher_id', $teacherId);
                },
                'levelSectionMaterials.levelSection.level.levelType',
                'levelSectionMaterials.levelSection.section',
                'levelSectionMaterials.material',
            ])
            ->firstOrFail();

        return [
            'teacher_id' => $user->id,
            'level_section_materials' => $user->levelSectionMaterials,
        ];
    }

    public function deleteChild(int $childId): array
    {
        $user = request()->user();

        if (!$user->hasRole(RoleEnum::PARENT->value) && !$user->hasRole(RoleEnum::ADMIN->value)) {
            throw new \Exception(__('messages.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
        }

    $childProfile = ChildProfile::where('user_id', $childId)->firstOrFail();
        if ($user->hasRole(RoleEnum::PARENT->value)) {
            if ($childProfile->parent_id !== $user->id) {
                throw new \Exception(__('messages.unauthorized'), ResponseAlias::HTTP_FORBIDDEN);
            }
        }

        $child = User::findOrFail($childProfile->user_id);

        DB::transaction(function () use ($child, $childProfile) {
            MediaRepository::deleteMediaByTag($child, MediaTagEnum::AVATAR->value);

            $childProfile->delete();

            $child->delete();
        });

        return ['message' => __('messages.child_deleted')];
    }


    public static function getTeacherByIdForChild(int $teacherId): User
    {
        $authUser = request()->user();
        $childId = $authUser?->id;

        $teacherQuery = User::query()
            ->select('users.*')
            ->whereKey($teacherId)
            ->byRole(RoleEnum::TEACHER->value)
            ->with([
                'teacherProfile:user_id,bio,about,education,experience',
                'media' => fn ($query) => $query->whereIn('tag', [
                    MediaTagEnum::AVATAR->value,
                    MediaTagEnum::TEACHER_TRAILER->value,
                ]),
                'teacherLevelMaterials.levelMaterial:id,level_id,material_id',
                'teacherLevelMaterials.levelMaterial.level:id,name',
                'teacherLevelMaterials.levelMaterial.material:id,name',
                'books:id,user_id,title',
                'reviewsReceived' => fn ($query) => $query
                    ->select('id', 'teacher_id', 'child_id', 'rating', 'comment', 'created_at', 'updated_at')
                    ->latest()
                    ->take(20)
                    ->with([
                        'child:id,full_name',
                        'child.childProfile:id,user_id,level_id',
                        'child.childProfile.level:id,name',
                    ]),
            ])
            ->withCount([
                'followers',
                'books as published_lessons_count',
                'reviewsReceived as reviews_count',
            ])
            ->withAvg('reviewsReceived as rating_average', 'rating');

        if ($childId) {
            $teacherQuery->withCount([
                'followers as is_followed' => fn ($query) => $query->where('users.id', $childId),
            ]);
        } else {
            $teacherQuery->addSelect([
                'is_followed' => DB::raw('0'),
            ]);
        }

        $teacher = $teacherQuery->first();

        if (!$teacher) {
            throw new \Exception(__('messages.teacher_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        return $teacher;
    }
 
    public static function saveTeacherReviewForChild(User $child, int $teacherId, array $data): array
    {
        if (!$child->hasRole(RoleEnum::CHILD->value)) {
            throw new AuthorizationException(__('messages.unauthorized'));
        }

        $teacher = User::query()
            ->whereKey($teacherId)
            ->byRole(RoleEnum::TEACHER->value)
            ->firstOrFail();

        $comment = trim((string) ($data['comment'] ?? ''));

        $review = Review::query()->updateOrCreate(
            [
                'teacher_id' => $teacher->id,
                'child_id' => $child->id,
            ],
            [
                'rating' => (int) $data['rating'],
                'comment' => $comment !== '' ? $comment : null,
            ]
        );

        $reviewsCount = Review::query()
            ->where('teacher_id', $teacher->id)
            ->count();

        $ratingAverageRaw = Review::query()
            ->where('teacher_id', $teacher->id)
            ->avg('rating');

        $ratingAverage = $ratingAverageRaw !== null
            ? round((float) $ratingAverageRaw, 1)
            : null;

        return [
            'teacher_id' => (int) $teacher->id,
            'child_id' => (int) $child->id,
            'is_created' => (bool) $review->wasRecentlyCreated,
            'review' => [
                'id' => (int) $review->id,
                'rating' => (int) $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at?->toISOString(),
                'updated_at' => $review->updated_at?->toISOString(),
            ],
            'reviews_count' => $reviewsCount,
            'rating_average' => $ratingAverage,
        ];
    }

    /**
     * Child follows teacher account
     * @param User $child
     * @param int $teacherId
     * @return bool
     */

    public static function toggleTeacherFollow(User $child, int $teacherId): bool
    {
        if (!$child->hasRole(RoleEnum::CHILD->value)) {
            throw new AuthorizationException(__('messages.unauthorized'));
        }

        $teacher = User::query()
            ->whereKey($teacherId)
            ->byRole(RoleEnum::TEACHER->value)
            ->firstOrFail();

        $isFollowing = $child->followedTeachers()
            ->where('users.id', $teacher->id)
            ->exists();

        if ($isFollowing) {
            $child->followedTeachers()->detach($teacher->id);

            return false;
        }

        $child->followedTeachers()->attach($teacher->id, [
            'followed_at' => now(),
        ]);

        return true;
    }
    /**
     * Get all child followers for a given teacher (paginated).
     *
     * @param int $teacherId
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public static function getTeacherFollowers(int $teacherId, QueryConfig $queryConfig): LengthAwarePaginator
    {
        $teacher = User::where('id', $teacherId)
            ->whereHas('roles', function ($q) {
                $q->where('name', RoleEnum::TEACHER->value);
            })
            ->firstOrFail();

        $query = User::query()
            ->whereHas('roles', function ($q) {
                $q->where('name', RoleEnum::CHILD->value);
            })
            ->whereIn('id', function ($sub) use ($teacher) {
                $sub->select('child_id')->from('teacher_followers')->where('teacher_id', $teacher->id);
            })
            ->with([
                'childProfile.level',
                'media' => function ($q) {
                    $q->where('tag', MediaTagEnum::AVATAR->value);
                },
            ]);

        User::applyFilters($queryConfig->getFilters(), $query);
        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        if ($queryConfig->getPaginated()) {
            return self::applyPagination($query->get(), $queryConfig);
        }
        
        return $query->get();
    }

    public static function indexUsersForAdmin(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = User::with(['roles', 'media', 'teacherProfile', 'teacherLevelMaterials.levelMaterial.level', 'teacherLevelMaterials.levelMaterial.material', 'parentProfile.children.level', 'parentProfile.children.user.media', 'parentProfile.children.user'])->newQuery();
        User::applyFilters($queryConfig->getFilters(), $query);
        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        if ($queryConfig->getPaginated()) {
            return self::applyPagination($query->get(), $queryConfig);
        }
        return $query->get();
    }

    public static function deleteUser(int $userId): void
    {
        $user = User::findOrFail($userId);
        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            TeacherLevelMaterial::where('teacher_id', $userId)->delete();
        }
        $user->delete();
    }

    public static function createStaff(array $data): User
    {
        $user = User::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => PhoneHelper::normalizeTunisiaPhone($data['phone'] ?? null),
            'password' => bcrypt($data['password']),
            'status' => UserStatusEnum::ACTIVE->value,
        ]);

        $staffRoleId = Role::query()->where('name', RoleEnum::STAFF->value)->value('id');

        $roleIds = (array) ($data['roles'] ?? []);

        if (!is_null($staffRoleId)) {
            $roleIds[] = $staffRoleId;
        }

        $allRoles = array_values(array_unique(array_filter($roleIds, fn($v) => !is_null($v))));
        if (!empty($allRoles)) {
            RoleRepository::assignRoleToUser($user, $allRoles);
        }

        if (!empty($data['avatar'])) {
            MediaRepository::uploadMedia(model: $user, path: $data['avatar'], disk: DiskEnum::S3->value, folder: 'users/avatars', tag: MediaTagEnum::AVATAR->value);
        }

        return $user;
    }

    public static function createTeacher(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'full_name' => $data['full_name'],
                'email' => $data['email'],
                'phone' => PhoneHelper::normalizeTunisiaPhone($data['phone'] ?? null),
                'password' => bcrypt($data['password']),
                'status' => UserStatusEnum::ACTIVE->value,
            ]);

            $user->assignRole(RoleEnum::TEACHER->value);

            if (!empty($data['avatar'])) {
                MediaRepository::uploadMedia(model: $user, path: $data['avatar'], disk: DiskEnum::S3->value, folder: 'users/avatars', tag: MediaTagEnum::AVATAR->value);
            }

            $user->teacherProfile()->create([
                'bio' => $data['bio'] ?? '',
                'about' => $data['about'] ?? '',
                'education' => $data['education'] ?? '',
                'experience' => $data['experience'] ?? '',
                'is_valid' => false,
                'is_valid_financial' => false,
            ]);

            if (!empty($data['level_materials']) && is_array($data['level_materials'])) {
                foreach ($data['level_materials'] as $levelMaterialId) {
                    TeacherLevelMaterial::create([
                        'teacher_id' => $user->id,
                        'level_material_id' => $levelMaterialId,
                    ]);
                }
            }

            if (!empty($data['level_section_materials']) && is_array($data['level_section_materials'])) {
                foreach ($data['level_section_materials'] as $levelSectionMaterialId) {
                    TeacherLevelSectionMaterial::create([
                        'teacher_id' => $user->id,
                        'level_section_material_id' => $levelSectionMaterialId,
                    ]);
                }
            }

            $user->load([
                'roles',
                'media',
                'teacherProfile',
                'teacherLevelMaterials.levelMaterial.level',
                'teacherLevelMaterials.levelMaterial.material',
                'teacherLevelSectionMaterials.levelSectionMaterial.levelSection.level',
                'teacherLevelSectionMaterials.levelSectionMaterial.levelSection.section',
                'teacherLevelSectionMaterials.levelSectionMaterial.material',
            ]);

            return $user;
        });
    }

    public static function createParent(array $data): User
    {
        $user = User::create([
            'full_name' => $data['fullName'],
            'email' => $data['email'],
            'phone' => PhoneHelper::normalizeTunisiaPhone($data['phone'] ?? null),
            'password' => bcrypt($data['password']),
            'status' => UserStatusEnum::ACTIVE->value,
        ]);

        $user->assignRole(RoleEnum::PARENT->value);

        if (!empty($data['avatar'])) {
            MediaRepository::uploadMedia(model: $user, path: $data['avatar'], disk: DiskEnum::S3->value, folder: 'users/avatars', tag: MediaTagEnum::AVATAR->value);
        }

        $user->parentProfile()->create([
            'address' => $data['address'] ?? '',
        ]);

        $user->load(['roles', 'media', 'parentProfile']);

        return $user;
    }

    /**
     * Get user by ID
     * @param int $userId
     * @return User
     * @throws \Exception
     */
    public static function getUserById(int $userId): User
    {
        $user = User::with(['roles', 'media'])->find($userId);

        if (!$user) {
            throw new \Exception(__('messages.user_not_found'), ResponseAlias::HTTP_NOT_FOUND);
        }

        return self::loadUserDetailRelations($user);
    }

    private static function loadUserDetailRelations(User $user): User
    {
        $relations = [];

        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            $relations = array_merge($relations, [
                'teacherProfile',
                'teacherLevelMaterials.levelMaterial:id,level_id,material_id',
                'teacherLevelMaterials.levelMaterial.level:id,name',
                'teacherLevelMaterials.levelMaterial.material:id,name',
                'teacherLevelSectionMaterials.levelSectionMaterial:id,level_section_id,material_id',
                'teacherLevelSectionMaterials.levelSectionMaterial.levelSection:id,level_id,section_id',
                'teacherLevelSectionMaterials.levelSectionMaterial.levelSection.level:id,name',
                'teacherLevelSectionMaterials.levelSectionMaterial.levelSection.section:id,name',
                'teacherLevelSectionMaterials.levelSectionMaterial.material:id,name',
            ]);
        }

        if ($user->hasRole(RoleEnum::PARENT->value)) {
            $relations = array_merge($relations, [
                'parentProfile.children',
                'parentProfile.children.user',
                'parentProfile.children.user.media',
                'parentProfile.children.level',
            ]);
        }

        if ($user->hasRole(RoleEnum::CHILD->value)) {
            $relations[] = 'childProfile.level';
        }

        if (!empty($relations)) {
            $user->load($relations);
        }

        return $user;
    }

    /**
     * Toggle user status (activate/deactivate)
     * @param int $userId
     * @param int $status
     * @return User
     * @throws \Exception
     */
    public static function toggleUserStatus(int $userId, int $status): User
    {
        $user = User::findOrFail($userId);
        
        if (!in_array($status, [UserStatusEnum::ACTIVE->value, UserStatusEnum::INACTIVE->value])) {
            throw new \Exception(__('messages.invalid_status'), ResponseAlias::HTTP_BAD_REQUEST);
        }
        
        if (Auth::check() && Auth::id() === $userId && $status === UserStatusEnum::INACTIVE->value) {
            throw new \Exception(__('messages.cannot_deactivate_self'), ResponseAlias::HTTP_FORBIDDEN);
        }
        
        $user->status = $status;
        $user->save();
        
        return $user->fresh(['roles', 'media']);
    }
}