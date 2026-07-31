<?php

namespace App\Http\Requests\Meeting;

use App\Enum\BlockedSlotReasonEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBlockedSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'       => ['required', 'date_format:Y-m-d'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time'   => ['required', 'date_format:H:i', 'after:start_time'],
            'reason'     => ['nullable', Rule::in(BlockedSlotReasonEnum::getValues())],
        ];
    }
}
