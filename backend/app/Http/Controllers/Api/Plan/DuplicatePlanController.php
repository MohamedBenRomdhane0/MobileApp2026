<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Repositories\PlanRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DuplicatePlanController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request,$id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $plan = Plan::with(['translations', 'features', 'planPricings.materialPricings', 'accessibleEntities'])
                    ->findOrFail($id);

            $overrides = [];
            
            if ($request->has('name') && !empty($request->input('name'))) {
                $name = $request->input('name');
                $overrides['translations'] = [
                    ['locale' => 'ar', 'key' => 'title', 'text' => $name],
                    ['locale' => 'en', 'key' => 'title', 'text' => $name],
                    ['locale' => 'fr', 'key' => 'title', 'text' => $name],
                ];
            }

            $duplicatedPlan = PlanRepository::duplicatePlan($plan, $overrides);

            DB::commit();

            $duplicatedPlan->load([
                'level',
                'features.translations',
                'planPricings.materialPricings.material',
                'accessibleEntities.accessible',
                'translations'
            ]);

            return $this->returnSuccessResponse(
                __('messages.plan_duplicated'), 
                $duplicatedPlan, 
                ResponseAlias::HTTP_CREATED
            );

        } catch (Exception $e) {
            DB::rollBack();
            return $this->returnErrorResponse(
                $e->getMessage() ?? __('messages.general_error'), 
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
