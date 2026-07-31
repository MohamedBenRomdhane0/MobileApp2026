<?php

namespace App\Http\Requests\Level;

use App\Models\CeoSetting;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLevelRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'name_ar'       => 'nullable|string|max:255',
            'name_fr'       => 'nullable|string|max:255',
            'level_type_id' => 'nullable|integer|exists:level_types,id',
            'material_ids'  => 'nullable|array',
            'material_ids.*' => 'integer|exists:materials,id',
            'ceo_code'      => ['required', 'string', function ($_, $value, $fail) {
                $setting = CeoSetting::instance();
                if (!$setting->verify($value)) {
                    $fail(__('messages.invalid_ceo_code'));
                }
            }],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => __('messages.levels.level_name_required'),
        ];
    }
}
