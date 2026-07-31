<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class UpdateProfileRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $filtered = array_filter($this->all(), function ($value) {
            return $value !== '' && $value !== null;
        });

        $this->replace($filtered);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $targetUserId = $this->input('target_user_id') ?: $this->user()?->id;

        return [
            'full_name' => 'sometimes|string|max:255',
            'target_user_id' => 'sometimes|integer|exists:users,id',
            'email' => "sometimes|email|unique:users,email,{$targetUserId}",
            'phone' => "sometimes|string|max:20|unique:users,phone,{$targetUserId}",
            'user_media' => 'sometimes|file|mimes:jpg,jpeg,png|max:2048',
            'bio' => 'sometimes|string',
            'about' => 'sometimes|string',
            'education' => 'sometimes|string',
            'experience' => 'sometimes|string',
            'cin_file' => 'sometimes|file|mimes:jpg,jpeg,png,pdf|max:4096',
            'rib_file' => 'sometimes|file|mimes:jpg,jpeg,png,pdf|max:4096',
            'diploma_file' => 'sometimes|file|mimes:jpg,jpeg,png,pdf|max:4096',
            'address' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:boy,girl',
            'level_id' => 'sometimes|integer|exists:levels,id',
            'deleted_media_ids' => 'sometimes|array',
            'current_password' => ['required_with:password', 'string'],
            'password' => ['nullable', 'string', 'min:6', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $isSelfTarget = !$this->filled('target_user_id') || (int) $this->input('target_user_id') === (int) $this->user()?->id;

            if ($isSelfTarget && $this->filled('password') && !$this->filled('current_password')) {
                $validator->errors()->add('current_password', __('validation.required'));
            }

            if ($isSelfTarget && $this->filled('password') && $this->filled('current_password')) {
                if (!Hash::check($this->input('current_password'), $this->user()->password)) {
                    $validator->errors()->add('current_password', __('validation.incorrect_current_password'));
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'current_password.required_with' => __('validation.required'),
            'password.confirmed' => __('validation.password_confirmation'),
            'password.regex' => __('validation.password_complexity'),
        ];
    }
}
