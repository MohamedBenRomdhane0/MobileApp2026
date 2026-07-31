<?php

namespace App\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // You can add permission logic if needed
    }

    public function rules(): array
    {
        return [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:10000',
            'type' => 'nullable|integer',
            'level_material_id' => 'nullable|exists:level_materials,id',

            'media.id' => 'nullable|integer|exists:media,id',
            'media.file_name' => 'required_with:media|string|max:255',
            'media.file_path' => 'required_with:media|string|max:255',
            'media.mime_type' => 'required_with:media|string|max:255',
            'media.title' => 'nullable|string|max:255',
            'media.description' => 'nullable|string|max:1000',
            'media.size' => 'nullable|integer',

            'chapters' => 'nullable|array',
            'chapters.*.id' => 'nullable|integer|exists:course_chapters,id',
            'chapters.*.title' => 'required|string|max:255',
            'chapters.*.description' => 'nullable|string|max:1000',
            'chapters.*.order' => 'nullable|integer',
            'chapters.*.type' => 'nullable|integer',

            'chapters.*.media' => 'nullable|array',
            'chapters.*.media.*.media_id' => 'nullable|exists:media,id',
            'chapters.*.media.*.file_name' => 'required_without:chapters.*.media.*.media_id|string|max:255',
            'chapters.*.media.*.file_path' => 'required_without:chapters.*.media.*.media_id|string|max:255',
            'chapters.*.media.*.mime_type' => 'required_without:chapters.*.media.*.media_id|string|max:255',
            'chapters.*.media.*.title' => 'nullable|string|max:255',
            'chapters.*.media.*.description' => 'nullable|string|max:1000',
            'chapters.*.media.*.size' => 'nullable|integer',
        ];
    }
}
