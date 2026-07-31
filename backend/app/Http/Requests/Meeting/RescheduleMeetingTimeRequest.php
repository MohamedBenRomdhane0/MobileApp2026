<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class RescheduleMeetingTimeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'meeting_date' => 'required|date',
            'start_time'   => 'required|string',
            'end_time'     => 'required|string',
            'reason'       => 'nullable|string|max:500',
        ];
    }
}
