<?php
namespace App\Repositories;

use App\Models\Material;
use App\Models\LevelSectionMaterial;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Helpers\QueryConfig;
use App\Models\Level;
use App\Traits\PaginationParams;
use Illuminate\Support\Facades\DB;

class MaterialRepository
{
    use PaginationParams;

    public static function index(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = Material::with(['translations', 'levels.levelType.translations']);
        Material::applyFilters($queryConfig->getFilters(), $query);
        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());
        return $queryConfig->getPaginated() ? self::applyPagination($query->get(), $queryConfig) : $query->get();
    }

    public static function create(array $data): Material
    {
        // Support both old format (name_fr/name_ar/name) and new dynamic translations format
        $translations = $data['translations'] ?? [];
        if (isset($data['name_fr'])) $translations['fr'] = $data['name_fr'];
        if (isset($data['name_ar'])) $translations['ar'] = $data['name_ar'];

        $defaultLocale = $data['default_locale'] ?? null;
        $baseName = $data['name']
            ?? ($defaultLocale && isset($translations[$defaultLocale]) ? $translations[$defaultLocale] : null)
            ?? $translations['fr']
            ?? $translations['en']
            ?? '';

        $material = Material::create([
            'name'  => $baseName,
            'color' => $data['color'] ?? '#00BFA5',
        ]);

        foreach ($translations as $locale => $value) {
            if ($value !== null && $value !== '') {
                $material->setTranslation('name', $locale, $value);
            }
        }

        return $material->load('translations');
    }

    public static function update(int $id, array $data): Material
    {
        $material = Material::findOrFail($id);

        $translations = $data['translations'] ?? [];
        if (isset($data['name_fr'])) $translations['fr'] = $data['name_fr'];
        if (isset($data['name_ar'])) $translations['ar'] = $data['name_ar'];

        $defaultLocale = $data['default_locale'] ?? null;
        $baseName = $data['name']
            ?? ($defaultLocale && isset($translations[$defaultLocale]) ? $translations[$defaultLocale] : null)
            ?? $material->name;

        $material->update([
            'name'  => $baseName,
            'color' => $data['color'] ?? $material->color,
        ]);

        foreach ($translations as $locale => $value) {
            if ($value !== null && $value !== '') {
                $material->setTranslation('name', $locale, $value);
            }
        }

        return $material->load('translations');
    }

    public static function delete(int $id): void
    {
        $material = Material::findOrFail($id);
        
        DB::beginTransaction();
        try {
            $material->levels()->detach();
            $material->levelSections()->detach();
            LevelSectionMaterial::where('material_id', $id)->delete();
            
            $material->delete();
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public static function assignToLevel(int $levelId, array $materialIds): void
    {
        Level::findOrFail($levelId)->materials()->sync($materialIds);
    }
}
