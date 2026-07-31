<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Level;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [['name' => 'year_1'], ['name' => 'year_2'], ['name' => 'year_3'], ['name' => 'year_4'], ['name' => 'year_5'], ['name' => 'year_6']];

        foreach ($levels as $level) {
            Level::updateOrCreate(['name' => $level['name']], $level);
        }
    }
}
