<?php

namespace App\Repositories;

use App\Models\Course;
use App\Models\CourseUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CourseUpdateRequestRepository
{
    public static function submitUpdateRequest(int $courseId, array $payload): CourseUpdateRequest
    {
        return DB::transaction(function () use ($courseId, $payload) {
            return CourseUpdateRequest::create([
                'course_id' => $courseId,
                'user_id' => Auth::id(),
                'payload' => $payload,
            ]);
        });
    }

    public static function approve(int $requestId): Course
    {
        return DB::transaction(function () use ($requestId) {
            $request = CourseUpdateRequest::findOrFail($requestId);
            $course = $request->course;
            $data = $request->payload;

            $course->update([
                'title' => $data['title'] ?? $course->title,
                'description' => $data['description'] ?? $course->description,
                'type' => $data['type'] ?? $course->type,
                'level_material_id' => $data['level_material_id'] ?? $course->level_material_id,
            ]);

            if (!empty($data['media'])) {
                $course->media()->updateOrCreate(['id' => $data['media']['id'] ?? null], $data['media']);
            }

            if (!empty($data['chapters'])) {
                app(CourseRepository::class)->storeOrUpdateChapters($data['chapters'], $course);
            }

            $request->update([
                'status' => 'approved',
                'reviewed_by' => Auth::id(),
                'reviewed_at' => now(),
            ]);

            return $course->load(['media', 'chapters.media']);
        });
    }

    public static function reject(int $requestId, ?string $note = null): void
    {
        CourseUpdateRequest::findOrFail($requestId)->update([
            'status' => 'rejected',
            'admin_note' => $note,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);
    }
}
