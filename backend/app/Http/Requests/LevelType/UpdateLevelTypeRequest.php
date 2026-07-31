<?php

namespace App\Http\Requests\LevelType;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLevelTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'    => ['sometimes', 'string', 'max:255'],
            'name_ar' => ['nullable', 'string', 'max:255'],
            'name_fr' => ['nullable', 'string', 'max:255'],
            'color'   => ['sometimes', 'string', 'max:20'],
        ];
    }
}
