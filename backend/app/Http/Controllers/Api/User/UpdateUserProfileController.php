<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Repositories\UserRepository;
use App\Traits\ErrorResponse;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Annotations as OA;

class UpdateUserProfileController extends Controller
{
    protected UserRepository $userRepository;
    use SuccessResponse, ErrorResponse;


    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

      /**
 * @OA\Post(
 *     path="/api/user/profile",
 *     summary="Update authenticated user's profile",
 *     description="Uses the shared profile update flow for self-updates. Admin, teacher, staff, parent, and child can update their own account, while role-specific fields are applied according to the authenticated user's role.",
 *     tags={"User"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 @OA\Property(property="target_user_id", type="integer", example=15),
 *                 @OA\Property(property="full_name", type="string", example="Sarah Teacher"),
 *                 @OA\Property(property="email", type="string", example="sarah@example.com"),
 *                 @OA\Property(property="phone", type="string", example="+21612345678"),
 *                 @OA\Property(property="avatar", type="string", format="binary"),
 *                 @OA\Property(property="remove_avatar", type="string", enum={"1"}, example="1"),
 *                 @OA\Property(property="bio", type="string", example="Experienced math teacher"),
 *                 @OA\Property(property="about", type="string", example="I love teaching"),
 *                 @OA\Property(property="education", type="string", example="Master in Education"),
 *                 @OA\Property(property="experience", type="string", example="10 years"),
 *                 @OA\Property(property="rib_file", type="string", format="binary"),
 *                 @OA\Property(property="cin_file", type="string", format="binary"),
 *                 @OA\Property(property="diploma_file", type="string", format="binary"),
 *                 @OA\Property(property="address", type="string", example="123 Rue El Manar"),
 *                 @OA\Property(property="gender", type="string", enum={"boy", "girl"}, example="girl"),
 *                 @OA\Property(property="level_id", type="integer", example=2),
 *                 @OA\Property(property="level_materials", type="array", @OA\Items(type="integer", example=1))
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Profile updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Profile updated successfully"),
 *             @OA\Property(property="user", type="object")
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validation error")
 * )
 */

    public function __invoke(UpdateProfileRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            $targetUserId = $data['target_user_id'] ?? null;
            unset($data['target_user_id']);
            $user = $this->userRepository->updateProfile($data, $targetUserId);

            DB::commit();

            return $this->returnSuccessResponse(__('messages.update_success'), $user, Response::HTTP_OK);
        } catch (QueryException $e) {
            DB::rollBack();
            $duplicateErrorResponse = $this->buildDuplicateConstraintErrorResponse($e);
            if ($duplicateErrorResponse) {
                return $duplicateErrorResponse;
            }

            return $this->returnErrorResponse($e->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Throwable $e) {

            DB::rollBack();
            
            $code = $e->getCode() ?: Response::HTTP_UNPROCESSABLE_ENTITY;
            return $this->returnErrorResponse($e->getMessage(), $code);
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
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

}
