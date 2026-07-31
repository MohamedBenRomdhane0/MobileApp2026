<?php

namespace App\Repositories;

use App\Models\TeacherBlockedSlot;
use Illuminate\Support\Collection;

class BlockedSlotRepository
{
    public static function index(int $teacherId, ?string $date = null): Collection
    {
        return TeacherBlockedSlot::where('teacher_id', $teacherId)
            ->when($date, fn($q) => $q->where('date', $date))
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();
    }

    public static function store(int $teacherId, array $data): TeacherBlockedSlot
    {
        return TeacherBlockedSlot::create([
            ...$data,
            'teacher_id' => $teacherId,
        ]);
    }

    public static function destroy(int $teacherId, int $id): void
    {
        TeacherBlockedSlot::where('teacher_id', $teacherId)->findOrFail($id)->delete();
    }
}
