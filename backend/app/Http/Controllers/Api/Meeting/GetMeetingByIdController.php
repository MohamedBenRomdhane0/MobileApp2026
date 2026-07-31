<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Repositories\MeetingRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/admin/meetings/{id}",
 *     summary="Get meeting by ID",
 *     tags={"Meeting"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Meeting ID",
 *         required=true,
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Meeting retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Meeting retrieved successfully"),
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
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
class GetMeetingByIdController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id)
    {
        try {
            $meeting = MeetingRepository::findById($id);

            if (!$meeting) {
                return $this->returnErrorResponse(
                    __('messages.meeting.not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            return $this->returnSuccessResponse(
                __('messages.meeting.retrieved_successfully'),
                $meeting,
                ResponseAlias::HTTP_OK
            );
        } catch (\Exception $exception) {
            Log::error($exception);
            return $this->returnErrorResponse(
                __('messages.error.server_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
