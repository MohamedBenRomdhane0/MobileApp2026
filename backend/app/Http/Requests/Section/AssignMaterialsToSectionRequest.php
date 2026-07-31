<?php

namespace App\Http\Requests\Section;

use Illuminate\Foundation\Http\FormRequest;

class AssignMaterialsToSectionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'material_ids'   => 'nullable|array',
            'material_ids.*' => 'integer|exists:materials,id',
        ];
    }
}
