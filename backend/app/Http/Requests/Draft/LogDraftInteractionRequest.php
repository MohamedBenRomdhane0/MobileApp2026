<?php

namespace App\Http\Requests\Draft;

use App\Enum\DraftInteractionEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LogDraftInteractionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(DraftInteractionEnum::values())],
        ];
    }
}
