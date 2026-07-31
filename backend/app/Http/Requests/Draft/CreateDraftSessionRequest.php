<?php

namespace App\Http\Requests\Draft;

use Illuminate\Foundation\Http\FormRequest;

class CreateDraftSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'level_id' => 'required|integer|exists:levels,id',
        ];
    }
}
