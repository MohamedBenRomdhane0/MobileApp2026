<?php

namespace App\Repositories;

use App\Models\Level;
use App\Models\LevelSection;
use App\Models\LevelSectionMaterial;
use App\Models\Section;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Traits\PaginationParams;
use App\Helpers\QueryConfig;
use Illuminate\Support\Facades\DB;

class SectionRepository
{
    use PaginationParams;
    public static function indexAll(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = Section::query();
        Section::applyFilters($queryConfig->getFilters(), $query);
        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());
        return $queryConfig->getPaginated() ? self::applyPagination($query->get(), $queryConfig) : $query->get();
    }

    public static function indexByLevel(int $levelId): Collection
    {
        $level = Level::findOrFail($levelId);
        return $level->sections()->orderBy('name')->get();
    }

    public static function create(array $data): Section
    {
        return Section::create(['name' => $data['name']]);
    }

    public static function update(int $id, array $data): Section
    {
        $section = Section::findOrFail($id);
        $section->update(['name' => $data['name']]);
        return $section->refresh();
    }

    public static function delete(int $id): void
    {
        $section = Section::findOrFail($id);
        
        DB::beginTransaction();
        try {
            $levelSectionIds = $section->levelSections()->pluck('id')->toArray();
            if (!empty($levelSectionIds)) {
                LevelSectionMaterial::whereIn('level_section_id', $levelSectionIds)->delete();
            }
            
            $section->levelSections()->delete();
            
            $section->delete();
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public static function syncToLevel(int $levelId, array $sectionIds): void
    {
        $level = Level::findOrFail($levelId);
        $level->sections()->sync($sectionIds);

        // Auto-seed newly created level_sections with the level's materials
        $levelMaterialIds = $level->materials()->pluck('materials.id')->toArray();
        if (!empty($levelMaterialIds)) {
            foreach ($level->levelSections()->get() as $levelSection) {
                if ($levelSection->materials()->count() === 0) {
                    $levelSection->materials()->sync($levelMaterialIds);
                }
            }
        }
    }

    public static function assignMaterialsToLevelSection(int $levelSectionId, array $materialIds): LevelSection
    {
        $levelSection = LevelSection::findOrFail($levelSectionId);
        $levelSection->materials()->sync($materialIds);
        return $levelSection->load('section', 'materials.translations');
    }

}
