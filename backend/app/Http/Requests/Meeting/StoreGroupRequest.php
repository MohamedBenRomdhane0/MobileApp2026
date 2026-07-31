<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'sessions_per_week' => 'required|integer|min:1',
            'meeting_times' => 'required|array|min:1',
            'meeting_times.*.meeting_date' => 'required|date',
            'meeting_times.*.start_time' => 'required|string',
            'meeting_times.*.end_time' => 'required|string',
        ];
    }
}
