<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
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
            'title' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|nullable|integer',
            'level_section_material_id' => 'sometimes|nullable|integer|exists:level_section_materials,id',
            'level_id' => 'sometimes|nullable|integer|exists:levels,id',
            'material_id' => 'sometimes|nullable|integer|exists:materials,id',
            'cover_image' => 'sometimes|image|max:' . config('constants.MAX_FILE_SIZE'),
            'media_file_path' => 'sometimes|nullable|file|mimes:pdf|max:' . config('constants.MAX_FILE_SIZE'),
            'language' => 'sometimes|nullable|string|max:50',
            'price' => 'sometimes|nullable|numeric|min:0|max:99999.99',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => __('validation.title_required'),
            'title.string' => __('validation.title_string'),
            'title.max' => __('validation.title_max'),
            'type.integer' => __('validation.type_integer'),
            'level_material_id.integer' => __('validation.level_material_id_integer'),
            'level_material_id.exists' => __('validation.level_material_id_exists'),
        ];
    }
}
