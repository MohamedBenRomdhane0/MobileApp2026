<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class SendResetCodeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $identifier = $this->input('identifier');

            $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
            $userExists = $isEmail ? \App\Models\User::where('email', $identifier)->exists() : \App\Models\User::where('phone', $identifier)->exists();

            if (!$userExists) {
                $validator->errors()->add('identifier', __('messages.user_not_found', ['identifier' => $identifier]));
            }
        });
    }

    public function authorize(): bool
    {
        return true;
    }
}
