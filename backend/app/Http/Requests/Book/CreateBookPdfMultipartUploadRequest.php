<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateBookPdfMultipartUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'filename' => 'required|string|max:255',
            'contentType' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'filename.required' => __('validation.required', ['attribute' => 'filename']),
            'filename.string' => __('validation.string', ['attribute' => 'filename']),
            'filename.max' => __('validation.max.string', ['attribute' => 'filename', 'max' => 255]),
            'contentType.required' => __('validation.required', ['attribute' => 'content type']),
            'contentType.string' => __('validation.string', ['attribute' => 'content type']),
            'contentType.max' => __('validation.max.string', ['attribute' => 'content type', 'max' => 255]),
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
