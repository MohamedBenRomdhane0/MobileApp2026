<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/admin/meetings",
 *     summary="Store a new meeting",
 *     tags={"Meeting"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name", "level_id", "material_id", "total_sessions"},
 *             @OA\Property(property="name", type="string", example="Mathematics Group Study"),
 *             @OA\Property(property="level_id", type="integer", example=1),
 *             @OA\Property(property="material_id", type="integer", example=2),
 *             @OA\Property(property="is_private", type="boolean", example=false),
 *             @OA\Property(property="max_students", type="integer", example=10, nullable=true),
 *             @OA\Property(property="has_free_trial", type="boolean", example=true),
 *             @OA\Property(property="total_sessions", type="integer", example=12),
 *             @OA\Property(property="price", type="number", format="float", example=99.99),
 *             @OA\Property(property="discount", type="number", format="float", example=10.00),
 *             @OA\Property(property="status", type="string", example="draft"),
 *             @OA\Property(property="timezone", type="string", example="Africa/Tunis")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Meeting created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Meeting created successfully"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
class StoreMeetingController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(StoreMeetingRequest $request)
    {
        try {
            DB::beginTransaction();
            $meeting = MeetingRepository::store($request->validated());
            DB::commit();
            return $this->returnSuccessResponse(
                __('messages.meeting_created'),
                $meeting,
                ResponseAlias::HTTP_CREATED
            );
        } catch (\Exception $exception) {
            Log::error($exception);
            DB::rollBack();
            
            if (str_contains($exception->getMessage(), 'duplicate')) {
                return $this->returnErrorResponse(
                    __('meeting.duplicate_meeting_exists'),
                    ResponseAlias::HTTP_CONFLICT
                );
            }
            
            return $this->returnErrorResponse(
                $exception->getMessage() ?:
                __('messages.server_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
