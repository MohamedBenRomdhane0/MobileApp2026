<?php

namespace App\Repositories;

use App\Models\LevelTypePeriod;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class LevelTypePeriodRepository
{
    public static function indexByLevelType(int $levelTypeId): Collection
    {
        return LevelTypePeriod::where('level_type_id', $levelTypeId)
            ->orderBy('order')
            ->get();
    }

    public static function create(int $levelTypeId, array $data): LevelTypePeriod
    {
        $maxOrder = LevelTypePeriod::where('level_type_id', $levelTypeId)->max('order') ?? -1;

        return LevelTypePeriod::create([
            'level_type_id' => $levelTypeId,
            'name'          => $data['name'],
            'from'          => $data['from'],
            'to'            => $data['to'],
            'order'         => $maxOrder + 1,
        ]);
    }

    public static function update(int $periodId, array $data): LevelTypePeriod
    {
        $period = LevelTypePeriod::findOrFail($periodId);
        $period->update([
            'name'  => $data['name']  ?? $period->name,
            'from'  => $data['from']  ?? $period->from,
            'to'    => $data['to']    ?? $period->to,
            'order' => $data['order'] ?? $period->order,
        ]);
        return $period->refresh();
    }

    public static function delete(int $periodId): void
    {
        DB::beginTransaction();
        try {
            LevelTypePeriod::findOrFail($periodId)->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
