<?php

namespace App\Http\Requests\Child;

use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *   schema="StoreChildActivityRequest",
 *   type="object",
 *   required={"action_type"},
 *   @OA\Property(
 *     property="action_type",
 *     type="string",
 *     description="Type d'action",
 *     enum={"navigation","book","webinar","meeting","video"},
 *     example="video"
 *   ),
 *   @OA\Property(
 *     property="screen_name",
 *     type="string",
 *     nullable=true,
 *     example="ParentDashboardScreen"
 *   ),
 *   @OA\Property(
 *     property="reference_id",
 *     type="integer",
 *     nullable=true,
 *     example=55
 *   ),
 *   @OA\Property(
 *     property="duration",
 *     type="integer",
 *     nullable=true,
 *     example=120,
 *     description="Durée en secondes"
 *   ),
 *   @OA\Property(
 *     property="created_at",
 *     type="string",
 *     format="date-time",
 *     nullable=true,
 *     example="2025-11-13T10:31:00Z"
 *   )
 * )
 */
class StoreChildActivityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'action_type'  => ['required', 'in:navigation,book,webinar,meeting,video'],
            'screen_name'  => ['nullable', 'string'],
            'reference_id' => ['nullable', 'integer'],
            'duration'     => ['nullable', 'integer', 'min:0'],
            'created_at'   => ['nullable', 'date'],
            'child_id'     => ['sometimes', 'integer'],
        ];
    }
}
