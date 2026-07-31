<?php

namespace App\Http\Requests\Draft;

use Illuminate\Foundation\Http\FormRequest;

class CompleteDraftSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent'              => 'required|array',
            'parent.full_name'    => 'required|string|max:255',
            'parent.phone'        => 'required|string|unique:users,phone',
            'parent.email'        => 'nullable|email|unique:users,email',
            'parent.password'     => 'required|string|min:6|confirmed',
            'parent.password_confirmation' => 'required|string',
            'child'               => 'required|array',
            'child.full_name'     => 'required|string|max:255',
            'child.gender'        => 'required|in:boy,girl',
            'child.age'           => 'required|integer|min:3|max:18',
        ];
    }
}
