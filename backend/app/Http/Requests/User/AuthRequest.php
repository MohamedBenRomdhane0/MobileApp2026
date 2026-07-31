<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
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
            'email' => 'required_without:phone|email',
            'phone' => 'required_without:email',
            'password' => 'required',
        ];
    }

    public final function messages(): array
    {
        return [
            'email.required' => __('messages.email_required'),
            'email.email' => __('messages.email_email'),
            'password.required' => __('messages.password_required'),
        ];
    }
}
