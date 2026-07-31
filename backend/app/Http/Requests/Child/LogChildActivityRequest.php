<?php

namespace App\Http\Requests\Child;

use Illuminate\Foundation\Http\FormRequest;

class LogChildActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action_type'  => ['required', 'string', 'in:navigation,book,course,meeting,video'],
            'screen_name'  => ['nullable', 'string', 'max:255'],
            'reference_id' => ['nullable', 'integer', 'min:1'],
            'duration'     => ['nullable', 'integer', 'min:0'],
            'created_at'   => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'action_type.required' => __('messages.validation_error'),
            'action_type.in'       => __('messages.validation_error'),
            'reference_id.min'     => __('messages.validation_error'),
            'duration.min'         => __('messages.validation_error'),
            'created_at.date'      => __('messages.validation_error'),
        ];
    }
}
