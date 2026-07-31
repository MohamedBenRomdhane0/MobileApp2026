<?php

namespace App\Repositories;

use App\Enum\CourseStatusEnum;
use App\Enum\DiskEnum;
use App\Enum\MediaTagEnum;
use App\Enum\RoleEnum;
use App\Enum\StatusEnum;
use App\Enum\TranscodeStatusEnum;
use App\Helpers\QueryConfig;
use App\Models\Course;
use App\Models\CourseUpdateRequest;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CourseRepository
{
    /**
     * Store a course
     * @param array $data
     * @return Course
     */
    public static function store(array $data): Course
    {
        $user = Auth::user();

        $course = Course::create([
            'user_id'           => $user->id,
            'level_id'          => $data['level_id'],
            'material_id'       => $data['material_id'],
            'title'             => $data['title'] ?? null,
            'description'       => $data['description'] ?? null,
            'status'            => CourseStatusEnum::DRAFT->value,
        ]);

        if (!empty($data['media'])) {
            if (isset($data['media']['file']) && $data['media']['file'] instanceof UploadedFile) {
                $media = MediaRepository::uploadMedia(
                    model: $course,
                    path: $data['media']['file'],
                    disk: DiskEnum::S3->value,
                    folder: 'courses',
                    title: $data['media']['title'] ?? $course->title,
                    description: $data['media']['description'] ?? null,
                    tag: MediaTagEnum::OTHER->value
                );
                Log::info('Course media uploaded successfully', ['media_id' => $media->id, 'course_id' => $course->id]);
            }
        }

        if (!empty($data['chapters'])) {
            app(self::class)->storeOrUpdateChapters($data['chapters'], $course);
        }

        return $course->load(['media', 'chapters.media']);

    }

    public static function storeOrUpdateChapters(array $chapters, Course $course): void
    {
        $chapterIds = [];

        foreach ($chapters as $chapterData) {
            $chapter = null;

            if (!empty($chapterData['id'])) {
                $chapter = $course->chapters()->where('id', $chapterData['id'])->first();

                if ($chapter) {
                    $chapter->update([
                        'title'       => $chapterData['title'],
                        'description' => $chapterData['description'] ?? null,
                        'order'       => $chapterData['order'] ?? 0,
                    ]);
                }
            }

            if (!$chapter) {
                $chapter = $course->chapters()->create([
                    'title'       => $chapterData['title'],
                    'description' => $chapterData['description'] ?? null,
                    'order'       => $chapterData['order'] ?? 0,
                ]);
            }

            $chapterIds[] = $chapter->id;

            if (!empty($chapterData['media'])) {
                foreach ($chapterData['media'] as $mediaData) {
                    if (!empty($mediaData['media_id'])) {
                        $media = Media::find($mediaData['media_id']);
                        if ($media && is_null($media->model_id) && is_null($media->model_type)) {
                            $media->model()->associate($chapter);
                            $media->save();
                            Log::info('Associated existing media to chapter', ['media_id' => $media->id, 'chapter_id' => $chapter->id]);
                        }
                    } elseif (isset($mediaData['file']) && $mediaData['file'] instanceof UploadedFile) {
                        $media = MediaRepository::uploadMedia(
                            model: $chapter,
                            path: $mediaData['file'],
                            disk: DiskEnum::S3->value,
                            folder: 'chapters',
                            title: $mediaData['title'] ?? $chapter->title,
                            description: $mediaData['description'] ?? null,
                            tag: MediaTagEnum::CHAPTER_VIDEO->value
                        );

                        if (str_contains($mediaData['file']->getMimeType(), 'video/')) {
                            $media->metadata()->create([
                                'views'              => 0,
                                'watch_time'         => 0,
                                'transcoding_status' => TranscodeStatusEnum::PENDING->value,
                                'last_seen_at'       => now(),
                                'status'             => StatusEnum::ACTIVE->value,
                            ]);
                        }
                        Log::info('Chapter media uploaded successfully', ['media_id' => $media->id, 'chapter_id' => $chapter->id]);
                      
                    } else {
                        $media = $chapter->media()->create([
                            'file_name'   => $mediaData['file_name'] ?? null,
                            'mime_type'   => $mediaData['mime_type'] ?? null,
                            'file_path'   => $mediaData['file_path'] ?? null,
                            'title'       => $mediaData['title'] ?? null,
                            'description' => $mediaData['description'] ?? null,
                            'size'        => $mediaData['size'] ?? null,
                        ]);

                        if ($media && str_contains($mediaData['mime_type'] ?? '', 'video/')) {
                            $media->metadata()->create([
                                'views'              => 0,
                                'watch_time'         => 0,
                                'transcoding_status' => TranscodeStatusEnum::PENDING->value,
                                'last_seen_at'       => now(),
                                'status'             => StatusEnum::ACTIVE->value,
                            ]);
                        }
                    }
                }
            }
        }

        if (!empty($chapterIds)) {
            $course->chapters()->whereNotIn('id', $chapterIds)->delete();
        }
    }
    /**
     * Index courses
     * @param QueryConfig $queryConfig
     * @param User $user
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */

    public static function index(QueryConfig $queryConfig, User $user): LengthAwarePaginator|Collection
    {
    $query = Course::with(['media', 'chapters.media', 'level', 'material']);

    if ($user->hasRole(RoleEnum::TEACHER->value)) {
        $query->where('user_id', $user->id);

    } elseif ($user->hasRole(RoleEnum::CHILD->value)) {
        
        $childLevelId = $user->childProfile->level_id;
        
        $query->whereHas('level', function ($q) use ($childLevelId) {
            $q->where('id', $childLevelId);
        });
        $query->where('status', CourseStatusEnum::PUBLISHED->value);
    }

    Course::applyFilters($queryConfig->getFilters(), $query);

    $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

    return $queryConfig->isPaginated()
        ? $query->paginate($queryConfig->getPerPage())
        : $query->get();
}
    /**
     * Get course by id
     * @param int $id
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     */
    public static function findById(int $id): ?Course
    {
        $course = Course::where('id', $id)->with(['media', 'chapters.media', 'level', 'material'])->first();
        if (!$course) {
           throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('messages.not_found');
        }
        return $course;
    }
    /**  
     * Update a course
     * @param int $id
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     */
    public static function update(int $id, array $data): ?Course
    {
        $course = Course::find($id);
        if (!$course) {
            return null;
        }

        $course->update([
            'level_id'          => $data['level_id'] ?? $course->level_id,
            'material_id'       => $data['material_id'] ?? $course->material_id,
            'title'             => $data['title'] ?? $course->title,
            'description'       => $data['description'] ?? $course->description,
            'type'              => $data['type'] ?? $course->type,
        ]);

        if (!empty($data['media'])) {
            // Handle course media update/upload to S3
            if (isset($data['media']['file']) && $data['media']['file'] instanceof UploadedFile) {
                try {
                    // Delete existing media if any
                    $course->media()->delete();
                    
                    // Upload new media
                    $media = MediaRepository::uploadMedia(
                        model: $course,
                        path: $data['media']['file'],
                        disk: DiskEnum::S3->value,
                        folder: 'courses',
                        title: $data['media']['title'] ?? $course->title,
                        description: $data['media']['description'] ?? null,
                        tag: MediaTagEnum::OTHER->value
                    );
                    
                    Log::info('Course media updated successfully', ['media_id' => $media->id, 'course_id' => $course->id]);
                } catch (\Exception $e) {
                    Log::error('Failed to update course media', [
                        'course_id' => $course->id,
                        'error' => $e->getMessage(),
                        'file' => $data['media']['file']->getClientOriginalName()
                    ]);
                    // Continue without media - don't fail the course update
                }
            } else {
                // Handle legacy media data (fallback)
                $course->media()->updateOrCreate(
                    ['id' => $data['media']['id'] ?? null],
                    [
                        'file_name'   => $data['media']['file_name'] ?? null,
                        'mime_type'   => $data['media']['mime_type'] ?? null,
                        'file_path'   => $data['media']['file_path'] ?? null,
                        'title'       => $data['media']['title'] ?? null,
                        'description' => $data['media']['description'] ?? null,
                        'size'        => $data['media']['size'] ?? null,
                    ],
                );
            }
        }

        if (!empty($data['chapters'])) {
            app(self::class)->storeOrUpdateChapters($data['chapters'], $course);
        }

        return $course->load(['media', 'chapters.media']);
       
    }

    public static function submitUpdateRequestFromTeacher(int $courseId, array $data): CourseUpdateRequest
    {
        return CourseUpdateRequestRepository::submitUpdateRequest($courseId, $data);
    }

    /**
     * Delete a course
     * @param int $id
     * @return bool
     */
    public static function delete(int $id): bool
    {
        $course = Course::find($id);

        if (!$course) {
            return false;
        }

            $course->media()->each(function ($media) {
                $media->metadata()->delete();
                $media->delete();
            });

            $course->chapters()->each(function ($chapter) {
                $chapter->media()->delete();
                $chapter->delete();
            });

            return $course->delete();
    }
    
    /**
     * Validate a course
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     */
    public static function validateCourse(int $id): ?Course
    {
        $course = Course::find($id);

        if (!$course) {
            return null;
        }

            $updateRequest = CourseUpdateRequest::where('course_id', $id)
                ->where('status', 'pending')
                ->latest()
                ->first();

            if ($updateRequest) {
                $data = $updateRequest->payload;

                $course->update([
                    'title'             => $data['title'] ?? $course->title,
                    'description'       => $data['description'] ?? $course->description,
                    'type'              => $data['type'] ?? $course->type,
                    'level_id' => $data['level_id'] ?? $course->level_id,
                    'material_id' => $data['material_id'] ?? $course->material_id,
                ]);

                if (!empty($data['media'])) {
                    $course->media()->updateOrCreate(['id' => $data['media']['id'] ?? null], $data['media']);
                }

                if (!empty($data['chapters'])) {
                    app(self::class)->storeOrUpdateChapters($data['chapters'], $course);
                }

                $updateRequest->update([
                    'status'      => 'approved',
                    'reviewed_by' => auth()->id(),
                    'reviewed_at' => now(),
                ]);
            }

            $course->status = CourseStatusEnum::PUBLISHED->value;
            $course->save();

            return $course->load(['media', 'chapters.media']);
    }
}
