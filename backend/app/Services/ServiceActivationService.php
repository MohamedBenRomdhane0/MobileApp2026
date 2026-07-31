<?php

namespace App\Services;

use App\Models\Level;
use App\Models\LevelMaterial;
use App\Models\LevelSection;
use App\Models\LevelSectionMaterial;
use App\Models\LevelServiceSetting;
use App\Models\LevelSectionServiceSetting;
use App\Models\LevelSectionMaterialServiceSetting;
use App\Models\LevelMaterialServiceSetting;
use App\Models\Service;
use Illuminate\Support\Collection;

class ServiceActivationService
{
    /**
     * Get all services with their effective toggle state for a given level.
     * Returns structured data ready for the activation matrix UI.
     *
     * For levels WITHOUT sections: structure is [service => [material => bool]]
     * For levels WITH sections:    structure is [service => [section => [material => bool]]]
     */
    public function getServicesForLevel(Level $level): array
    {
        $levelId = $level->id;
        $hasSection = $level->levelSections()->exists();

        $services = Service::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->filter(fn(Service $s) => $s->isAvailableForLevel($levelId))
            ->values();

        // Pre-load all toggle settings for this level in bulk
        $levelSettings = LevelServiceSetting::where('level_id', $levelId)
            ->get()
            ->keyBy('service_id');

        if ($hasSection) {
            return $this->buildWithSections($level, $services, $levelSettings);
        }

        return $this->buildWithoutSections($level, $services, $levelSettings);
    }

    private function buildWithSections(Level $level, Collection $services, Collection $levelSettings): array
    {
        $levelSections = $level->levelSections()
            ->with(['section', 'levelSectionMaterials.material'])
            ->get();

        $levelSectionIds = $levelSections->pluck('id');

        // Bulk-load section-level settings
        $sectionSettings = LevelSectionServiceSetting::whereIn('level_section_id', $levelSectionIds)
            ->get()
            ->groupBy('level_section_id')
            ->map(fn($rows) => $rows->keyBy('service_id'));

        // Bulk-load material-level settings
        $lsmIds = $levelSections->flatMap(fn($ls) => $ls->levelSectionMaterials->pluck('id'));
        $materialSettings = LevelSectionMaterialServiceSetting::whereIn('level_section_material_id', $lsmIds)
            ->get()
            ->groupBy('level_section_material_id')
            ->map(fn($rows) => $rows->keyBy('service_id'));

        $result = [];

        foreach ($services as $service) {
            $levelEnabled = isset($levelSettings[$service->id])
                ? $levelSettings[$service->id]->is_enabled
                : true; // default ON when no row exists

            $sectionsData = [];
            foreach ($levelSections as $levelSection) {
                $sectionEnabled = isset($sectionSettings[$levelSection->id][$service->id])
                    ? $sectionSettings[$levelSection->id][$service->id]->is_enabled
                    : true;

                $materialsData = [];
                foreach ($levelSection->levelSectionMaterials as $lsm) {
                    $materialEnabled = isset($materialSettings[$lsm->id][$service->id])
                        ? $materialSettings[$lsm->id][$service->id]->is_enabled
                        : true;

                    $materialsData[] = [
                        'level_section_material_id' => $lsm->id,
                        'material_id'               => $lsm->material_id,
                        'material_name'             => $lsm->material->name ?? null,
                        'material_color'            => $lsm->material->color ?? null,
                        'is_enabled'                => $materialEnabled,
                        // Effective = AND chain
                        'effective'                 => $levelEnabled && $sectionEnabled && $materialEnabled,
                    ];
                }

                $sectionsData[] = [
                    'level_section_id' => $levelSection->id,
                    'section_id'       => $levelSection->section_id,
                    'section_name'     => $levelSection->section->name ?? null,
                    'is_enabled'       => $sectionEnabled,
                    'effective'        => $levelEnabled && $sectionEnabled,
                    'materials'        => $materialsData,
                    'subjects_count'   => count($materialsData),
                ];
            }

            $result[] = [
                'service_id'   => $service->id,
                'slug'         => $service->slug,
                'name'         => $service->name,
                'icon'         => $service->icon,
                'color'        => $service->color,
                'is_enabled'   => $levelEnabled,
                'sections'     => $sectionsData,
                'subjects_count' => $levelSections->sum(fn($ls) => $ls->levelSectionMaterials->count()),
            ];
        }

        return $result;
    }

