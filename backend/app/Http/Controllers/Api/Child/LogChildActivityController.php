<?php

namespace App\Http\Controllers\Api\Child;

use App\Http\Controllers\Controller;
use App\Http\Requests\Child\LogChildActivityRequest;
use App\Repositories\ChildActivityRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class LogChildActivityController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __construct(private readonly ChildActivityRepository $repo)
    {
    }

    /**
     * @OA\Post(
     *   path="/api/child/activities",
     *   operationId="logChildActivityForAuthChild",
     *   tags={"Parent"},
     *   security={{"bearerAuth":{}}},
     *   summary="Log child activity for the authenticated child",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"action_type"},
     *       @OA\Property(property="action_type", type="string", enum={"navigation","book","course","meeting","video"}),
     *       @OA\Property(property="screen_name", type="string", nullable=true),
     *       @OA\Property(property="reference_id", type="integer", nullable=true),
     *       @OA\Property(property="duration", type="integer", nullable=true),
     *       @OA\Property(property="created_at", type="string", format="date-time", nullable=true)
     *     )
     *   ),
     *   @OA\Response(response=201, description="Created"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function __invoke(LogChildActivityRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $payload = $validated + [
            'child_id' => (int) $request->user()->id,
        ];

        $payload['created_at'] = !empty($payload['created_at'])
            ? Carbon::parse($payload['created_at'])->utc()
            : Carbon::now('UTC');

        $this->repo->create($payload);

        return $this->returnSuccessResponse(
            __('messages.success'),
            [],
            ResponseAlias::HTTP_CREATED
        );
    }
}
