<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'is_private' => 'sometimes|boolean',
            'max_students' => 'sometimes|nullable|integer|min:1',
            'has_free_trial' => 'sometimes|boolean',
            'total_sessions' => 'sometimes|required|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
            'discount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:draft,published,cancelled',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'name.string' => __('validation.string', ['attribute' => 'name']),
            'name.max' => __('validation.max.string', ['attribute' => 'name', 'max' => 255]),
            'is_private.boolean' => __('validation.boolean', ['attribute' => 'is private']),
            'max_students.integer' => __('validation.integer', ['attribute' => 'max students']),
            'max_students.min' => __('validation.min.numeric', ['attribute' => 'max students', 'min' => 1]),
            'has_free_trial.boolean' => __('validation.boolean', ['attribute' => 'has free trial']),
            'total_sessions.required' => __('validation.required', ['attribute' => 'total sessions']),
            'total_sessions.integer' => __('validation.integer', ['attribute' => 'total sessions']),
            'total_sessions.min' => __('validation.min.numeric', ['attribute' => 'total sessions', 'min' => 1]),
            'price.numeric' => __('validation.numeric', ['attribute' => 'price']),
            'price.min' => __('validation.min.numeric', ['attribute' => 'price', 'min' => 0]),
            'discount.numeric' => __('validation.numeric', ['attribute' => 'discount']),
            'discount.min' => __('validation.min.numeric', ['attribute' => 'discount', 'min' => 0]),
            'status.string' => __('validation.string', ['attribute' => 'status']),
            'status.in' => __('validation.in', ['attribute' => 'status']),
        ];
    }
}
