<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrialSetting;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/admin/trial-settings",
 *     summary="Get trial settings configuration",
 *     description="Retrieves the current free trial settings configured by admin",
 *     tags={"Admin - Trial Settings"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Trial settings retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Trial settings retrieved"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="free_trial_seconds", type="integer", example=1200),
 *                 @OA\Property(property="free_trial_minutes", type="number", example=20),
 *                 @OA\Property(property="trial_enabled", type="boolean", example=true),
 *             )
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized"),
 *     @OA\Response(response=403, description="Forbidden - Admin only"),
 *     @OA\Response(response=500, description="Server error")
 * )
 */
class GetTrialSettingsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $settings = TrialSetting::firstOrCreate(
                [],
                [
                    'free_trial_seconds' => 1200,
                    'trial_enabled' => true,
                ]
            );

            return $this->returnSuccessResponse(
                __('messages.trial_settings_retrieved'),
                [
                    'id' => $settings->id,
                    'free_trial_seconds' => $settings->free_trial_seconds,
                    'free_trial_minutes' => round($settings->free_trial_seconds / 60, 1),
                    'trial_enabled' => $settings->trial_enabled,
                    'created_at' => $settings->created_at,
                    'updated_at' => $settings->updated_at,
                ],
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error('Failed to get trial settings', [
                'error' => $e->getMessage(),
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.trial_settings_retrieval_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
