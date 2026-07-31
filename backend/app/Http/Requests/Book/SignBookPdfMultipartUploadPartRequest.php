<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SignBookPdfMultipartUploadPartRequest extends FormRequest
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
            'partNumber' => 'required|integer|min:1|max:10000',
        ];
    }

    public function messages(): array
    {
        return [
            'key.required' => __('validation.required', ['attribute' => 'key']),
            'key.string' => __('validation.string', ['attribute' => 'key']),
            'uploadId.required' => __('validation.required', ['attribute' => 'upload ID']),
            'uploadId.string' => __('validation.string', ['attribute' => 'upload ID']),
            'partNumber.required' => __('validation.required', ['attribute' => 'part number']),
            'partNumber.integer' => __('validation.integer', ['attribute' => 'part number']),
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
