<?php

namespace App\Http\Requests\LevelTypePeriod;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLevelTypePeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'  => ['sometimes', 'string', 'max:255'],
            'from'  => ['sometimes', 'string', 'max:10'],
            'to'    => ['sometimes', 'string', 'max:10'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
