<?php

namespace App\Repositories;

use App\Models\Level;
use App\Models\LevelType;
use App\Models\LevelTypePeriod;
use App\Models\Section;
use Illuminate\Support\Facades\DB;

class LevelTypeRepository
{
    public static function create(array $data): LevelType
    {
        DB::beginTransaction();
        try {
            $levelType = LevelType::create([
                'name'  => $data['name'],
                'color' => $data['color'] ?? '#22BEC8',
            ]);

            if (!empty($data['name_ar'])) {
                $levelType->setTranslation('name', 'ar', $data['name_ar']);
            }
            if (!empty($data['name_fr'])) {
                $levelType->setTranslation('name', 'fr', $data['name_fr']);
            }

            DB::commit();
            return $levelType->load('periods')->refresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public static function update(int $id, array $data): LevelType
    {
        $levelType = LevelType::findOrFail($id);

        DB::beginTransaction();
        try {
            $levelType->update([
                'name'  => $data['name']  ?? $levelType->name,
                'color' => $data['color'] ?? $levelType->color,
            ]);

            if (array_key_exists('name_ar', $data)) {
                $levelType->setTranslation('name', 'ar', $data['name_ar'] ?? '');
            }
            if (array_key_exists('name_fr', $data)) {
                $levelType->setTranslation('name', 'fr', $data['name_fr'] ?? '');
            }

            DB::commit();
            return $levelType->load('periods')->refresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public static function saveCycle(array $data): LevelType
    {
        return DB::transaction(function () use ($data) {
            if (!empty($data['id'])) {
                $cycle = LevelType::findOrFail($data['id']);
                $cycle->update([
                    'name'  => $data['name'],
                    'color' => $data['color'] ?? $cycle->color,
                ]);
            } else {
                $cycle = LevelType::create([
                    'name'  => $data['name'],
                    'color' => $data['color'] ?? '#22BEC8',
                ]);
            }
            if (!empty($data['name_fr'])) $cycle->setTranslation('name', 'fr', $data['name_fr']);
            if (!empty($data['name_ar'])) $cycle->setTranslation('name', 'ar', $data['name_ar']);

            if (!empty($data['deleted_period_ids'])) {
                LevelTypePeriod::whereIn('id', $data['deleted_period_ids'])
                    ->where('level_type_id', $cycle->id)
                    ->delete();
            }

            foreach ($data['periods'] ?? [] as $i => $periodData) {
                if (!empty($periodData['id'])) {
                    LevelTypePeriod::findOrFail($periodData['id'])->update([
                        'name'  => $periodData['name'],
                        'from'  => $periodData['from'],
                        'to'    => $periodData['to'],
                        'order' => $periodData['order'] ?? $i,
                    ]);
                } else {
                    $cycle->periods()->create([
                        'name'  => $periodData['name'],
                        'from'  => $periodData['from'],
                        'to'    => $periodData['to'],
                        'order' => $periodData['order'] ?? $i,
                    ]);
                }
            }

            $sectionMap = [];
            foreach ($data['sections'] ?? [] as $sectionData) {
                if (!empty($sectionData['existing_id'])) {
                    $section = Section::findOrFail($sectionData['existing_id']);
                    $section->update(['name' => $sectionData['name']]);
                } else {
                    $section = Section::create(['name' => $sectionData['name']]);
                }
                $sectionMap[$sectionData['local_id']] = $section->id;
            }

            // Sync all wizard sections to the cycle-level pivot
            $cycle->sections()->sync(array_values($sectionMap));

            $resolveSection = function (string $localId) use ($sectionMap): ?int {
                if (isset($sectionMap[$localId])) return $sectionMap[$localId];
                return is_numeric($localId) ? (int) $localId : null;
            };

            if (!empty($data['deleted_section_ids'])) {
                $cycleLevelIds = $cycle->levels()->pluck('id');
                \App\Models\LevelSection::whereIn('section_id', $data['deleted_section_ids'])
                    ->whereIn('level_id', $cycleLevelIds)
                    ->delete();
                $cycle->sections()->detach($data['deleted_section_ids']);
                Section::whereIn('id', $data['deleted_section_ids'])->delete();
            }

            if (!empty($data['deleted_level_ids'])) {
                Level::whereIn('id', $data['deleted_level_ids'])
                    ->where('level_type_id', $cycle->id)
                    ->delete();
            }

            foreach ($data['levels'] ?? [] as $levelData) {
                if (!empty($levelData['id'])) {
                    $level = Level::findOrFail($levelData['id']);
                    $level->update([
                        'name'          => $levelData['name'],
                        'level_type_id' => $cycle->id,
                    ]);
                } else {
                    $level = Level::create([
                        'name'          => $levelData['name'],
                        'level_type_id' => $cycle->id,
                    ]);
                }

                $level->setTranslation('name', 'fr', $levelData['name']);
                $level->setTranslation('name', 'ar', $levelData['name']);

                $level->materials()->sync($levelData['material_ids'] ?? []);

                $realSectionIds = array_values(array_filter(
                    array_map($resolveSection, $levelData['section_local_ids'] ?? [])
                ));
                $level->sections()->sync($realSectionIds);

                foreach ($levelData['section_material_map'] ?? [] as $localSectionId => $matIds) {
                    $realSectionId = $resolveSection((string) $localSectionId);
                    if (!$realSectionId) continue;

                    $levelSection = $level->levelSections()
                        ->where('section_id', $realSectionId)
                        ->first();
                    if ($levelSection) {
                        $levelSection->materials()->sync($matIds);
                    }
                }

                foreach ($levelData['sharing_map'] ?? [] as $key => $group) {
                    $parts = explode('__', (string) $key, 2);
                    if (count($parts) !== 2) continue;
                    [$localSectionId, $materialId] = $parts;

                    $realSectionId = $resolveSection($localSectionId);
                    if (!$realSectionId) continue;

                    $levelSection = $level->levelSections()
                        ->where('section_id', $realSectionId)
                        ->first();
                    if (!$levelSection) continue;

                    $lsm = $levelSection->levelSectionMaterials()
                        ->where('material_id', (int) $materialId)
                        ->first();
                    if ($lsm) {
                        $lsm->update(['sharing_group' => $group ?: null]);
                    }
                }
            }

            return $cycle->load([
                'periods',
                'sections',
                'levels.materials',
                'levels.levelSections.section',
                'levels.levelSections.levelSectionMaterials.material',
                'levels.translations',
            ]);
        });
    }
}
