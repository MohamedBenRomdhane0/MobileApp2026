<?php

namespace App\Http\Requests\Plan;

use App\Enum\PlanEnum;
use App\Enum\StatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_popular' => ['sometimes', 'boolean'],
            'plan_type' => ['sometimes', 'string', Rule::in(PlanEnum::toArray())],
            'level_id' => ['sometimes', 'integer', 'exists:levels,id'],
            'feature_ids' => ['nullable', 'array'],
            'feature_ids.*' => ['integer', 'exists:plan_features,id'],
            'translations' => ['sometimes', 'array', 'min:1'],
            'translations.*.locale' => ['required', 'string', 'max:5'],
            'translations.*.text' => ['required', 'string'],
            'translations.*.key' => ['nullable', 'string'],
            'pricings' => ['sometimes', 'array'],
            'pricings.*.months' => ['sometimes', 'integer', 'min:1'],
            'pricings.*.price' => ['sometimes', 'numeric', 'min:0'],
            'pricings.*.discount' => ['nullable', 'numeric', 'min:0'],
            'pricings.*.is_highlighted' => ['nullable', 'boolean'],
            'pricings.*.status' => ['nullable', Rule::in(StatusEnum::getValues())],
            'pricings.*.start_date' => ['nullable', 'date'],
            'pricings.*.end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }
}
