<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class SwitchToChildRequest extends FormRequest
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
            'child_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
    public function messages(): array
    {
        return [
            'child_id.required' => 'Child ID is required.',
            'child_id.integer' => 'Child ID must be a number.',
            'child_id.exists' => 'The selected child does not exist.',
        ];
    }
}
