<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\TeacherLevelMaterialRequest;
use App\Repositories\UserRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;
use Exception;
use Illuminate\Support\Facades\DB;

class SetTeacherLevelMaterialController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/teacher/level-materials",
     *     summary="Set level materials a teacher can teach",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="level_materials", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=3)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Level materials assigned successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Teaching levels and materials set successfully."),
     *             @OA\Property(property="teacher_id", type="integer", example=12)
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation Error"
     *     )
     * )
     */
    public function __invoke(TeacherLevelMaterialRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $result = $this->userRepository->setTeacherLevelMaterials($request->validated()['level_materials']);
            DB::commit();
            return $this->returnSuccessResponse($result['message'], ['teacher_id' => $result['teacher_id']], ResponseAlias::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error setting teacher level materials: ' . $e->getMessage());
            return $this->returnErrorResponse($e->getMessage() ?? __('general_error'), $e->getCode() ?? ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
