<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexMeetingsForChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'has_free_trial' => $this->normalizeBoolean($this->input('has_free_trial')),
            'pagination' => $this->normalizeBoolean($this->input('pagination')),
        ]);
    }

    public function rules(): array
    {
        return [
            'keyword' => ['nullable', 'string', 'max:255'],
            'material_id' => ['nullable', 'integer', 'exists:materials,id'],
            'teacher_id' => ['nullable', 'integer', 'exists:users,id'],
            'has_free_trial' => ['nullable', 'boolean'],

            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'pagination' => ['nullable', 'boolean'],

            'order_by' => [
                'nullable',
                'string',
                Rule::in(['id', 'name', 'price', 'created_at', 'updated_at']),
            ],
            'direction' => [
                'nullable',
                'string',
                Rule::in(['asc', 'desc']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'material_id.exists' => __('validation.exists', ['attribute' => 'material_id']),
            'teacher_id.exists' => __('validation.exists', ['attribute' => 'teacher_id']),
            'has_free_trial.boolean' => __('validation.boolean', ['attribute' => 'has_free_trial']),
            'pagination.boolean' => __('validation.boolean', ['attribute' => 'pagination']),
            'page.integer' => __('validation.integer', ['attribute' => 'page']),
            'per_page.integer' => __('validation.integer', ['attribute' => 'per_page']),
            'order_by.in' => __('validation.in', ['attribute' => 'order_by']),
            'direction.in' => __('validation.in', ['attribute' => 'direction']),
        ];
    }

    private function normalizeBoolean(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_bool($value)) {
            return $value;
        }

        if (is_int($value)) {
            return $value === 1;
        }

        if (is_string($value)) {
            $normalized = strtolower(trim($value));

            if (in_array($normalized, ['1', 'true', 'yes', 'on'], true)) {
                return true;
            }

            if (in_array($normalized, ['0', 'false', 'no', 'off'], true)) {
                return false;
            }
        }

        return $value;
    }
}