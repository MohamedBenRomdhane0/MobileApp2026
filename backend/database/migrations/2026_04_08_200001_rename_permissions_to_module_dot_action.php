<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{

    private array $map = [
        // Roles
        'CREATE_ROLE'                    => 'roles.create',
        'VIEW_ROLE'                      => 'roles.view',
        'UPDATE_ROLE'                    => 'roles.update',
        'DELETE_ROLE'                    => 'roles.delete',
        'ASSIGN_ROLE'                    => 'roles.assign',
        'ASSIGN_PERMISSIONS'             => 'roles.assign-permissions',

        // Permissions
        'VIEW_PERMISSION'                => 'permissions.view',

        // Users
        'CREATE_USER'                    => 'users.create',
        'UPDATE_USER'                    => 'users.update',
        'DELETE_USER'                    => 'users.delete',
        'VIEW_USER_DETAILS'              => 'users.view-details',
        'VIEW_USERS'                     => 'users.view',
        'IMPERSONATE_USER'               => 'users.impersonate',
        'EXIT_IMPERSONATION'             => 'users.exit-impersonation',
        'GENERATE_IMPERSONATION_TOKEN'   => 'users.generate-impersonation-token',
        'UPDATE_USER_PROFILE'            => 'users.update-profile',

        // Teachers
        'VIEW_TEACHERS'                  => 'teachers.view',
        'CREATE_TEACHER'                 => 'teachers.create',
        'UPDATE_TEACHER'                 => 'teachers.update',
        'DELETE_TEACHER'                 => 'teachers.delete',
        'SET_TEACHER_LEVEL_MATERIALS'    => 'teachers.set-level-materials',
        'VIEW_TEACHER_LEVEL_MATERIALS'   => 'teachers.view-level-materials',
        'VIEW_MY_CHANNEL'                => 'teachers.view-channel',

        // Parents
        'VIEW_PARENTS'                   => 'parents.view',
        'EDIT_PARENT'                    => 'parents.edit',
        'DELETE_PARENT'                  => 'parents.delete',
        'CREATE_PARENT'                  => 'parents.create',

        // Children
        'CREATE_CHILD'                   => 'children.create',
        'DELETE_CHILD'                   => 'children.delete',
        'EDIT_CHILD'                     => 'children.edit',

        // Staff
        'VIEW_STAFF'                     => 'staff.view',
        'CREATE_STAFF'                   => 'staff.create',
        'UPDATE_STAFF'                   => 'staff.update',
        'DELETE_STAFF'                   => 'staff.delete',

        // Levels
        'CREATE_LEVEL'                   => 'levels.create',
        'VIEW_LEVEL'                     => 'levels.view',
        'UPDATE_LEVEL'                   => 'levels.update',
        'DELETE_LEVEL'                   => 'levels.delete',
        'ASSIGN_MATERIALS_TO_LEVEL'      => 'levels.assign-materials',

        // Materials
        'CREATE_MATERIAL'                => 'materials.create',
        'VIEW_MATERIAL'                  => 'materials.view',
        'UPDATE_MATERIAL'                => 'materials.update',
        'DELETE_MATERIAL'                => 'materials.delete',

        // Level Types
        'VIEW_LEVEL_TYPE'                => 'level-types.view',

        // Sections
        'CREATE_SECTION'                 => 'sections.create',
        'VIEW_SECTION'                   => 'sections.view',
        'UPDATE_SECTION'                 => 'sections.update',
        'DELETE_SECTION'                 => 'sections.delete',
        'ASSIGN_MATERIALS_TO_SECTION'    => 'sections.assign-materials',

        // Dashboards
        'VIEW_DASHBOARD_ADMIN'           => 'dashboards.admin',
        'VIEW_DASHBOARD_TEACHER'         => 'dashboards.teacher',
        'VIEW_DASHBOARD_STAFF'           => 'dashboards.staff',

        // Statistics
        'VIEW_STATS'                     => 'statistics.view',

        // Books
        'CREATE_BOOK'                    => 'books.create',
        'VIEW_BOOK'                      => 'books.view',
        'UPDATE_BOOK'                    => 'books.update',
        'DELETE_BOOK'                    => 'books.delete',
        'VALIDATE_BOOK'                  => 'books.validate',
        'INVALIDATE_BOOK'                => 'books.invalidate',
        'SET_BOOK_LANGUAGE'              => 'books.set-language',
        'VIEW_BOOKS_TEACHER'             => 'books.view-teacher',
        'VIEW_BOOKS_ADMIN'               => 'books.view-admin',
        'VIEW_MINISTRY_BOOKS'            => 'books.view-ministry',
        'VIEW_TEACHER_BOOKS'             => 'books.view-teacher-books',

        // Book Icons
        'CREATE_BOOK_ICON'               => 'book-icons.create',
        'VIEW_BOOK_ICON'                 => 'book-icons.view',
        'UPDATE_BOOK_ICON'               => 'book-icons.update',
        'DELETE_BOOK_ICON'               => 'book-icons.delete',
        'DELETE_BOOK_ICON_WITH_MEDIA'    => 'book-icons.delete-with-media',
        'RESIZE_BOOK_ICON'               => 'book-icons.resize',

        // Book Videos
        'VIEW_BOOK_VIDEOS'               => 'book-videos.view',
        'UPLOAD_BOOK_VIDEO'              => 'book-videos.upload',
        'VIEW_BOOK_VIDEO'                => 'book-videos.view-single',
        'UPDATE_BOOK_VIDEO'              => 'book-videos.update',
        'DELETE_BOOK_VIDEO'              => 'book-videos.delete',
        'SYNC_BOOK_VIDEO'                => 'book-videos.sync',
        'VIEW_BOOK_VIDEO_STATUS'         => 'book-videos.view-status',
        'VIEW_BOOK_VIDEO_TRANSCODING_STATUS' => 'book-videos.view-transcoding-status',

        // Book Modules
        'CREATE_BOOK_MODULE'             => 'book-modules.create',
        'VIEW_BOOK_MODULE'               => 'book-modules.view',
        'UPDATE_BOOK_MODULE'             => 'book-modules.update',
        'DELETE_BOOK_MODULE'             => 'book-modules.delete',

        // Courses
        'CREATE_COURSE'                  => 'courses.create',
        'VIEW_COURSE'                    => 'courses.view',
        'UPDATE_COURSE'                  => 'courses.update',
        'DELETE_COURSE'                  => 'courses.delete',
        'UPLOAD_COURSE_CHAPTER_VIDEO'    => 'courses.upload-chapter-video',
        'VIEW_COURSE_BY_LEVEL'           => 'courses.view-by-level',
        'VIEW_COURSE_BY_MATERIAL'        => 'courses.view-by-material',
        'VIEW_COURSE_FAVORITES'          => 'courses.view-favorites',
        'TOGGLE_COURSE_FAVORITES'        => 'courses.toggle-favorites',
        'VIEW_COURSES_TEACHER'           => 'courses.view-teacher',
        'VIEW_COURSES_ADMIN'             => 'courses.view-admin',

        // Plans
        'VIEW_PLAN_DETAILS'              => 'plans.view-details',
        'CREATE_PLAN'                    => 'plans.create',
        'UPDATE_PLAN'                    => 'plans.update',
        'DELETE_PLAN'                    => 'plans.delete',
        'VIEW_PLANS'                     => 'plans.view',
        'VIEW_PLAN_FEATURE'              => 'plan-features.view',
        'CREATE_PLAN_FEATURE'            => 'plan-features.create',
        'UPDATE_PLAN_FEATURE'            => 'plan-features.update',
        'DELETE_PLAN_FEATURE'            => 'plan-features.delete',

        // Meetings
        'CREATE_MEETING'                 => 'meetings.create',
        'VIEW_MEETING'                   => 'meetings.view',
        'UPDATE_MEETING'                 => 'meetings.update',
        'DELETE_MEETING'                 => 'meetings.delete',

        // Financial
        'VIEW_MEETINGS'                  => 'financial.view-meetings',
        'VIEW_CARDS'                     => 'financial.view-cards',
        'VIEW_CARD_RESERVATIONS'         => 'financial.view-card-reservations',
        'VIEW_PAYMENT_PROOFS'            => 'financial.view-payment-proofs',
    ];

    public function up(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach ($this->map as $old => $new) {
            $alreadyExists = DB::table('permissions')
                ->where('name', $new)
                ->where('guard_name', 'api')
                ->exists();

            if ($alreadyExists) continue;

            DB::table('permissions')
                ->where('name', $old)
                ->where('guard_name', 'api')
                ->update(['name' => $new]);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach ($this->map as $old => $new) {
            DB::table('permissions')
                ->where('name', $new)
                ->where('guard_name', 'api')
                ->update(['name' => $old]);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
