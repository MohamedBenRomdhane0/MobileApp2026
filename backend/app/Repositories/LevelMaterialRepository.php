<?php

namespace App\Repositories;

use App\Models\LevelMaterial;
use Illuminate\Support\Collection;

class LevelMaterialRepository
{
    public static function resolve(int $levelId, int $materialId): ?LevelMaterial
    {
        return LevelMaterial::query()
            ->with([
                'material:id,name',
                'level:id,name',
            ])
            ->where('level_id', $levelId)
            ->where('material_id', $materialId)
            ->first();
    }

    /**
     * List all materials for a level with level_material_id
     */
    public static function listByLevel(int $levelId): Collection
    {
        return LevelMaterial::query()
            ->with(['material:id,name,color'])
            ->where('level_id', $levelId)
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($lm) {
                return [
                    'level_material_id' => (int) $lm->id,
                    'level_id' => (int) $lm->level_id,
                    'material_id' => (int) $lm->material_id,
                    'material_name' => optional($lm->material)->name,
                    'material_name_fr' => optional($lm->material)->name_fr,
                    'material_name_ar' => optional($lm->material)->name_ar,
                    'material_color' => optional($lm->material)->color,
                ];
            });
    }
}
