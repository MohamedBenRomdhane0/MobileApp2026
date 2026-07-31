<?php
namespace App\Helpers;

use App\Models\User;
use Exception;

class AvatarHelper
{
    public static function getRandomUniqueAvatarPath(User $parent, string $gender): string
    {
        $genderFolder = $gender === 'girl' ? 'girls' : 'boys';
        $allAvatars = glob(storage_path("app/avatars/children/{$genderFolder}/*.png"));

        if (empty($allAvatars)) {
            throw new Exception("No avatar images found for gender '{$genderFolder}'");
        }

        $usedAvatars = $parent->parentProfile->children()->with('user.media')->get()->flatMap(fn($childProfile) => $childProfile->user?->media->pluck('file_path') ?? collect())->filter()->map(fn($path) => basename($path))->toArray();

        $availableAvatars = array_filter($allAvatars, fn($path) => !in_array(basename($path), $usedAvatars));

        if (empty($availableAvatars)) {
            throw new Exception("All avatar images for gender '{$genderFolder}' have been used");
        }

        return $availableAvatars[array_rand($availableAvatars)];
    }
}
