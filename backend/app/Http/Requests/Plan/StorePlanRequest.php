<?php

namespace App\Http\Requests\Plan;

use App\Enum\PlanEnum;
use App\Enum\StatusEnum;
use App\Enum\PricingTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_popular' => ['required', 'boolean'],
            'plan_type' => ['required', 'string', Rule::in(PlanEnum::toArray())],
            'level_id' => ['required', 'integer', 'exists:levels,id'],
            'has_meeting' => ['required', 'boolean' ],
            'feature_ids' => ['nullable', 'array'],
            'feature_ids.*' => ['integer', 'exists:plan_features,id'],
            'translations' => ['required', 'array', 'min:1'],
            'translations.*.locale' => ['required', 'string', 'max:5'],
            'translations.*.text' => ['required', 'string'],
            'translations.*.key' => ['nullable', 'string'],
            'pricings' => ['nullable', 'array'],
            'pricings.*.months' => ['required', 'integer', 'min:1'],
            'pricings.*.price' => ['nullable', 'numeric', 'min:0'],
            'pricings.*.discount' => ['nullable', 'numeric', 'min:0'],
            'pricings.*.is_highlighted' => ['nullable', 'boolean'],
            'pricings.*.status' => ['nullable', Rule::in(StatusEnum::getValues())],
            'pricings.*.start_date' => ['nullable', 'date'],
            'pricings.*.end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'pricings.*.pricing_type' => ['required', 'string', Rule::in(PricingTypeEnum::toArray())],
            'pricings.*.material_pricings' => ['required_if:pricings.*.pricing_type,' . PricingTypeEnum::PER_MATERIAL->value, 'array'],
            'pricings.*.material_pricings.*.material_id' => ['required', 'integer', 'exists:materials,id'],
            'pricings.*.material_pricings.*.price' => ['required', 'numeric', 'min:0'],
            'pricings.*.material_pricings.*.discount' => ['nullable', 'numeric', 'min:0'],
            'accessible_entities' => ['nullable', 'array'],
            'accessible_entities.*.material_id' => ['required', 'integer', 'exists:materials,id'],
            'accessible_entities.*.accessible_type' => ['required', 'string'],
            'accessible_entities.*.accessible_id' => ['required', 'integer'],
        ];
    }
}
