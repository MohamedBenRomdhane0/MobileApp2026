<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class CreateChildRequest extends FormRequest
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
            'parent_id' => ['nullable', 'integer', 'exists:users,id'],
            'full_name' => ['required', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'level_id' => ['required', 'integer', 'exists:levels,id'],
            'gender' => ['required', 'in:boy,girl'],
            'avatar' => ['nullable'],
        ];
    }
    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'full_name.required' => __('validation.required', ['attribute' => 'full name']),
            'level_id.required' => __('validation.required', ['attribute' => 'level']),
            'level_id.exists' => __('validation.exists', ['attribute' => 'level']),
            'gender.required' => __('validation.required', ['attribute' => 'gender']),
        ];
    }
}
