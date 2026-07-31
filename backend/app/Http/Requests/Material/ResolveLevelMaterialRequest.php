<?php

namespace App\Http\Requests\Material;

use App\Models\ChildProfile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ResolveLevelMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (!$user || !method_exists($user, 'hasRole') || !$user->hasRole('child')) {
            return true;
        }

        $levelId = (int) $this->input('level_id');

        $childProfile = ChildProfile::query()
            ->where('user_id', (int) $user->id)
            ->first();

        if (!$childProfile) {
            return false;
        }

        return (int) $childProfile->level_id === $levelId;
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => __('messages.forbidden'),
            'data' => [],
        ], 403));
    }

    public function rules(): array
    {
        return [
            'level_id' => ['required', 'integer', 'min:1'],
            'material_id' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'level_id.required' => __('messages.validation_error'),
            'level_id.integer' => __('messages.validation_error'),
            'level_id.min' => __('messages.validation_error'),

            'material_id.required' => __('messages.validation_error'),
            'material_id.integer' => __('messages.validation_error'),
            'material_id.min' => __('messages.validation_error'),
        ];
    }
}
