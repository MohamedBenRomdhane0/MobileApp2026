<?php

namespace App\Http\Requests\Draft;

use Illuminate\Foundation\Http\FormRequest;

class CheckParentAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent'           => 'required|array',
            'parent.full_name' => 'required|string|max:255',
            'parent.phone'     => 'required|string|unique:users,phone',
            'parent.email'     => 'nullable|email|unique:users,email',
        ];
    }
}
