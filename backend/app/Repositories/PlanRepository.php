<?php
namespace App\Repositories;

use App\Enum\StatusEnum;
use App\Enum\PricingTypeEnum;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryConfig;
use App\Models\PlanPricing;
use App\Models\PlanAccessibleEntity;
use App\Models\User;
use App\Traits\PaginationParams;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PlanRepository
{
    use PaginationParams;

    /**
     * List all plans with optional filters, pagination, and sorting.
     * @param QueryConfig $queryConfig
     * @return LengthAwarePaginator|Collection
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */

    public static function index(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = Plan::with(['planPricings.materialPricings.material', 'translations', 'features.translations', 'level', 'accessibleEntities.accessible']);

        if ($filters = $queryConfig->getFilters()) {
            Plan::applyFilters($filters, $query);
        }

        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());
        return $queryConfig->getPaginated() ? $query->paginate($queryConfig->getPerPage()) : $query->get();
    }

    /**
     * Retrieve a single plan by ID.
     * This method fetches a plan along with its translations, features, and pricing details.
     * @param int $id
     * @return Plan|null
     */

    public static function show(int $id): ?Plan
    {
        return Plan::with(['planPricings.materialPricings.material', 'translations', 'features.translations', 'level', 'accessibleEntities.accessible'])->findOrFail($id);
    }
    /**
     * Store a plan with its relations
     * @param array $data
     * @return Plan
     */

    public static function store(array $data): Plan
    {
        $translations = $data['translations'] ?? [];
        $featureIds = $data['feature_ids'] ?? [];
        $pricings = $data['pricings'] ?? [];

        $plan = Plan::create([
            'is_popular' => $data['is_popular'] ?? false,
            'plan_type' => $data['plan_type'],
            'level_id' => $data['level_id'],
            'has_meeting' => $data['has_meeting'] ?? false,
            'creator_id' => auth()->id(),
        ]);

        if (!empty($featureIds)) {
            $plan->features()->sync($featureIds);
        }

        foreach ($translations as $translation) {
            $plan->translations()->create([
                'locale' => $translation['locale'],
                'text' => $translation['text'],
                'key' => $translation['key'] ?? 'title',
            ]);
        }

        foreach ($pricings as $pricing) {
            $planPricing = $plan->planPricings()->create([
                'months' => $pricing['months'],
                'price' => $pricing['price'] ?? 0,
                'discount' => $pricing['discount'] ?? 0,
                'is_highlighted' => $pricing['is_highlighted'] ?? false,
                'status' => $pricing['status'] ?? StatusEnum::ACTIVE->value,
                'start_date' => $pricing['start_date'] ?? null,
                'end_date' => $pricing['end_date'] ?? null,
                'pricing_type' => PricingTypeEnum::from($pricing['pricing_type'] ?? PricingTypeEnum::TOTAL->value),
            ]);

            if ($pricing['pricing_type'] === PricingTypeEnum::PER_MATERIAL->value && !empty($pricing['material_pricings'])) {
                foreach ($pricing['material_pricings'] as $materialPricing) {
                    $planPricing->materialPricings()->create([
                        'material_id' => $materialPricing['material_id'],
                        'price' => $materialPricing['price'],
                        'discount' => $materialPricing['discount'] ?? 0,
                    ]);
                }
            }
        }

        if (!empty($data['accessible_entities'])) {
            self::syncAccessibleEntities($plan, $data['accessible_entities']);
        }

        return $plan->load(['translations', 'features.translations', 'planPricings.materialPricings.material', 'level', 'accessibleEntities.accessible']);
    }

    public static function update(int $id, array $data): Plan
    {
        $plan = Plan::findOrFail($id);

        $translations = $data['translations'] ?? [];
        $featureIds = $data['feature_ids'] ?? [];
        $pricings = $data['pricings'] ?? [];

        $plan->update([
            'is_popular' => $data['is_popular'] ?? $plan->is_popular,
            'plan_type' => $data['plan_type'] ?? $plan->plan_type,
            'level_id' => $data['level_id'] ?? $plan->level_id,
        ]);

        if (!empty($featureIds)) {
            $plan->features()->sync($featureIds);
        }

        foreach ($translations as $translation) {
            $plan->translations()->updateOrCreate(
                [
                    'locale' => $translation['locale'],
                    'key' => $translation['key'] ?? 'title',
                ],
                ['text' => $translation['text']],
            );
        }

        if (!empty($pricings)) {
            $submittedIds = [];

            foreach ($pricings as $pricing) {
                if (isset($pricing['id'])) {
                    $existingPricing = $plan->planPricings()->find($pricing['id']);
                    if ($existingPricing) {
                        $existingPricing->update([
                            'months' => $pricing['months'],
                            'price' => $pricing['price'] ?? 0,
                            'discount' => $pricing['discount'] ?? 0,
                            'is_highlighted' => $pricing['is_highlighted'] ?? false,
                            'status' => $pricing['status'] ?? StatusEnum::ACTIVE->value,
                            'start_date' => $pricing['start_date'] ?? null,
                            'end_date' => $pricing['end_date'] ?? null,
                            'pricing_type' => PricingTypeEnum::from($pricing['pricing_type'] ?? PricingTypeEnum::TOTAL->value),
                        ]);

                        if (($pricing['pricing_type'] ?? PricingTypeEnum::TOTAL->value) === PricingTypeEnum::PER_MATERIAL->value) {
                            $existingPricing->materialPricings()->delete();

                            if (!empty($pricing['material_pricings'])) {
                                foreach ($pricing['material_pricings'] as $materialPricing) {
                                    $existingPricing->materialPricings()->create([
                                        'material_id' => $materialPricing['material_id'],
                                        'price' => $materialPricing['price'],
                                        'discount' => $materialPricing['discount'] ?? 0,
                                    ]);
                                }
                            }
                        }

                        $submittedIds[] = $pricing['id'];
                    }
                } else {
                    $newPricing = $plan->planPricings()->create([
                        'months' => $pricing['months'],
                        'price' => $pricing['price'] ?? 0,
                        'discount' => $pricing['discount'] ?? 0,
                        'is_highlighted' => $pricing['is_highlighted'] ?? false,
                        'status' => $pricing['status'] ?? StatusEnum::ACTIVE->value,
                        'start_date' => $pricing['start_date'] ?? null,
                        'end_date' => $pricing['end_date'] ?? null,
                        'pricing_type' => PricingTypeEnum::from($pricing['pricing_type'] ?? PricingTypeEnum::TOTAL->value),
                    ]);

                    if (($pricing['pricing_type'] ?? PricingTypeEnum::TOTAL->value) === PricingTypeEnum::PER_MATERIAL->value && !empty($pricing['material_pricings'])) {
                        foreach ($pricing['material_pricings'] as $materialPricing) {
                            $newPricing->materialPricings()->create([
                                'material_id' => $materialPricing['material_id'],
                                'price' => $materialPricing['price'],
                                'discount' => $materialPricing['discount'] ?? 0,
                            ]);
                        }
                    }

                    $submittedIds[] = $newPricing->id;
                }
            }

            $plan->planPricings()->whereNotIn('id', $submittedIds)->delete();
        }

        if (isset($data['accessible_entities'])) {
            self::syncAccessibleEntities($plan, $data['accessible_entities']);
        }

        return $plan->load(['translations', 'features.translations', 'planPricings.materialPricings.material', 'level', 'accessibleEntities.accessible']);
    }

    public static function destroy(int $id): bool
    {
        $plan = Plan::findOrFail($id);
        return $plan->delete();
    }

    /**
     * Retrieve specific plan details with all material and pricing logic.
     */
    public static function getPlanDetailsForChild(int $planId, int $levelId): Plan
    {
        return Plan::where('id', $planId)
            ->where('level_id', $levelId)
            ->with([
                'translations', 
                'features.translations', 
                'level',
                'planPricings' => function ($query) {
                    $query->where('status', StatusEnum::ACTIVE)
                        ->with('materialPricings.material');
                },
                'accessibleEntities' => function ($query) {
                    $query->with(['material', 'accessible']);
                }
            ])
            ->firstOrFail();
    }
    /**
     * Update the status of a plan pricing
     *
     * @param int $id
     * @return PlanPricing
     */
    public static function togglePlanPricingStatus(int $id): PlanPricing
    {
        $planPricing = PlanPricing::findOrFail($id);
        $newStatus = $planPricing->status === StatusEnum::ACTIVE ? StatusEnum::INACTIVE : StatusEnum::ACTIVE;
        $planPricing->status = $newStatus;
        $planPricing->save();
        return $planPricing;
    }

    public static function syncAccessibleEntities(Plan $plan, array $accessibleEntities): void
    {
        $plan->accessibleEntities()->delete();

        foreach ($accessibleEntities as $entity) {
            if (!empty($entity['accessible_type']) && !empty($entity['accessible_id'])) {
                $plan->accessibleEntities()->create([
                    'material_id' => $entity['material_id'],
                    'accessible_type' => $entity['accessible_type'],
                    'accessible_id' => $entity['accessible_id'],
                ]);
            }
        }
    }

    public static function getAccessibleEntitiesByType(int $planId, string $type): Collection
    {
        return PlanAccessibleEntity::where('plan_id', $planId)->where('accessible_type', $type)->with('accessible')->get();
    }

    /**
     * Duplicate an existing plan with all its configurations
     */
    public static function duplicatePlan(Plan $originalPlan, array $overrides = []): Plan
    {
        $newPlan = Plan::create(
            array_merge(
                [
                    'is_popular' => (bool) ($originalPlan->is_popular ?? false),
                    'plan_type' => $originalPlan->plan_type,
                    'level_id' => $originalPlan->level_id,
                    'has_meeting' => $originalPlan->has_meeting,
                    'creator_id' => auth()->id(),
                ],
                collect($overrides)->except('translations')->toArray(),
            ),
        );

        if (isset($overrides['translations']) && !empty($overrides['translations'])) {
            foreach ($overrides['translations'] as $translation) {
                $newPlan->translations()->create([
                    'locale' => $translation['locale'],
                    'key' => $translation['key'] ?? 'title',
                    'text' => $translation['text'],
                ]);
            }
        } else {
            foreach ($originalPlan->translations as $translation) {
                $newPlan->translations()->create([
                    'locale' => $translation->locale,
                    'key' => $translation->key,
                    'text' => $translation->text,
                ]);
            }
        }

        $newPlan->features()->sync($originalPlan->features->pluck('id'));

        foreach ($originalPlan->planPricings as $pricing) {
            $newPricing = $newPlan->planPricings()->create([
                'months' => $pricing->months,
                'price' => $pricing->price,
                'discount' => $pricing->discount,
                'status' => (string) ($pricing->status instanceof StatusEnum ? $pricing->status->value : $pricing->status),
                'is_highlighted' => $pricing->is_highlighted,
                'pricing_type' => (string) ($pricing->pricing_type instanceof PricingTypeEnum ? $pricing->pricing_type->value : $pricing->pricing_type),
                'start_date' => $pricing->start_date,
                'end_date' => $pricing->end_date,
            ]);

            foreach ($pricing->materialPricings as $materialPricing) {
                $newPricing->materialPricings()->create([
                    'material_id' => $materialPricing->material_id,
                    'price' => $materialPricing->price,
                    'discount' => $materialPricing->discount,
                ]);
            }
        }

        foreach ($originalPlan->accessibleEntities as $entity) {
            $newPlan->accessibleEntities()->create([
                'material_id' => $entity->material_id,
                'accessible_type' => $entity->accessible_type,
                'accessible_id' => $entity->accessible_id,
            ]);
        }

        return $newPlan;
    }

    /**
     * Retrieve plans with full pricing and content structure for child.
     */
    public static function indexPlansForChild(QueryConfig $queryConfig, $levelId): LengthAwarePaginator|Collection
    {
        $query = Plan::where('level_id', $levelId)
            ->with([
                'translations',
                'features.translations',
                'planPricings' => function ($query) {
                    $query->where('status', StatusEnum::ACTIVE->value)->with('materialPricings.material');
                },
                'accessibleEntities' => function ($query) {
                    $query->with(['material', 'accessible']);
                },
            ])
            ->newQuery();
        Plan::applyFilters($queryConfig->getFilters(), $query);
        if ($queryConfig->getPaginated()) {
            return self::applyPagination($query->get(), $queryConfig);
        }
        return $query->get();
    }
}
