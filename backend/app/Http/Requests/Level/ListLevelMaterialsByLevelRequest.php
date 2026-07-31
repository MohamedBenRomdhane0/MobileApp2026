<?php

namespace App\Http\Requests\Level;

use App\Models\ChildProfile;
use Illuminate\Foundation\Http\FormRequest;

class ListLevelMaterialsByLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (!$user || !method_exists($user, 'hasRole') || !$user->hasRole('child')) {
            return true;
        }

        $levelId = (int) $this->route('levelId');

        $childProfile = ChildProfile::query()
            ->where('user_id', (int) $user->id)
            ->first();

        if (!$childProfile) {
            return false;
        }

        return (int) $childProfile->level_id === $levelId;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'levelId' => $this->route('levelId'),
        ]);
    }

    public function rules(): array
    {
        return [
            'levelId' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'levelId.required' => __('messages.validation_error'),
            'levelId.integer' => __('messages.validation_error'),
            'levelId.min' => __('messages.validation_error'),
        ];
    }
}
