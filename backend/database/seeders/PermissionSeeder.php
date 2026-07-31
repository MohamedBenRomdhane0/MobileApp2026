<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use App\Enum\PermissionsEnum;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (PermissionsEnum::cases() as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission->value, 'guard_name' => 'api'],
                []
            );
        }
    }
}
