<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class CompleteMediaMultipartUploadRequest extends FormRequest
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
            'filename' => ['required', 'string', 'max:255'],
            'contentType' => ['required', 'string', 'max:255'],
            'size' => ['required', 'integer', 'min:1'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'parts' => ['required', 'array', 'min:1'],
            'parts.*.PartNumber' => ['required', 'integer', 'min:1'],
            'parts.*.ETag' => ['required', 'string'],
        ];
    }
}
