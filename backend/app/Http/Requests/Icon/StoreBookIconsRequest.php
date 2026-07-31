<?php

namespace App\Http\Requests\Icon;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookIconsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => 'required|string',
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'icon_type' => 'required|string|in:video,link,image',
            'size' => 'sometimes|integer|min:1|max:1000',
            'title' => 'sometimes|nullable|string|max:255',
        ];
    }
    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'page.required' => __('validation.required', ['attribute' => 'page']),
            'page.integer' => __('validation.integer', ['attribute' => 'page']),
            'x.required' => __('validation.required', ['attribute' => 'x coordinate']),
            'x.numeric' => __('validation.numeric', ['attribute' => 'x coordinate']),
            'y.required' => __('validation.required', ['attribute' => 'y coordinate']),
            'y.numeric' => __('validation.numeric', ['attribute' => 'y coordinate']),
            'icon_type.required' => __('validation.required', ['attribute' => 'icon type']),
            'icon_type.string' => __('validation.string', ['attribute' => 'icon type']),
            'icon_type.in' => __('validation.in', ['attribute' => 'icon type']),
        ];
    }
}
