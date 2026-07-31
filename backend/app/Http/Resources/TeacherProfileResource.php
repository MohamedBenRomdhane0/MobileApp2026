<?php

namespace App\Http\Resources;

use App\Enum\MediaTagEnum;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class TeacherProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->resource;

        $profile = $user->relationLoaded('teacherProfile')
            ? $user->teacherProfile
            : $user->teacherProfile()->first();

        $mediaCollection = $user->relationLoaded('media')
            ? $user->media
            : $user->media()->whereIn('tag', [
                MediaTagEnum::AVATAR->value,
                MediaTagEnum::TEACHER_TRAILER->value,
            ])->get();

        $avatarMedia = collect($mediaCollection)->first(function ($media) {
            return ($media->tag ?? null) === MediaTagEnum::AVATAR->value;
        });

        if (!$avatarMedia) {
            $avatarMedia = collect($mediaCollection)->first();
        }

        $avatarUrl = $avatarMedia?->file_path ?? $avatarMedia?->thumbnail ?? null;

        $trailerMedia = collect($mediaCollection)->first(function ($media) {
            return ($media->tag ?? null) === MediaTagEnum::TEACHER_TRAILER->value;
        });

        $trailerUrl = $trailerMedia?->file_path ?? null;
        $trailerMimeType = $trailerMedia?->mime_type ?? null;
        $trailerThumbnail = $trailerMedia?->thumbnail ?? null;

        $teacherLevelMaterials = $user->relationLoaded('teacherLevelMaterials')
            ? $user->teacherLevelMaterials
            : $user->teacherLevelMaterials()
                ->with([
                    'levelMaterial.level:id,name',
                    'levelMaterial.material:id,name',
                ])
                ->get();

        $levels = collect($teacherLevelMaterials ?? [])
            ->map(function ($teacherLevelMaterial) {
                $level = $teacherLevelMaterial?->levelMaterial?->level;

                if (!$level) {
                    return null;
                }

                return [
                    'id' => (int) $level->id,
                    'name' => $level->name,
                    'name_ar' => $level->name ?? null,
                    'nameAr' => $level->name ?? null,
                ];
            })
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $materials = collect($teacherLevelMaterials ?? [])
            ->map(function ($teacherLevelMaterial) {
                $material = $teacherLevelMaterial?->levelMaterial?->material;

                if (!$material) {
                    return null;
                }

                return [
                    'id' => (int) $material->id,
                    'name' => $material->name,
                    'name_ar' => $material->name ?? null,
                    'nameAr' => $material->name ?? null,
                    'title' => $material->name,
                    'title_ar' => $material->name ?? null,
                    'titleAr' => $material->name ?? null,
                ];
            })
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $booksRelation = $user->relationLoaded('books')
            ? $user->books
            : $user->books()->get(['id', 'user_id', 'title']);

        $books = collect($booksRelation ?? [])
            ->map(function ($book) {
                return [
                    'id' => (int) $book->id,
                    'title' => $book->title,
                    'title_ar' => $book->title ?? null,
                    'titleAr' => $book->title ?? null,
                    'name' => $book->title,
                    'name_ar' => $book->title ?? null,
                    'nameAr' => $book->title ?? null,
                ];
            })
            ->values()
            ->all();

        $extraLessonsCount = Course::query()
            ->where('user_id', $user->id)
            ->where('status', 'published')
            ->count();

        $followersCount = array_key_exists('followers_count', $user->getAttributes())
            ? (int) $user->followers_count
            : (int) DB::table('teacher_followers')
                ->where('teacher_id', $user->id)
                ->count();

        $child = $request->user();

        $isFollowed = array_key_exists('is_followed', $user->getAttributes())
            ? (bool) $user->is_followed
            : ($child
                ? DB::table('teacher_followers')
                    ->where('teacher_id', $user->id)
                    ->where('child_id', $child->id)
                    ->exists()
                : false);

        $publishedLessonsCount = array_key_exists('published_lessons_count', $user->getAttributes())
            ? (int) $user->published_lessons_count
            : count($books) + $extraLessonsCount;

        $firstMaterial = collect($materials)->first();
        $subjectName = $firstMaterial['title_ar']
            ?? $firstMaterial['name_ar']
            ?? $firstMaterial['title']
            ?? $firstMaterial['name']
            ?? null;

        $experienceText = (string) ($profile?->experience ?? '');
        $yearsExperience = null;

        if (preg_match('/\d+/', $experienceText, $matches)) {
            $yearsExperience = (int) $matches[0];
        }

        $reviewsRelation = $user->relationLoaded('reviewsReceived')
            ? $user->reviewsReceived
            : $user->reviewsReceived()
                ->latest()
                ->with([
                    'child:id,full_name',
                    'child.childProfile:id,user_id,level_id',
                    'child.childProfile.level:id,name',
                ])
                ->take(20)
                ->get();

        $reviewsCount = array_key_exists('reviews_count', $user->getAttributes())
            ? (int) $user->reviews_count
            : (int) $user->reviewsReceived()->count();

        $ratingAverageRaw = array_key_exists('rating_average', $user->getAttributes())
            ? $user->rating_average
            : $user->reviewsReceived()->avg('rating');

        $ratingAverage = $ratingAverageRaw !== null
            ? round((float) $ratingAverageRaw, 1)
            : null;

        $reviews = collect($reviewsRelation ?? [])
            ->map(function ($review) {
                $reviewChild = $review->child;
                $level = $reviewChild?->childProfile?->level;

                return [
                    'id' => (int) $review->id,
                    'rating' => (int) $review->rating,
                    'comment' => (string) ($review->comment ?? ''),

                    'author_name' => $reviewChild?->full_name ?? '',
                    'authorName' => $reviewChild?->full_name ?? '',
                    'author_label' => $reviewChild?->full_name ?? '',
                    'authorLabel' => $reviewChild?->full_name ?? '',

                    'child_id' => (int) $review->child_id,

                    'level_id' => $level?->id ? (int) $level->id : null,
                    'levelId' => $level?->id ? (int) $level->id : null,
                    'level_name' => $level?->name ?? null,
                    'levelName' => $level?->name ?? null,

                    'created_at' => $review->created_at?->toISOString(),
                    'updated_at' => $review->updated_at?->toISOString(),
                ];
            })
            ->filter(function ($review) {
                return $review['rating'] > 0;
            })
            ->values()
            ->all();

        $myReviewModel = null;

        if ($child) {
            $myReviewModel = collect($reviewsRelation)->first(function ($review) use ($child) {
                return (int) $review->child_id === (int) $child->id;
            });

            if (!$myReviewModel) {
                $myReviewModel = $user->reviewsReceived()
                    ->where('child_id', $child->id)
                    ->first();
            }
        }

        $myReview = $myReviewModel
            ? [
                'id' => (int) $myReviewModel->id,
                'rating' => (int) $myReviewModel->rating,
                'comment' => (string) ($myReviewModel->comment ?? ''),
                'teacher_id' => (int) $myReviewModel->teacher_id,
                'child_id' => (int) $myReviewModel->child_id,
                'created_at' => $myReviewModel->created_at?->toISOString(),
                'updated_at' => $myReviewModel->updated_at?->toISOString(),
            ]
            : null;

        return [
            'id' => (int) $user->id,

            'full_name' => $user->full_name,
            'fullName' => $user->full_name,

            'about' => $profile?->about ?? '',
            'bio' => $profile?->bio ?? '',
            'education' => $profile?->education ?? '',
            'experience' => $profile?->experience ?? '',

            'teacher_profile' => [
                'about' => $profile?->about ?? '',
                'bio' => $profile?->bio ?? '',
                'education' => $profile?->education ?? '',
                'experience' => $profile?->experience ?? '',
            ],
            'teacherProfile' => [
                'about' => $profile?->about ?? '',
                'bio' => $profile?->bio ?? '',
                'education' => $profile?->education ?? '',
                'experience' => $profile?->experience ?? '',
            ],

            'avatar_url' => $avatarUrl,
            'avatarUrl' => $avatarUrl,
            'avatar' => $avatarUrl,

            'trailer_url' => $trailerUrl,
            'trailerUrl' => $trailerUrl,
            'trailer_mime_type' => $trailerMimeType,
            'trailerMimeType' => $trailerMimeType,
            'trailer_thumbnail' => $trailerThumbnail,
            'trailerThumbnail' => $trailerThumbnail,

            'subject_name' => $subjectName,
            'subjectName' => $subjectName,
            'material_name' => $subjectName,
            'materialName' => $subjectName,

            'followers_count' => $followersCount,
            'followersCount' => $followersCount,

            'students_count' => $followersCount,
            'studentsCount' => $followersCount,

            'is_followed' => $isFollowed,
            'isFollowed' => $isFollowed,

            'reviews_count' => $reviewsCount,
            'reviewsCount' => $reviewsCount,
            'ratings_count' => $reviewsCount,

            'rating_average' => $ratingAverage,
            'ratingAverage' => $ratingAverage,
            'avg_rating' => $ratingAverage,

            'reviews' => $reviews,

            'my_review' => $myReview,
            'myReview' => $myReview,

            'years_experience' => $yearsExperience,
            'yearsExperience' => $yearsExperience,

            'levels' => $levels,
            'materials' => $materials,
            'books' => $books,

            'extra_lessons_count' => $extraLessonsCount,

            'published_lessons_count' => $publishedLessonsCount,
            'publishedLessonsCount' => $publishedLessonsCount,
        ];
    }
}