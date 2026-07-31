<?php

namespace Database\Seeders;

use App\Enum\RoleEnum;
use App\Enum\PermissionsEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (RoleEnum::cases() as $role) {
            Role::firstOrCreate(['name' => $role->value, 'guard_name' => 'api']);
        }

        $adminRole = Role::where('name', RoleEnum::ADMIN->value)->where('guard_name', 'api')->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::query()->where('guard_name', 'api')->get());
        }

        $teacherRole = Role::where('name', RoleEnum::TEACHER->value)->where('guard_name', 'api')->first();
        if ($teacherRole) {
            $teacherPermissions = Permission::query()
                ->where('guard_name', 'api')
                ->whereIn('name', [
                    PermissionsEnum::DASHBOARD_TEACHER->value,
                    PermissionsEnum::TEACHER_MANAGE_MATERIALS->value,
                    PermissionsEnum::TEACHER_VIEW_CHANNEL->value,
                    PermissionsEnum::TEACHER_VIEW_MEETINGS->value,
                    PermissionsEnum::TEACHER_VIEW_FINANCES->value,
                    PermissionsEnum::TEACHER_VIEW_SETTINGS->value,
                    // Books
                    PermissionsEnum::BOOK_READ->value,
                    PermissionsEnum::BOOK_CREATE->value,
                    PermissionsEnum::BOOK_UPDATE->value,
                    PermissionsEnum::BOOK_DELETE->value,
                    PermissionsEnum::BOOK_SET_LANGUAGE->value,
                    PermissionsEnum::BOOK_UPLOAD_MEDIA->value,
                    PermissionsEnum::BOOK_MANAGE_MEDIA->value,
                    // Book modules
                    PermissionsEnum::BOOK_MODULE_READ->value,
                    PermissionsEnum::BOOK_MODULE_CREATE->value,
                    PermissionsEnum::BOOK_MODULE_UPDATE->value,
                    PermissionsEnum::BOOK_MODULE_DELETE->value,
                    // Discount templates (read-only for teachers)
                    PermissionsEnum::DISCOUNT_TEMPLATE_READ->value,
                ])
                ->get();
            $teacherRole->syncPermissions($teacherPermissions);
        }

        $staffRole = Role::where('name', RoleEnum::STAFF->value)->where('guard_name', 'api')->first();
        if ($staffRole) {
            $staffPermissions = Permission::query()
                ->where('guard_name', 'api')
                ->whereIn('name', [
                    PermissionsEnum::DASHBOARD_STAFF->value,
                    PermissionsEnum::FINANCE_READ->value,
                    PermissionsEnum::SUPPORT_READ->value,
                    PermissionsEnum::CRM_READ->value,
                    PermissionsEnum::MARKETING_READ->value,
                    PermissionsEnum::MEETING_READ->value,
                    PermissionsEnum::QUIZ_READ->value,
                    PermissionsEnum::AI_READ->value,
                ])
                ->get();
            $staffRole->syncPermissions($staffPermissions);
        }
    }
}
