<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $role = $this->route('role');

        return [
            'name'          => ['sometimes', 'string', 'max:100', 'unique:roles,name,' . $role->id],
            'permissions'   => ['sometimes', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ];
    }

    public function normalizedPermissions(): array
    {
        return $this->input('permissions', []);
    }
}
