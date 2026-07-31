<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CompleteBookPdfMultipartUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => 'required|string',
            'uploadId' => 'required|string',
            'contentType' => 'required|string|max:255',
            'size' => 'required|integer|min:1',
            'parts' => 'required|array|min:1',
            'parts.*.PartNumber' => 'required|integer|min:1',
            'parts.*.ETag' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'key.required' => __('validation.required', ['attribute' => 'key']),
            'uploadId.required' => __('validation.required', ['attribute' => 'upload ID']),
            'contentType.required' => __('validation.required', ['attribute' => 'content type']),
            'size.required' => __('validation.required', ['attribute' => 'size']),
            'parts.required' => __('validation.required', ['attribute' => 'parts']),
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => __('validation.error'),
            'errors' => $validator->errors(),
        ], 422));
    }
}