    private function buildWithoutSections(Level $level, Collection $services, Collection $levelSettings): array
    {
        $levelMaterials = LevelMaterial::where('level_id', $level->id)
            ->with('material')
            ->get();

        $levelMaterialIds = $levelMaterials->pluck('id');

        $materialSettings = LevelMaterialServiceSetting::whereIn('level_material_id', $levelMaterialIds)
            ->get()
            ->groupBy('level_material_id')
            ->map(fn($rows) => $rows->keyBy('service_id'));

        $result = [];

        foreach ($services as $service) {
            $levelEnabled = isset($levelSettings[$service->id])
                ? $levelSettings[$service->id]->is_enabled
                : true;

            $materialsData = [];
            foreach ($levelMaterials as $lm) {
                $materialEnabled = isset($materialSettings[$lm->id][$service->id])
                    ? $materialSettings[$lm->id][$service->id]->is_enabled
                    : true;

                $materialsData[] = [
                    'level_material_id' => $lm->id,
                    'material_id'       => $lm->material_id,
                    'material_name'     => $lm->material->name ?? null,
                    'material_color'    => $lm->material->color ?? null,
                    'is_enabled'        => $materialEnabled,
                    'effective'         => $levelEnabled && $materialEnabled,
                ];
            }

            $result[] = [
                'service_id'     => $service->id,
                'slug'           => $service->slug,
                'name'           => $service->name,
                'icon'           => $service->icon,
                'color'          => $service->color,
                'is_enabled'     => $levelEnabled,
                'materials'      => $materialsData,
                'subjects_count' => count($materialsData),
            ];
        }

        return $result;
    }

    /**
     * Toggle a service at the level level (top-level switch).
     */
    public function toggleLevelService(int $levelId, int $serviceId, bool $enabled): void
    {
        LevelServiceSetting::updateOrCreate(
            ['level_id' => $levelId, 'service_id' => $serviceId],
            ['is_enabled' => $enabled]
        );
    }

    /**
     * Toggle a service for a specific section within a level.
     */
    public function toggleLevelSectionService(int $levelSectionId, int $serviceId, bool $enabled): void
    {
        LevelSectionServiceSetting::updateOrCreate(
            ['level_section_id' => $levelSectionId, 'service_id' => $serviceId],
            ['is_enabled' => $enabled]
        );
    }

    /**
     * Toggle a service for a specific material within a section (level has sections).
     */
    public function toggleLevelSectionMaterialService(int $levelSectionMaterialId, int $serviceId, bool $enabled): void
    {
        LevelSectionMaterialServiceSetting::updateOrCreate(
            ['level_section_material_id' => $levelSectionMaterialId, 'service_id' => $serviceId],
            ['is_enabled' => $enabled]
        );
    }

    /**
     * Toggle a service for a specific material within a level (level has NO sections).
     */
    public function toggleLevelMaterialService(int $levelMaterialId, int $serviceId, bool $enabled): void
    {
        LevelMaterialServiceSetting::updateOrCreate(
            ['level_material_id' => $levelMaterialId, 'service_id' => $serviceId],
            ['is_enabled' => $enabled]
        );
    }

    /**
     * Check the effective state of a service for a given level_section_material.
     * AND-chain: level AND section AND material must all be enabled.
     */
    public function isEnabledForLevelSectionMaterial(int $levelSectionMaterialId, int $serviceId): bool
    {
        $lsm = LevelSectionMaterial::with('levelSection')->findOrFail($levelSectionMaterialId);
        $levelId = $lsm->levelSection->level_id;

        $levelSetting = LevelServiceSetting::where('level_id', $levelId)
            ->where('service_id', $serviceId)
            ->first();
        if ($levelSetting && !$levelSetting->is_enabled) return false;

        $sectionSetting = LevelSectionServiceSetting::where('level_section_id', $lsm->level_section_id)
            ->where('service_id', $serviceId)
            ->first();
        if ($sectionSetting && !$sectionSetting->is_enabled) return false;

        $materialSetting = LevelSectionMaterialServiceSetting::where('level_section_material_id', $levelSectionMaterialId)
            ->where('service_id', $serviceId)
            ->first();
        if ($materialSetting && !$materialSetting->is_enabled) return false;

        return true;
    }

    /**
     * Check the effective state of a service for a given level_material (no sections).
     */
    public function isEnabledForLevelMaterial(int $levelMaterialId, int $serviceId): bool
    {
        $lm = LevelMaterial::findOrFail($levelMaterialId);

        $levelSetting = LevelServiceSetting::where('level_id', $lm->level_id)
            ->where('service_id', $serviceId)
            ->first();
        if ($levelSetting && !$levelSetting->is_enabled) return false;

        $materialSetting = LevelMaterialServiceSetting::where('level_material_id', $levelMaterialId)
            ->where('service_id', $serviceId)
            ->first();
        if ($materialSetting && !$materialSetting->is_enabled) return false;

        return true;
    }
}
