<?php

namespace App\Http\Requests\Section;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLevelSectionSharingGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sharing_group' => ['nullable', 'string', 'size:1', 'regex:/^[A-F]$/'],
        ];
    }
}
