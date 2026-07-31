<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreBookModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'      => 'nullable|string|max:255',
            'start_page' => 'required|integer|min:1',
            'end_page'   => 'required|integer|min:1|gte:start_page',
            'order'      => 'nullable|integer|min:0',
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => __('validation.error'),
            'errors'  => $validator->errors(),
        ], 422));
    }
}
