<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrialSetting;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Put(
 *     path="/api/admin/trial-settings",
 *     summary="Update trial settings configuration",
 *     description="Updates the free trial settings (admin only)",
 *     tags={"Admin - Trial Settings"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="free_trial_minutes", type="number", example=30, description="Free trial duration in minutes"),
 *             @OA\Property(property="trial_enabled", type="boolean", example=true, description="Enable or disable trial system")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Trial settings updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Trial settings updated"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="free_trial_seconds", type="integer"),
 *                 @OA\Property(property="free_trial_minutes", type="number"),
 *                 @OA\Property(property="trial_enabled", type="boolean"),
 *             )
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthorized"),
 *     @OA\Response(response=403, description="Forbidden - Admin only"),
 *     @OA\Response(response=422, description="Validation error"),
 *     @OA\Response(response=500, description="Server error")
 * )
 */
class UpdateTrialSettingsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'free_trial_minutes' => 'required|numeric|min:0|max:1440',
                'trial_enabled' => 'required|boolean',
            ]);

            $settings = TrialSetting::firstOrCreate(
                [],
                [
                    'free_trial_seconds' => 1200,
                    'trial_enabled' => true,
                ]
            );

            $freeTrialSeconds = (int) ($validated['free_trial_minutes'] * 60);

            $settings->update([
                'free_trial_seconds' => $freeTrialSeconds,
                'trial_enabled' => $validated['trial_enabled'],
            ]);

            Cache::forget('trial_settings');

            return $this->returnSuccessResponse(
                __('messages.trial_settings_updated'),
                [
                    'id' => $settings->id,
                    'free_trial_seconds' => $settings->free_trial_seconds,
                    'free_trial_minutes' => round($settings->free_trial_seconds / 60, 1),
                    'trial_enabled' => $settings->trial_enabled,
                    'updated_at' => $settings->updated_at,
                ],
                ResponseAlias::HTTP_OK
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->returnErrorResponse(
                $e->getMessage(),
                ResponseAlias::HTTP_UNPROCESSABLE_ENTITY
            );
        } catch (\Exception $e) {
            Log::error('Failed to update trial settings', [
                'error' => $e->getMessage(),
            ]);

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.trial_settings_update_failed'),
                $e->getCode() ?: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
