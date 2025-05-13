<?php

namespace App\Http\Requests\User;

use App\Enum\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;

class RegisterChildRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole(RoleEnum::PARENT->value);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'sexe' => 'required|in:male,female,other',
            'level_id' => 'required|exists:levels,id',
        ];
    }
}
