<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\AdminUpdateUserRequest;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 * @OA\Post(
 *     path="/api/admin/users/{id}",
 *     summary="Admin updates a user profile",
 *     description="Uses the shared profile update flow. Admin can update parent, teacher, staff, and child accounts through a single admin endpoint and shared repository method.",
 *     tags={"Admin"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Target user ID",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 @OA\Property(property="full_name", type="string", example="User Name"),
 *                 @OA\Property(property="fullName", type="string", example="User Name"),
 *                 @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *                 @OA\Property(property="password", type="string", format="password", example="secret123"),
 *                 @OA\Property(property="phone", type="string", example="+21612345678"),
 *                 @OA\Property(property="avatar", type="string", format="binary"),
 *                 @OA\Property(property="remove_avatar", type="string", enum={"1"}, example="1"),
 *                 @OA\Property(property="address", type="string", example="123 Rue El Manar"),
 *                 @OA\Property(property="bio", type="string", example="Experienced teacher"),
 *                 @OA\Property(property="about", type="string", example="About teacher"),
 *                 @OA\Property(property="education", type="string", example="Master degree"),
 *                 @OA\Property(property="experience", type="string", example="10 years"),
 *                 @OA\Property(property="gender", type="string", enum={"boy","girl"}, example="boy"),
 *                 @OA\Property(property="level_id", type="integer", example=2),
 *                 @OA\Property(property="level_materials", type="array", @OA\Items(type="integer", example=1))
 *             )
 *         )
 *     ),
 *     @OA\Response(response=200, description="User updated successfully"),
 *     @OA\Response(response=404, description="User not found"),
 *     @OA\Response(response=422, description="Validation error")
 * )
 */
class AdminUpdateUserController extends Controller
{
    use SuccessResponse, ErrorResponse;

    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function __invoke(AdminUpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $user = $this->userRepository->updateProfile($request->validated(), $id);
            DB::commit();

            return $this->returnSuccessResponse(__('messages.update_success'), $user, ResponseAlias::HTTP_OK);
        } catch (QueryException $e) {
            DB::rollBack();
            $duplicateErrorResponse = $this->buildDuplicateConstraintErrorResponse($e);
            if ($duplicateErrorResponse) {
                return $duplicateErrorResponse;
            }

            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->returnErrorResponse($e->getMessage(), ResponseAlias::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function buildDuplicateConstraintErrorResponse(QueryException $e): ?JsonResponse
    {
        $sqlState = (string) ($e->errorInfo[0] ?? $e->getCode());
        if (!in_array($sqlState, ['23000', '23505'], true)) {
            return null;
        }

        $message = (string) ($e->errorInfo[2] ?? $e->getMessage());
        $errors = [];

        if (str_contains($message, 'users.users_phone_unique')) {
            $errors['phone'] = [__('messages.validation.phone_unique')];
        }

        if (str_contains($message, 'users.users_email_unique')) {
            $errors['email'] = [__('messages.validation.email_unique')];
        }

        if (empty($errors)) {
            return null;
        }

        return response()->json([
            'message' => __('messages.validation_error'),
            'errors' => $errors,
        ], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY);
    }
}
