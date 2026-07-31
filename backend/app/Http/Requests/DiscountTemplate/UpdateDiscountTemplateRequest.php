<?php

namespace App\Http\Requests\DiscountTemplate;

use App\Enum\DiscountBehaviorEnum;
use App\Enum\DiscountKindEnum;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDiscountTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                        => 'sometimes|required|string|max:100',
            'description'                 => 'nullable|string|max:255',
            'icon'                        => 'sometimes|required|string|max:30',
            'color'                       => 'sometimes|required|string|max:20',
            'behavior'                    => 'sometimes|required|in:' . implode(',', DiscountBehaviorEnum::toArray()),
            'behavior_config'             => 'nullable|array',
            'enabled'                     => 'boolean',
            'sort_order'                  => 'integer|min:0',

            'kinds'                       => 'sometimes|required|array|min:1',
            'kinds.*.kind'                => 'required_with:kinds|in:' . implode(',', DiscountKindEnum::toArray()),
            'kinds.*.is_default'          => 'boolean',
            'kinds.*.min_value'           => 'nullable|numeric|min:0',
            'kinds.*.max_value'           => 'nullable|numeric|min:0',
            'kinds.*.default_value'       => 'nullable|numeric|min:0',
        ];
    }
}
