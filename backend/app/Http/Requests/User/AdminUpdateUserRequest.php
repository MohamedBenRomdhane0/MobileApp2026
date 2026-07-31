<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id') ?? $this->route('childId');

        return [
            'full_name' => 'sometimes|string|max:255',
            'fullName' => 'sometimes|string|max:255',
            'email' => "sometimes|email|max:255|unique:users,email,{$userId}",
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'phone' => "sometimes|string|max:20|unique:users,phone,{$userId}",
            'avatar' => 'sometimes|nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'remove_avatar' => 'sometimes|string|in:1',
            'address' => 'sometimes|nullable|string|max:500',
            'bio' => 'sometimes|nullable|string|max:500',
            'about' => 'sometimes|nullable|string|max:1000',
            'education' => 'sometimes|nullable|string|max:500',
            'experience' => 'sometimes|nullable|string|max:500',
            'gender' => 'sometimes|string|in:boy,girl',
            'level_id' => 'sometimes|integer|exists:levels,id',
            'level_materials' => 'sometimes|array',
            'level_materials.*' => 'integer|exists:level_materials,id',
            'level_section_materials' => 'sometimes|array',
            'level_section_materials.*' => 'integer|exists:level_section_materials,id',
        ];
    }
}
