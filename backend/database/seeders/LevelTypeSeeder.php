<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LevelType;

class LevelTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name'     => 'primaire',
                'translations' => [
                    ['locale' => 'fr', 'key' => 'name', 'text' => 'Ecole Primaire'],
                    ['locale' => 'ar', 'key' => 'name', 'text' => 'ابتدائي'],
                    ['locale' => 'en', 'key' => 'name', 'text' => 'Primary School'],
                ],
            ],
            [
                'name'     => 'college',
                'translations' => [
                    ['locale' => 'fr', 'key' => 'name', 'text' => 'Collège'],
                    ['locale' => 'ar', 'key' => 'name', 'text' => 'إعدادي'],
                    ['locale' => 'en', 'key' => 'name', 'text' => 'Middle School'],
                ],
            ],
            [
                'name'     => 'lycee',
                'translations' => [
                    ['locale' => 'fr', 'key' => 'name', 'text' => 'Lycée'],
                    ['locale' => 'ar', 'key' => 'name', 'text' => 'ثانوي'],
                    ['locale' => 'en', 'key' => 'name', 'text' => 'High School'],
                ],
            ],
        ];

        foreach ($types as $type) {
            $levelType = LevelType::updateOrCreate(
                ['name' => $type['name']]
            );

            foreach ($type['translations'] as $translation) {
                $levelType->setTranslation(
                    $translation['key'],
                    $translation['locale'],
                    $translation['text']
                );
            }
        }
    }
}
