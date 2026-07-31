<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;


class StoreBookRequest extends FormRequest
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
            'level_material_id' => 'nullable|integer|exists:level_materials,id',
            'level_section_material_id' => 'nullable|integer|exists:level_section_materials,id',
            'title' => 'nullable|string|max:255',
            'title_fr' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'type' => 'nullable|integer',
            'user_id' => 'required|exists:users,id',
            'media_file_path' => 'required|file|mimes:pdf|max:' . config('constants.MAX_FILE_SIZE'),
            //'cover_image' => 'required|image|max:' . config('constants.MAX_FILE_SIZE'),
        ];
    }

    public function messages(): array
    {
        return [
            'level_material_id.integer' => __('validation.integer', ['attribute' => 'level material ID']),
            'level_material_id.exists' => __('validation.exists', ['attribute' => 'level material']),
            'title.required' => __('validation.required', ['attribute' => 'title']),
            'title.string' => __('validation.string', ['attribute' => 'title']),
            'title.max' => __('validation.max.string', ['attribute' => 'title', 'max' => 255]),
            'type.integer' => __('validation.integer', ['attribute' => 'type']),
            'user_id.required' => __('validation.required', ['attribute' => 'user ID']),
            'user_id.exists' => __('validation.exists', ['attribute' => 'user']),
            'media_file_path.file' => __('validation.file', ['attribute' => 'media file path']),
            'media_file_path.mimes' => __('validation.mimes', ['attribute' => 'media file path']),
            'media_file_path.max' => __('validation.max.file', ['attribute' => 'media file path', 'max' => config('constants.MAX_FILE_SIZE')]),
            'cover_image.image' => __('validation.image', ['attribute' => 'cover image']),
            'cover_image.max' => __('validation.max.file', ['attribute' => 'cover image', 'max' => config('constants.MAX_FILE_SIZE')]),
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
