<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class LevelMaterialSeeder extends Seeder
{
    public function run(): void
    {
        // Material name to ID mapping
        $materialMap = DB::table('materials')->pluck('id', 'name');

        // Level name to ID mapping
        $levelMap = DB::table('levels')->pluck('id', 'name');

        $now = Carbon::now();

        $relations = [
            'year_1' => ['mat_arabic', 'mat_math'],
            'year_2' => ['mat_arabic', 'mat_math'],
            'year_3' => ['mat_arabic', 'mat_math', 'mat_science', 'mat_french'],
            'year_4' => ['mat_arabic', 'mat_math', 'mat_science', 'mat_french'],
            'year_5' => ['mat_arabic', 'mat_math', 'mat_science', 'mat_french', 'mat_english'],
            'year_6' => ['mat_arabic', 'mat_math', 'mat_science', 'mat_french', 'mat_social', 'mat_english'],
        ];

        $data = [];

        foreach ($relations as $levelName => $materialNames) {
            $levelId = $levelMap[$levelName];

            foreach ($materialNames as $materialName) {
                $data[] = [
                    'level_id' => $levelId,
                    'material_id' => $materialMap[$materialName],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('level_materials')->insert($data);
    }
}
