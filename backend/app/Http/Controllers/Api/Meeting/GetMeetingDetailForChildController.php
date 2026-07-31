<?php

namespace App\Http\Controllers\Api\Meeting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\GetMeetingDetailForChildRequest;
use App\Http\Resources\MeetingDetailResource;
use App\Repositories\MeetingRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as ResponseAlias;
use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/child/meetings/{id}",
 *     summary="Get meeting details for authenticated child",
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
class GetMeetingDetailForChildController extends Controller
{
    public function __invoke(GetMeetingDetailForChildRequest $request, int $id): MeetingDetailResource|JsonResponse
    {
        $user = auth()->user();

        $meeting = MeetingRepository::findByIdForChild($id, $user);

        if (!$meeting) {
            return response()->json([
                'message' => __('messages.meeting_not_found'),
            ], ResponseAlias::HTTP_NOT_FOUND);
        }

        return (new MeetingDetailResource($meeting))->additional([
            'message' => __('messages.meeting.retrieved_successfully'),
        ]);
    }
}