<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateChildRequest;
use App\Repositories\AuthRepository;
use App\Traits\SuccessResponse;
use App\Traits\ErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Exception;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;

class CreateChildController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected AuthRepository $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

/**
     * @OA\Post(
     * path="/api/admin/children",
     * summary="Create a child account",
     * description="Allows an admin to create a child profile for a parent.",
     * tags={"Admin"},
     * security={{"bearerAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"full_name", "gender", "level_id", "parent_id"},
     * @OA\Property(property="full_name", type="string", example="Child Name"),
     * @OA\Property(property="level_id", type="integer", example=1),
     * @OA\Property(property="parent_id", type="integer", example=5, description="ID of the parent user"),
     * @OA\Property(
     * property="gender",
     * type="string",
     * enum={"boy","girl"},
     * example="boy"
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Child created successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Child account created successfully."),
     * @OA\Property(
     * property="data",
     * type="object",
     * @OA\Property(property="user", type="object")
     * )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="You do not have permission to perform this action.")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="The given data was invalid."),
     * @OA\Property(property="errors", type="object")
     * )
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Child creation failed.")
     * )
     * )
     * )
     */
    public function __invoke(CreateChildRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $result = $this->authRepository->createChild($request->validated());
            DB::commit();

            return $this->returnSuccessResponse(
                $result['message'],
                ['user' => $result['user']],
                ResponseAlias::HTTP_OK
            );
        } catch (Exception $e) {
            Log::error(__('messages.child_creation_failed') . $e->getMessage());
            DB::rollBack();
            return $this->returnErrorResponse(
                __('messages.child_creation_failed'),
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
