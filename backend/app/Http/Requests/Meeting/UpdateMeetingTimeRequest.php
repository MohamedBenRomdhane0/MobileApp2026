<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMeetingTimeRequest extends FormRequest
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
            'meeting_date' => 'sometimes|date',
            'start_time' => 'sometimes|string',
            'end_time' => 'sometimes|string',
        ];
    }

    public function messages(): array
    {
        return [
            'meeting_date.required' => __('meeting.meeting_date_required'),
            'start_time.required' => __('meeting.start_time_required'),
            'end_time.required' => __('meeting.end_time_required'),
        ];
    }
}
