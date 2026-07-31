<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;
use Exception;

class GetTeacherLevelSectionMaterialsController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @OA\Get(
     *     path="/api/teacher/level-section-materials",
     *     summary="Get level section materials a teacher can teach",
     *     tags={"Level"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Teacher level section materials retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="level_section_material_id", type="integer", example=3),
     *                     @OA\Property(property="is_concours", type="boolean", example=false),
     *                     @OA\Property(property="level_section_material", type="object",
     *                         @OA\Property(property="id", type="integer", example=3),
     *                         @OA\Property(property="level_section", type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="level", type="object",
     *                                 @OA\Property(property="id", type="integer", example=1),
     *                                 @OA\Property(property="name", type="string", example="Primary Level")
     *                             ),
     *                             @OA\Property(property="section", type="object",
     *                                 @OA\Property(property="id", type="integer", example=1),
     *                                 @OA\Property(property="name", type="string", example="Mathematics")
     *                             )
     *                         ),
     *                         @OA\Property(property="material", type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="name", type="string", example="Algebra")
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Teacher not found"
     *     )
     * )
     */
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $teacherId = auth()->id();
            $levelSectionMaterials = $this->userRepository->getTeacherLevelSectionMaterials($teacherId);
            
            return $this->returnSuccessResponse(
                'Teacher level section materials retrieved successfully',
                $levelSectionMaterials,
                ResponseAlias::HTTP_OK
            );
        } catch (Exception $e) {
            return $this->returnErrorResponse(
                $e->getMessage() ?? __('general_error'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
