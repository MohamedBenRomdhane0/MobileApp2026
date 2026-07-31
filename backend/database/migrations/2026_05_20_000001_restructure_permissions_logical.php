<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $renames = [
            'roles.view'                          => 'roles.read',
            'permissions.view'                    => 'permissions.read',
            'users.view'                          => 'users.read',
            'statistics.view'                     => 'users.stats',
            'levels.view'                         => 'levels.read',
            'materials.view'                      => 'materials.read',
            'sections.view'                       => 'sections.read',
            'plans.view'                          => 'plans.read',
            'books.view'                          => 'books.read',
            'books.set-language'                  => 'books.set-language',
            'book-modules.view'                   => 'book-modules.read',
            'book-icons.validate-media'           => 'books.validate-media',
            'book-icons.create'                   => 'books.upload-media',
            'book-icons.update'                   => 'books.manage-media',
            'book-videos.upload'                  => 'books.upload-media',
            'courses.view'                        => 'courses.read',
            'courses.upload-chapter-video'        => 'courses.upload-video',
            'discount-templates.view'             => 'discount-templates.read',
            'services.view'                       => 'services.read',
            'finance.view-admin'                  => 'finances.read',
            'support.view-admin'                  => 'support.read',
            'crm.view-admin'                      => 'crm.read',
            'marketing.view-admin'                => 'marketing.read',
            'quiz.view-admin'                     => 'quiz.read',
            'ai-conversion.view-admin'            => 'ai.read',
            'teachers.set-level-materials'        => 'teacher.manage-materials',
            'teachers.view-channel'               => 'teacher.view-channel',
            'teachers.view-meetings'              => 'teacher.view-meetings',
            'dashboards.admin'                    => 'dashboards.admin',
            'dashboards.teacher'                  => 'dashboards.teacher',
            'dashboards.staff'                    => 'dashboards.staff',
        ];

        foreach ($renames as $old => $new) {
            if ($old === $new) continue;

            $existing = Permission::where('name', $old)->where('guard_name', 'api')->first();
            $target   = Permission::where('name', $new)->where('guard_name', 'api')->first();

            if ($existing && !$target) {
                $existing->update(['name' => $new]);
            } elseif ($existing && $target) {
                // Fetch role IDs that already have the target permission (to avoid duplicates)
                $alreadyHasTarget = DB::table('role_has_permissions')
                    ->where('permission_id', $target->id)
                    ->pluck('role_id')
                    ->toArray();

                // Move assignments from old permission to new, skipping duplicates
                DB::table('role_has_permissions')
                    ->where('permission_id', $existing->id)
                    ->when(!empty($alreadyHasTarget), fn ($q) => $q->whereNotIn('role_id', $alreadyHasTarget))
                    ->update(['permission_id' => $target->id]);

                DB::table('role_has_permissions')->where('permission_id', $existing->id)->delete();
                DB::table('model_has_permissions')->where('permission_id', $existing->id)->delete();
                $existing->delete();
            }
        }

        $newPermissions = [
            'plans.manage-features',
            'services.configure',
        ];

        foreach ($newPermissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'api']);
        }

        $toDelete = [
            'teachers.view', 'teachers.create', 'teachers.update', 'teachers.delete',
            'teachers.view-level-materials',
            'parents.view', 'parents.edit', 'parents.delete', 'parents.create',
            'children.create', 'children.delete', 'children.edit',
            'staff.view', 'staff.create', 'staff.update', 'staff.delete',
            'users.view-details', 'users.exit-impersonation',
            'users.generate-impersonation-token', 'users.update-profile',
            'books.view-teacher', 'books.view-admin', 'books.view-ministry', 'books.view-teacher-books',
            'book-icons.view', 'book-icons.delete', 'book-icons.delete-with-media',
            'book-icons.resize',
            'book-videos.view', 'book-videos.view-single',
            'book-videos.update', 'book-videos.delete', 'book-videos.sync',
            'book-videos.view-status', 'book-videos.view-transcoding-status',
            'books.invalidate',
            'courses.view-by-level', 'courses.view-by-material',
            'courses.view-favorites', 'courses.toggle-favorites',
            'courses.view-teacher', 'courses.view-admin',
            'plans.view-details', 'plan-features.view',
            'plan-features.create', 'plan-features.update', 'plan-features.delete',
            'financial.view-meetings', 'financial.view-cards',
            'financial.view-card-reservations', 'financial.view-payment-proofs',
            'finance.view-staff',
            'payments.view-admin', 'payments.view-staff',
            'support.view-staff',
            'crm.view-staff',
            'marketing.view-staff',
            'meetings.view-admin', 'meetings.view-staff',
            'quiz.view-staff',
            'ai-conversion.view-staff',
            // level-types
            'level-types.view',
        ];

        foreach ($toDelete as $name) {
            $perm = Permission::where('name', $name)->where('guard_name', 'api')->first();
            if ($perm) {
                DB::table('role_has_permissions')->where('permission_id', $perm->id)->delete();
                DB::table('model_has_permissions')->where('permission_id', $perm->id)->delete();
                $perm->delete();
            }
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        // Intentionally not reversible — re-run the original PermissionSeeder to restore
    }
};
