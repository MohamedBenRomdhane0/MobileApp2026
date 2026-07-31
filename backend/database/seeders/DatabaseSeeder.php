<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\PermissionSeeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([PermissionSeeder::class]);
        $this->call([RoleSeeder::class]);
        $this->call([LevelTypeSeeder::class]);
        $this->call([UserSeeder::class]);
        $this->call([ServicesSeeder::class]);

    }
}
