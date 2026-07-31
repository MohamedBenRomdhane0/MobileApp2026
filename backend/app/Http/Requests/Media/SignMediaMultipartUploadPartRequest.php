<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class SignMediaMultipartUploadPartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => ['required', 'string'],
            'uploadId' => ['required', 'string'],
            'partNumber' => ['required', 'integer', 'min:1'],
        ];
    }
}
