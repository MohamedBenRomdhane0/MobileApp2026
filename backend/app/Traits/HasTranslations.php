<?php

namespace App\Traits;

use App\Models\Translation;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasTranslations
{
    public function translations(): MorphMany
    {
        return $this->morphMany(Translation::class, 'model');
    }

    public function getTranslation(string $field, string $locale): ?string
    {
        $translation = $this->translations()
            ->where('key', $field)
            ->where('locale', $locale)
            ->first();

        return $translation?->text ?? $this->$field;
    }

    public function setTranslation(string $field, string $locale, ?string $value): void
    {
        $this->translations()->updateOrCreate(
            [
                'key' => $field,
                'locale' => $locale,
            ],
            [
                'text' => $value,
            ]
        );
    }

    public function getAllTranslations(string $field): array
    {
        $translations = $this->translations()
            ->where('key', $field)
            ->get()
            ->pluck('text', 'locale')
            ->toArray();

        return array_merge([
            'en' => $this->$field,
        ], $translations);
    }
}
