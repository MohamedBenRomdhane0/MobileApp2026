<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class TeacherLevelMaterialRequest extends FormRequest
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
            'level_materials' => 'required|array|min:1',
            'level_materials.*.id' => 'required|exists:level_materials,id',
        ];
    }

    public function messages(): array
    {
        return [
            'level_materials.required' => __('validation.required', ['attribute' => 'level materials']),
            'level_materials.array' => __('validation.array', ['attribute' => 'level materials']),
            'level_materials.min' => __('validation.min.array', ['attribute' => 'level materials', 'min' => 1]),
            'level_materials.*.id.required' => __('validation.required', ['attribute' => 'level material id']),
            'level_materials.*.id.exists' => __('validation.exists', ['attribute' => 'level material id']),
        ];
    }
}
