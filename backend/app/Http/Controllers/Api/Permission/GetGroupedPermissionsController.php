<?php

namespace App\Http\Controllers\Api\Permission;

use App\Enum\PermissionsEnum;
use App\Http\Controllers\Controller;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetGroupedPermissionsController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/admin/permissions/grouped",
     * summary="Get all permissions grouped by module",
     * description="Retrieves a list of all system permissions, organized by their respective modules (e.g., Users, Roles, Content).",
     * tags={"Roles and Permissions"},
     * security={{"bearerAuth":{}}},
     * @OA\Response(
     * response=200,
     * description="Permissions retrieved successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Permissions found"),
     * @OA\Property(
     * property="data",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="module", type="string", example="User Management"),
     * @OA\Property(
     * property="permissions",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="user_create")
     * )
     * )
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Unauthorized",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="You do not have permission to view permissions.")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Failed to fetch permissions.")
     * )
     * )
     * )
     */
    use SuccessResponse, ErrorResponse;

    public function __invoke(): JsonResponse
    {
        try {
            $allPermissions = Permission::where('guard_name', 'api')->get()->keyBy('name');

            $hiddenModules = ['teacher', 'finances', 'support', 'crm', 'marketing', 'quiz', 'ai'];

            $grouped = collect(PermissionsEnum::getPermissionsByModule())
                ->map(function (array $enumCases, string $moduleName) use ($allPermissions, $hiddenModules) {
                    $moduleKey = strtolower(explode('.', $enumCases[0]->value, 2)[0]);
                    if (in_array($moduleKey, $hiddenModules, true)) return null;
                    $actions = collect($enumCases)
                        ->map(function (PermissionsEnum $permEnum) use ($allPermissions) {
                            $found = $allPermissions->get($permEnum->value);
                            if (!$found) return null;
                            return [
                                'id'    => $found->id,
                                'value' => $permEnum->label(),
                            ];
                        })
                        ->filter()
                        ->values()
                        ->toArray();

                    if (empty($actions)) return null;

                    return [
                        'name'    => $moduleKey,
                        'actions' => $actions,
                    ];
                })
                ->filter()
                ->values()
                ->toArray();

            return $this->returnSuccessResponse(
                __('messages.found'),
                $grouped,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->returnErrorResponse(
                __('messages.fetch_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
