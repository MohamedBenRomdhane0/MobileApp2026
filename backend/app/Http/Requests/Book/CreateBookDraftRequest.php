<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateBookDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'level_material_id' => 'nullable|integer|exists:level_materials,id',
            'level_section_material_id' => 'nullable|integer|exists:level_section_materials,id',
            'level_id' => 'nullable|integer|exists:levels,id',
            'material_id' => 'nullable|integer|exists:materials,id',
            'title' => 'nullable|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'type' => 'nullable|integer',
            'user_id' => 'required|exists:users,id',
            'language' => 'nullable|string|max:10',
            'pages_total' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'level_material_id.integer' => __('validation.integer', ['attribute' => 'level material ID']),
            'level_material_id.exists' => __('validation.exists', ['attribute' => 'level material']),
            'title.string' => __('validation.string', ['attribute' => 'title']),
            'title.max' => __('validation.max.string', ['attribute' => 'title', 'max' => 255]),
            'type.integer' => __('validation.integer', ['attribute' => 'type']),
            'user_id.required' => __('validation.required', ['attribute' => 'user ID']),
            'user_id.exists' => __('validation.exists', ['attribute' => 'user']),
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => __('validation.error'),
            'errors' => $validator->errors(),
        ], 422));
    }
}
