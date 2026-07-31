<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\GetParentRegistrationStatsRequest;
use App\Repositories\StatsRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class GetParentRegistrationStatsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    /**
     * @OA\Get(
     *     path="/api/admin/stats/parent-registrations",
     *     tags={"Admin"},
     *     summary="Get parent registration statistics",
     *     description="Retrieve parent registration statistics grouped by day, week, or month within a date range.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="start_date",
     *         in="query",
     *         required=true,
     *         description="Start date for statistics",
     *         @OA\Schema(type="string", format="date", example="2025-01-01")
     *     ),
     *     @OA\Parameter(
     *         name="end_date",
     *         in="query",
     *         required=true,
     *         description="End date for statistics",
     *         @OA\Schema(type="string", format="date", example="2025-01-31")
     *     ),
     *     @OA\Parameter(
     *         name="group_by",
     *         in="query",
     *         required=false,
     *         description="Grouping interval",
     *         @OA\Schema(type="string", enum={"day", "week", "month"}, example="day")
     *     ),
     *     @OA\Parameter(
     *         name="user_type",
     *         in="query",
     *         required=false,
     *         description="User type filter",
     *         @OA\Schema(type="string", example="parent")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Statistics retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Statistics retrieved"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error"
     *     )
     * )
     */
    public function __invoke(GetParentRegistrationStatsRequest $request): JsonResponse
    {
        try {
            $params = $this->getAttributes($request);
            $stats = StatsRepository::getUserRegistrationStats($params['start_date'], $params['end_date'], $params['group_by'] ?? 'day', $params['user_type'] ?? 'all');
            return $this->returnSuccessResponse('messages.stats_retrieved', $stats, ResponseAlias::HTTP_OK);
        } catch (\Exception $exception) {
            Log::error('Failed to retrieve parent registration stats: ' . $exception->getMessage());
            return $this->returnErrorResponse($exception->getMessage() ?: 'general_error', ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    private function getAttributes(GetParentRegistrationStatsRequest $request) :array
    {
        return $request->validated();
    }
}
