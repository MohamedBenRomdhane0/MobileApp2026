<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $admin = \App\Models\User::create([
            'full_name' => 'Admin',
            'email' => 'admin@abajim.com',
            'password' => bcrypt('admin'),
        ]);

        // Assign 'admin' role to the user
        $admin->assignRole('admin');
        
    }
}
