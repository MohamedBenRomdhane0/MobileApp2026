<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Put(
 *     path="/api/admin/meetings/{id}",
 *     summary="Update a meeting",
 *     tags={"Meeting"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Meeting ID",
 *         required=true,
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", example="Updated Mathematics Group Study"),
 *             @OA\Property(property="level_id", type="integer", example=1),
 *             @OA\Property(property="material_id", type="integer", example=2),
 *             @OA\Property(property="is_private", type="boolean", example=false),
 *             @OA\Property(property="max_students", type="integer", example=15, nullable=true),
 *             @OA\Property(property="has_free_trial", type="boolean", example=true),
 *             @OA\Property(property="total_sessions", type="integer", example=15),
 *             @OA\Property(property="price", type="number", format="float", example=149.99),
 *             @OA\Property(property="discount", type="number", format="float", example=15.00),
 *             @OA\Property(property="status", type="string", example="published"),
 *             @OA\Property(property="timezone", type="string", example="Africa/Tunis")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Meeting updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Meeting updated successfully"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Meeting not found"
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
class UpdateMeetingController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(UpdateMeetingRequest $request, int $id)
    {
        try {
            DB::beginTransaction();
            $meeting = MeetingRepository::update($id, $request->validated());
            DB::commit();

            if (!$meeting) {
                return $this->returnErrorResponse(
                    __('messages.meeting_not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            return $this->returnSuccessResponse(
                __('messages.meeting_updated'),
                $meeting,
                ResponseAlias::HTTP_OK
            );
        } catch (\Throwable $exception) {
            Log::error($exception);
            DB::rollBack();
            return $this->returnErrorResponse($exception->getMessage(),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
