<?php

namespace App\Http\Requests\Material;

use Illuminate\Foundation\Http\FormRequest;

class AssignMaterialsToLevelRequest extends FormRequest
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
            'level_id' => 'required|integer|exists:levels,id',
            'material_ids' => 'required|array',
            'material_ids.*' => 'integer|exists:materials,id',
        ];
    }
}
