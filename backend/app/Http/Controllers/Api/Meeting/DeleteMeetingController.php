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
 * @OA\Delete(
 *     path="/api/admin/meetings/{id}",
 *     summary="Delete a meeting",
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
 *         description="Meeting deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Meeting deleted successfully")
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
class DeleteMeetingController extends Controller
{
    use SuccessResponse, ErrorResponse;

    public function __invoke(int $id)
    {
        try {
            $deleted = MeetingRepository::delete($id);

            if (!$deleted) {
                return $this->returnErrorResponse(
                    __('messages.meeting_not_found'),
                    ResponseAlias::HTTP_NOT_FOUND
                );
            }

            return $this->returnSuccessResponse(
                __('messages.meeting_deleted_successfully'),
                null,
                ResponseAlias::HTTP_OK
            );
        } catch (\Throwable $exception) {
            Log::error($exception);
            return $this->returnErrorResponse(
                $exception->getMessage() ?? __('messages.general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
