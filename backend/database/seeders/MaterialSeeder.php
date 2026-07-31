<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class MaterialSeeder extends Seeder
{
    public function run(): void
    {
        $materials = [
            'mat_arabic',
            'mat_math',
            'mat_science',
            'mat_french',
            'mat_social',
            'mat_english',
        ];

        foreach ($materials as $material) {
            DB::table('materials')->insert([
                'name' => $material,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
