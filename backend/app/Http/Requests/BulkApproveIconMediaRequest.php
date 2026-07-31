<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkApproveIconMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'media_ids'   => ['required', 'array', 'min:1'],
            'media_ids.*' => ['required', 'integer', 'exists:media,id'],
        ];
    }
}
