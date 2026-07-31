<?php

namespace App\Http\Requests\LevelType;

use App\Models\CeoSetting;
use Illuminate\Foundation\Http\FormRequest;

class SaveCycleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'                                    => 'nullable|integer|exists:level_types,id',
            'name'                                  => 'required|string|max:255',
            'name_fr'                               => 'nullable|string|max:255',
            'name_ar'                               => 'nullable|string|max:255',
            'color'                                 => 'nullable|string|max:30',
            'ceo_code'                              => ['required', 'string', function ($_, $value, $fail) {
                $setting = CeoSetting::instance();
                if (!$setting || !$setting->verify($value)) {
                    $fail(__('messages.invalid_ceo_code'));
                }
            }],

            'periods'                               => 'nullable|array',
            'periods.*.id'                          => 'nullable|integer|exists:level_type_periods,id',
            'periods.*.name'                        => 'required|string|max:255',
            'periods.*.from'                        => 'required|string|max:10',
            'periods.*.to'                          => 'required|string|max:10',
            'periods.*.order'                       => 'nullable|integer',
            'deleted_period_ids'                    => 'nullable|array',
            'deleted_period_ids.*'                  => 'integer|exists:level_type_periods,id',

            'sections'                              => 'nullable|array',
            'sections.*.local_id'                   => 'required|string',
            'sections.*.name'                       => 'required|string|max:255',
            'sections.*.existing_id'                => 'nullable|integer|exists:sections,id',

            'levels'                                => 'nullable|array',
            'levels.*.id'                           => 'nullable|integer|exists:levels,id',
            'levels.*.name'                         => 'required|string|max:255',
            'levels.*.material_ids'                 => 'nullable|array',
            'levels.*.material_ids.*'               => 'integer|exists:materials,id',
            'levels.*.section_local_ids'            => 'nullable|array',
            'levels.*.section_local_ids.*'          => 'string',
            'levels.*.section_material_map'         => 'nullable|array',
            'levels.*.sharing_map'                  => 'nullable|array',
            'deleted_level_ids'                     => 'nullable|array',
            'deleted_level_ids.*'                   => 'integer|exists:levels,id',
            'deleted_section_ids'                   => 'nullable|array',
            'deleted_section_ids.*'                 => 'integer|exists:sections,id',
        ];
    }
}
