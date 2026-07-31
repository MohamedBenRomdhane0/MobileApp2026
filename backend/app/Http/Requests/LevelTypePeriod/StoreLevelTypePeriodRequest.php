<?php

namespace App\Http\Requests\LevelTypePeriod;

use Illuminate\Foundation\Http\FormRequest;

class StoreLevelTypePeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'from' => ['required', 'string', 'max:10'],
            'to'   => ['required', 'string', 'max:10'],
        ];
    }
}
