<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AbortBookPdfMultipartUploadRequest extends FormRequest
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
            'reason' => 'nullable|string|in:cancel,fail',
        ];
    }

    public function messages(): array
    {
        return [
            'key.required' => __('validation.required', ['attribute' => 'key']),
            'uploadId.required' => __('validation.required', ['attribute' => 'upload ID']),
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
