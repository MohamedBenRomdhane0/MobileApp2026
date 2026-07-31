<?php

namespace App\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
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
           // --- Course ---
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'level_id' => ['required', 'exists:levels,id'],
            'material_id' => ['required', 'exists:materials,id'],
            'media' => ['nullable', 'array'],
            'media.file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp', 'max:10240'],

            // --- Chapters ---
            'chapters' => ['nullable', 'array'],
            'chapters.*.title' => ['required', 'string'],
            'chapters.*.description' => ['nullable', 'string'],
            'chapters.*.order' => ['nullable', 'integer'],
            'chapters.*.media' => ['nullable', 'array'],
            'chapters.*.media.*.file' => ['nullable', 'file', 'mimes:mp4,mov,avi,pdf,png,jpeg,jpg,webp', 'max:512000'],
            'chapters.*.media.*.title' => ['nullable', 'string'],
        ];
    }
}
