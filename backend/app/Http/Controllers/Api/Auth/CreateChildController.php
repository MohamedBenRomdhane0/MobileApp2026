<?php

namespace App\Http\Controllers\Api\Auth;

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
     *     path="/api/parent/create-child",
     *     summary="Create a child account",
     *     description="Allows a parent to create a child profile with a random avatar.",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"full_name", "gender", "level_id"},
     *             @OA\Property(property="full_name", type="string", example="Child A"),
     *             @OA\Property(property="level_id", type="integer", example=2),
     *             @OA\Property(
     *                 property="gender",
     *                 type="string",
     *                 enum={"boy","girl"},
     *                 example="boy"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Child created",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Child account created successfully."),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Max children limit reached"),
     *     @OA\Response(response=422, description="Validation error")
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
                ResponseAlias::HTTP_CREATED
            );
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Child creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            $statusCode = $e->getCode() && $e->getCode() >= 400 && $e->getCode() < 600
                ? $e->getCode()
                : ResponseAlias::HTTP_INTERNAL_SERVER_ERROR;

            return $this->returnErrorResponse(
                $e->getMessage() ?: __('messages.child_creation_failed'),
                $statusCode
            );
        }
    }
}
