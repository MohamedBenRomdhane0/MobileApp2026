<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class TeacherLevelSectionMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'level_section_materials' => 'required|array|min:1',
            'level_section_materials.*.id' => 'required|integer|exists:level_section_materials,id',
        ];
    }
}
