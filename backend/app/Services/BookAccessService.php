<?php
namespace App\Services;

use App\Models\Book;
use App\Models\User;
use App\Enum\RoleEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class BookAccessService
{
    /**
     * Who can access book by ID
     * @param User $user 
     * @param Book $book
     * @return bool
     */
    public static function canAccess(User $user, Book $book): bool
    {
        if ($user->hasRole(RoleEnum::ADMIN->value)) {
            return true;
        }

        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            if ($book->user_id === $user->id) return true;
            if (!$book->user?->hasRole(RoleEnum::ADMIN->value)) return false;

            $teacherLMIds = $user->teacherLevelMaterials()->pluck('level_material_id')->toArray();
            if ($book->level_material_id && in_array($book->level_material_id, $teacherLMIds)) return true;

            $teacherLSMIds = $user->teacherLevelSectionMaterials()->pluck('level_section_material_id')->toArray();
            if ($book->level_section_material_id && in_array($book->level_section_material_id, $teacherLSMIds)) return true;

            return false;
        }

        if ($user->hasRole(RoleEnum::CHILD->value)) {
            return $book->levelMaterial?->level_id === $user->childProfile?->level_id;
        }

        if ($user->hasRole(RoleEnum::PARENT->value)) {
            $childLevelIds = $user->parentProfile?->children()->pluck('level_id')->filter()->toArray() ?? [];
            if (empty($childLevelIds)) return true;
            return in_array($book->levelMaterial?->level_id, $childLevelIds);
        }

        return false;
    }

    /**
     *  Who can store a book
     * @param User $user
     * @return bool
     */
    public static function canStore(User $user): bool
    {
        return $user->hasAnyRole([RoleEnum::ADMIN->value, RoleEnum::TEACHER->value]);
    }

    /**
     * Who can validate a book
     * @param User $user
     * @return bool
     */
    public static function requiresValidation(User $user): bool
    {
        return $user->hasRole(RoleEnum::TEACHER->value);
    }

    /**
     * Who can update a book
     * @param User $user
     * @param Book $book
     * @return bool
     *  
     */ 
    public static function canUpdate(User $user, Book $book): bool
    {
        return $user->hasRole(RoleEnum::ADMIN->value) || ($user->hasRole(RoleEnum::TEACHER->value) && $book->user_id === $user->id);
    }

    /**
     * Who can delete a book
     * @param User $user
     * @param Book $book
     * @return bool
     */
    public static function canDelete(User $user, Book $book): bool
    {
        return self::canUpdate($user, $book); // Same rule: own book + teacher, or admin
    }

    /**
     * Who can manage icons (upload, delete, etc.)
     * @param User $user
     * @param Book $book
     * @return bool
     */
    public static function canManageIcons(User $user, Book $book): bool
    {
        return self::canUpdate($user, $book); // Only for own books or admin
    }

    /**
     * Check if the user can access the list of books
     * @param User $user
     * @return bool
     */
    public static function applyVisibilityScope(Builder $query, ?User $user): Builder
    {
        if ($user === null) {
            return $query
                ->where('ingest_status', 'ready')
                ->whereHas('user', fn($q) => $q->role(RoleEnum::ADMIN->value));
        }

        if ($user->hasRole(RoleEnum::ADMIN->value)) {
            return $query;
        }

        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            // Collect all (level_id, material_id) pairs the teacher teaches,
            // from both architectures (direct LevelMaterial and LevelSectionMaterial).
            $pairs = collect();

            $user->teacherLevelMaterials()
                ->with('levelMaterial')
                ->get()
                ->each(function ($tlm) use (&$pairs) {
                    if ($tlm->levelMaterial) {
                        $pairs->push([
                            'level_id'    => $tlm->levelMaterial->level_id,
                            'material_id' => $tlm->levelMaterial->material_id,
                        ]);
                    }
                });

            $user->teacherLevelSectionMaterials()
                ->with('levelSectionMaterial.levelSection')
                ->get()
                ->each(function ($tlsm) use (&$pairs) {
                    if ($tlsm->levelSectionMaterial && $tlsm->levelSectionMaterial->levelSection) {
                        $pairs->push([
                            'level_id'    => $tlsm->levelSectionMaterial->levelSection->level_id,
                            'material_id' => $tlsm->levelSectionMaterial->material_id,
                        ]);
                    }
                });

            $pairs = $pairs->unique(fn($p) => $p['level_id'].'-'.$p['material_id'])->values();

return $query->where(function ($q) use ($user, $pairs) {
                $q->where('user_id', $user->id)
                  ->orWhere(function ($subQ) use ($pairs) {
                      $subQ->where('ingest_status', 'ready')
                           ->whereHas('user', fn($u) => $u->role(RoleEnum::ADMIN->value))
                           ->where(function ($matchQ) use ($pairs) {
                               foreach ($pairs as $pair) {
                                   $matchQ->orWhere(function ($pairQ) use ($pair) {
                                       $pairQ->where(function ($lmQ) use ($pair) {
                                           $lmQ->whereHas('levelMaterial', fn($q) =>
                                               $q->where('level_id', $pair['level_id'])
                                                 ->where('material_id', $pair['material_id'])
                                           );
                                       })->orWhere(function ($lsmQ) use ($pair) {
                                           $lsmQ->whereHas('levelSectionMaterial', fn($q) =>
                                               $q->where('material_id', $pair['material_id'])
                                                 ->whereHas('levelSection', fn($q2) =>
                                                     $q2->where('level_id', $pair['level_id'])
                                                 )
                                           );
                                       });
                                   });
                               }
                           });
                  });
            });
        }

        if ($user->hasRole(RoleEnum::CHILD->value)) {
            $levelId = $user->childProfile->level_id ?? null;
            return $levelId
                ? $query->where('ingest_status', 'ready')->whereHas('levelMaterial', fn($q) => $q->where('level_id', $levelId))
                : $query->whereRaw('0 = 1');
        }

        if ($user->hasRole(RoleEnum::PARENT->value)) {
            $childLevelIds = $user->parentProfile?->children()->pluck('level_id')->filter()->toArray() ?? [];
            if (empty($childLevelIds)) return $query;
            return $query->where('ingest_status', 'ready')->whereHas('levelMaterial', fn($q) => $q->whereIn('level_id', $childLevelIds));
        }

        return $query->whereRaw('0 = 1');
    }
}
