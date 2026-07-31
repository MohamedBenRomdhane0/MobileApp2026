<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChildDashboardResource;
use App\Services\ChildActivityAnalyticsService;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class GetChildDashboardController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __construct(private readonly ChildActivityAnalyticsService $analytics)
    {
    }

    /**
     * @OA\Get(
     *   path="/api/child/dashboard",
     *   operationId="childDashboard",
     *   tags={"Parent"},
     *   security={{"bearerAuth":{}}},
     *   summary="Dashboard KPIs for the authenticated child",
     *   @OA\Parameter(name="X-Timezone", in="header", required=false, @OA\Schema(type="string", example="Africa/Tunis")),
     *   @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $childId = (int) $user->id;
            $timezone = $this->getTimezone($request);
            $perPage = $this->getPerPage($request);

            $payload = $this->analytics->buildDashboardSummary(
                childId: $childId,
                tz: $timezone,
                perPage: $perPage
            );

            return $this->returnSuccessResponse(
                __('messages.success'),
                new ChildDashboardResource($payload),
                ResponseAlias::HTTP_OK
            );
        } catch (ModelNotFoundException $e) {
            return $this->returnErrorResponse(
                __('messages.not_found'),
                ResponseAlias::HTTP_NOT_FOUND
            );
        } catch (Exception $e) {
            Log::error('[GetChildDashboardController] Error building child dashboard', [
                'error' => $e->getMessage(),
                'exception' => $e,
            ]);

            return $this->returnErrorResponse(
                __('messages.fetch_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    private function getTimezone(Request $request): string
    {
        $tz = (string) ($request->header('X-Timezone') ?: config('app.timezone', 'UTC'));

        try {
            new \DateTimeZone($tz);
            return $tz;
        } catch (\Throwable) {
            return (string) config('app.timezone', 'UTC');
        }
    }

    private function getPerPage(Request $request): int
    {
        $defaultPerPage = (int) config('constants.PAGINATE.DEFAULT_PER_PAGE', 9);
        $perPage = (int) $request->query('per_page', $defaultPerPage);

        return max(1, min($perPage, 100));
    }
}
