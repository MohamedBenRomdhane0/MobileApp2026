<?php

namespace App\Http\Controllers\Api\Level;

use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\Log;

class GetTeacherLevelMaterialsController extends Controller
{
    use SuccessResponse, ErrorResponse;
    /**
     * Handle the incoming request to get teacher level materials.
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke(): JsonResponse
    {
        try {
            $teacherId = request()->user()->id;
            $materials = UserRepository::getTeacherLevelMaterials($teacherId);
            return $this->returnSuccessResponse(__('messages.level_materials_retrieved'),$materials,  ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error retrieving teacher level materials', [
                'teacher_id' => $teacherId,
                'error' => $e->getMessage(),
            ]);
            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
