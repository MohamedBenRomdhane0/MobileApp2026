<?php

namespace App\Http\Requests\Icon;

use Illuminate\Foundation\Http\FormRequest;

class DeleteBookIconsRequest extends FormRequest
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
            'icon_ids' => 'required|array|min:1',
            'icon_ids.*' => 'integer|exists:book_icons,id',

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
            'icon_ids.required' => __('validation.required', ['attribute' => 'icon IDs']),
            'icon_ids.array' => __('validation.array', ['attribute' => 'icon IDs']),
            'icon_ids.min' => __('validation.min.array', ['attribute' => 'icon IDs', 'min' => 1]),
            'icon_ids.*.integer' => __('validation.integer', ['attribute' => 'icon ID']),
            'icon_ids.*.exists' => __('validation.exists', ['attribute' => 'icon ID']),
        ];
    }
}
