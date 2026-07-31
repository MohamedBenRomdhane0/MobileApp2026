<?php

namespace App\Repositories;

use App\Helpers\QueryConfig;
use App\Models\PlanFeature;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class PlanFeatureRepository
{
    /**
     * @param QueryConfig $queryConfig
     * @return LengthAwarePaginator|Collection
     */
    public static function index(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $plansFeaturesQuery = PlanFeature::with(['translations'])->newQuery();

        PlanFeature::applyFilters($queryConfig->getFilters(), $plansFeaturesQuery);

        $plansFeaturesQuery->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        if ($queryConfig->getPaginated()) {
            return $plansFeaturesQuery->paginate($queryConfig->getPerPage());
        }
        return $plansFeaturesQuery->get();
    }

    /**
     * Create a new plan feature
     * @param array $data
     * @return PlanFeature
     */

    public static function store(array $data): PlanFeature
    {
        return DB::transaction(function () use ($data) {
            $translations = $data['translations'] ?? [];
            unset($data['translations']);

            $feature = PlanFeature::create(['is_available' => $data['is_available']]);

            foreach ($translations as $translation) {
                $feature->translations()->create([
                    'locale' => $translation['locale'],
                    'text' => $translation['text'],
                    'key' => $translation['key'],
                ]);
            }

            return $feature->load('translations');
        });
    }

    /**
     * Update a plan feature
     * @param PlanFeature $feature
     * @param array $data
     * @return PlanFeature
     */
    public static function update(PlanFeature $feature, array $data): PlanFeature
    {
        return DB::transaction(function () use ($feature, $data) {
            $translations = $data['translations'] ?? [];
            unset($data['translations']);

            $feature->update(['is_available' => $data['is_available']]);

            foreach ($translations as $translation) {
                $feature->translations()->updateOrCreate(
                    [
                        'locale' => $translation['locale'],
                        'key' => $translation['key'] ?? 'title'
                    ],
                    [
                        'text' => $translation['text']
                    ]
                );
            }

            return $feature->load('translations');
        });
    }
    /**
     * Delete a plan feature
     * @param PlanFeature $feature
     * @return bool
     */
    public static function destroy(PlanFeature $feature): bool
    {
        return DB::transaction(function () use ($feature) {
            $feature->translations()->delete();
            return $feature->delete();
        });
    }
}
