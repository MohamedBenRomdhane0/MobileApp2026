<?php

namespace App\Http\Requests\Section;

use Illuminate\Foundation\Http\FormRequest;

final class SyncSectionsToLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'section_ids' => 'present|array',
            'section_ids.*' => 'integer|exists:sections,id',
        ];
    }
}
