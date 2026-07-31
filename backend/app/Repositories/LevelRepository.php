<?php

namespace App\Repositories;

use App\Models\Level;
use App\Models\LevelMaterial;
use App\Models\LevelSectionMaterial;
use App\Helpers\QueryConfig;
use App\Traits\PaginationParams;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class LevelRepository
{
    use PaginationParams;

    public static function index(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = Level::with([
            'materials',
            'levelType',
            'translations',
            'levelSections' => fn ($q) => $q->whereHas('section'),
            'levelSections.section',
            'levelSections.materials.translations',
            'levelSections.levelSectionMaterials' => fn ($q) => $q->whereHas('material'),
            'levelSections.levelSectionMaterials.material.translations',
        ])->newQuery();
        Level::applyFilters($queryConfig->getFilters(), $query);
        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());
        return $queryConfig->getPaginated() ? self::applyPagination($query->get(), $queryConfig) : $query->get();
    }

    public static function create(array $data): Level
    {
        $level = Level::create([
            'name'          => $data['name'],
            'level_type_id' => $data['level_type_id'] ?? null,
        ]);

        if (array_key_exists('name_ar', $data)) {
            $level->setTranslation('name', 'ar', $data['name_ar']);
        }
        if (array_key_exists('name_fr', $data)) {
            $level->setTranslation('name', 'fr', $data['name_fr']);
        }

        if (isset($data['material_ids'])) {
            $level->materials()->sync($data['material_ids']);
        }

        return $level->load('levelType', 'translations');
    }

    public static function update(int $id, array $data): Level
    {
        $level = Level::findOrFail($id);
        $level->update([
            'name'          => $data['name'] ?? $level->name,
            'level_type_id' => $data['level_type_id'] ?? $level->level_type_id,
        ]);

        if (array_key_exists('name_ar', $data)) {
            $level->setTranslation('name', 'ar', $data['name_ar']);
        }
        if (array_key_exists('name_fr', $data)) {
            $level->setTranslation('name', 'fr', $data['name_fr']);
        }

        if (isset($data['material_ids'])) {
            $level->materials()->sync($data['material_ids']);
        }

        return $level->fresh(['levelType', 'translations', 'materials', 'levelSections.section', 'levelSections.materials.translations', 'levelSections.levelSectionMaterials.material.translations']);
    }

    public static function delete(int $id): void
    {
        $level = Level::findOrFail($id);
        
        DB::beginTransaction();
        try {
            $levelSectionIds = $level->levelSections()->pluck('id')->toArray();
            if (!empty($levelSectionIds)) {
                LevelSectionMaterial::whereIn('level_section_id', $levelSectionIds)->delete();
            }
            
            $level->levelSections()->delete();
            $level->materials()->detach();
            
            $level->delete();
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public static function indexLevelMaterials(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = LevelMaterial::with('level', 'material')->whereHas('level')->whereHas('material')->newQuery();
        LevelMaterial::applyFilters($queryConfig->getFilters(), $query);
        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());
        return $queryConfig->getPaginated() ? self::applyPagination($query->get(), $queryConfig) : $query->get();
    }
}
