<?php

namespace App\Http\Requests\Icon;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookIconRequest extends FormRequest
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
            'page.required' => __('validation.icons_page_required'),
            'page.integer' => __('validation.icons_page_integer'),
            'page.min' => __('validation.icons_page_min'),
            'x.required' => __('validation.icons_x_required'),
            'x.numeric' => __('validation.icons_x_numeric'),
            'y.required' => __('validation.icons_y_required'),
            'y.numeric' => __('validation.icons_y_numeric'),
            'icon_type.required' => __('validation.icons_icon_type_required'),
            'icon_type.string' => __('validation.icons_icon_type_string'),
            'icon_type.in' => __('validation.icons_icon_type_in'),
        ];
    }
}
