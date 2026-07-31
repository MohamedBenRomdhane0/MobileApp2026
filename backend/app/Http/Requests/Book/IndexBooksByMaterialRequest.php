<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class IndexBooksByMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'level_id'    => ['required', 'integer', 'exists:levels,id'],
            'material_id' => ['required', 'integer', 'exists:materials,id'],

            'keyword'     => ['nullable', 'string', 'max:255'],
            'type'        => ['nullable', 'string', 'max:50'],
        ];
    }
}
