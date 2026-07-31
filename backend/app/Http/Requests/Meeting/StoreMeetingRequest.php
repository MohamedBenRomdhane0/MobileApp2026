<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'level_id' => 'required|integer|exists:levels,id',
            'material_id' => 'required|integer|exists:materials,id',
            'is_private' => 'boolean',
            'max_students' => 'nullable|integer|min:1',
            'has_free_trial' => 'boolean',
            'total_sessions' => 'required|integer|min:1',
            'price' => 'numeric|min:0',
            'discount' => 'numeric|min:0',
            'status' => 'string|in:draft,published,cancelled',
            'timezone' => 'string|max:50',
            'meeting_groups' => 'sometimes|array',
            'meeting_groups.*.name' => 'nullable|string|max:255',
            'meeting_groups.*.max_students' => 'nullable|integer|min:1',
            'meeting_groups.*.unit_price' => 'nullable|numeric|min:0',
            'meeting_groups.*.net_price' => 'nullable|numeric|min:0',
            'meeting_groups.*.start_date' => 'nullable|date',
            'meeting_groups.*.end_date' => 'nullable|date',
            'meeting_groups.*.preset' => 'nullable|string|max:255',
            'meeting_groups.*.sessions_per_week' => 'nullable|integer|min:1',
            'meeting_groups.*.sessions_per_day' => 'nullable|integer|min:1',
            'meeting_groups.*.meeting_times' => 'required|array',
            'meeting_groups.*.meeting_times.*.meeting_date' => 'required|date',
            'meeting_groups.*.meeting_times.*.start_time' => 'required|string',
            'meeting_groups.*.meeting_times.*.end_time' => 'required|string',
            'meeting_groups.*.meeting_times.*.duration' => 'nullable|integer|min:1',
            'meeting_groups.*.meeting_times.*.day_of_week' => 'nullable|integer|min:0|max:6',
            'meeting_groups.*.meeting_times.*.occurrence_in_day' => 'nullable|integer|min:1',
            'meeting_groups.*.promos' => 'nullable|array',
            'meeting_groups.*.promos.*.discount_template_id' => 'required_with:meeting_groups.*.promos|integer|exists:discount_templates,id',
            'meeting_groups.*.promos.*.kind' => 'required_with:meeting_groups.*.promos|string',
            'meeting_groups.*.promos.*.discount_value' => 'required_with:meeting_groups.*.promos|numeric|min:0',
            'meeting_groups.*.promos.*.condition_value' => 'nullable|numeric',
            'meeting_groups.*.promos.*.condition_unit' => 'nullable|string|max:50',
            'meeting_groups.*.promos.*.condition_start_date' => 'nullable|date',
            'meeting_groups.*.promos.*.condition_end_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => __('messages.meeting.name_required'),
            'name.string' => __('messages.meeting.name_string'),
            'name.max' => __('messages.meeting.name_max'),
            'level_id.required' => __('messages.meeting.level_id_required'),
            'level_id.integer' => __('messages.meeting.level_id_integer'),
            'level_id.exists' => __('messages.meeting.level_id_exists'),
            'material_id.required' => __('messages.meeting.material_id_required'),
            'material_id.integer' => __('messages.meeting.material_id_integer'),
            'material_id.exists' => __('messages.meeting.material_id_exists'),
            'is_private.boolean' => __('messages.meeting.is_private_boolean'),
            'max_students.integer' => __('messages.meeting.max_students_integer'),
            'max_students.min' => __('messages.meeting.max_students_min'),
            'has_free_trial.boolean' => __('messages.meeting.has_free_trial_boolean'),
            'total_sessions.required' => __('messages.meeting.total_sessions_required'),
            'total_sessions.integer' => __('messages.meeting.total_sessions_integer'),
            'total_sessions.min' => __('messages.meeting.total_sessions_min'),
            'price.numeric' => __('messages.meeting.price_numeric'),
            'price.min' => __('messages.meeting.price_min'),
            'discount.numeric' => __('messages.meeting.discount_numeric'),
            'discount.min' => __('messages.meeting.discount_min'),
            'status.string' => __('messages.meeting.status_string'),
            'status.in' => __('messages.meeting.status_in'),
            'timezone.string' => __('messages.meeting.timezone_string'),
            'timezone.max' => __('messages.meeting.timezone_max'),
            'meeting_groups.array' => __('messages.meeting.meeting_groups_array'),
            'meeting_groups.*.name.string' => __('messages.meeting.group_name_string'),
            'meeting_groups.*.name.max' => __('messages.meeting.group_name_max'),
            'meeting_groups.*.meeting_times.required' => __('messages.meeting.meeting_times_required'),
            'meeting_groups.*.meeting_times.array' => __('messages.meeting.meeting_times_array'),
            'meeting_groups.*.meeting_times.*.meeting_date.required' => __('messages.meeting.meeting_date_required'),
            'meeting_groups.*.meeting_times.*.meeting_date.date' => __('messages.meeting.meeting_date_date'),
            'meeting_groups.*.meeting_times.*.start_time.required' => __('messages.meeting.start_time_required'),
            'meeting_groups.*.meeting_times.*.start_time.string' => __('messages.meeting.start_time_string'),
            'meeting_groups.*.meeting_times.*.end_time.required' => __('messages.meeting.end_time_required'),
            'meeting_groups.*.meeting_times.*.end_time.string' => __('messages.meeting.end_time_string'),
        ];
    }
}
