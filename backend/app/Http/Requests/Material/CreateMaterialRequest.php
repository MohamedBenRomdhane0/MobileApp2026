<?php

namespace App\Http\Requests\Material;

use Illuminate\Foundation\Http\FormRequest;

class CreateMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'              => 'nullable|string|max:255',
            'name_ar'           => 'nullable|string|max:255',
            'name_fr'           => 'nullable|string|max:255',
            'color'             => 'required|string|max:20',
            'translations'      => 'nullable|array',
            'translations.*'    => 'nullable|string|max:255',
            'default_locale'    => 'nullable|string|max:10',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $data = $this->all();
            $hasName = !empty($data['name']) || !empty($data['name_fr']) || !empty($data['name_ar']);
            $hasTranslation = !empty($data['translations']) && count(array_filter($data['translations'])) > 0;
            if (!$hasName && !$hasTranslation) {
                $validator->errors()->add('translations', 'At least one language name is required.');
            }
        });
    }
}
