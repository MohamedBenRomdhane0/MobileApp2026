<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    // ====================== ROLES ======================
    case ROLE_CREATE             = 'roles.create';
    case ROLE_READ               = 'roles.read';
    case ROLE_UPDATE             = 'roles.update';
    case ROLE_DELETE             = 'roles.delete';
    case ROLE_ASSIGN             = 'roles.assign';
    case ROLE_ASSIGN_PERMISSIONS = 'roles.assign-permissions';

    // ====================== PERMISSIONS ======================
    case PERMISSION_READ = 'permissions.read';

    // ====================== USERS (all user types) ======================
    case USER_CREATE      = 'users.create';
    case USER_READ        = 'users.read';
    case USER_UPDATE      = 'users.update';
    case USER_DELETE      = 'users.delete';
    case USER_IMPERSONATE = 'users.impersonate';
    case USER_STATS       = 'users.stats';

    // ====================== DASHBOARDS ======================
    case DASHBOARD_ADMIN   = 'dashboards.admin';
    case DASHBOARD_TEACHER = 'dashboards.teacher';
    case DASHBOARD_STAFF   = 'dashboards.staff';

    // ====================== BOOKS (content + media) ======================
    case BOOK_CREATE         = 'books.create';
    case BOOK_READ           = 'books.read';
    case BOOK_UPDATE         = 'books.update';
    case BOOK_DELETE         = 'books.delete';
    case BOOK_VALIDATE       = 'books.validate';
    case BOOK_SET_LANGUAGE   = 'books.set-language';
    case BOOK_UPLOAD_MEDIA   = 'books.upload-media';
    case BOOK_MANAGE_MEDIA   = 'books.manage-media';
    case BOOK_VALIDATE_MEDIA = 'books.validate-media';

    // ====================== BOOK MODULES ======================
    case BOOK_MODULE_CREATE = 'book-modules.create';
    case BOOK_MODULE_READ   = 'book-modules.read';
    case BOOK_MODULE_UPDATE = 'book-modules.update';
    case BOOK_MODULE_DELETE = 'book-modules.delete';

    // ====================== COURSES ======================
    case COURSE_CREATE       = 'courses.create';
    case COURSE_READ         = 'courses.read';
    case COURSE_UPDATE       = 'courses.update';
    case COURSE_DELETE       = 'courses.delete';
    case COURSE_UPLOAD_VIDEO = 'courses.upload-video';

    // ====================== LEVELS ======================
    case LEVEL_CREATE           = 'levels.create';
    case LEVEL_READ             = 'levels.read';
    case LEVEL_UPDATE           = 'levels.update';
    case LEVEL_DELETE           = 'levels.delete';
    case LEVEL_ASSIGN_MATERIALS = 'levels.assign-materials';

    // ====================== MATERIALS ======================
    case MATERIAL_CREATE = 'materials.create';
    case MATERIAL_READ   = 'materials.read';
    case MATERIAL_UPDATE = 'materials.update';
    case MATERIAL_DELETE = 'materials.delete';

    // ====================== SECTIONS ======================
    case SECTION_CREATE           = 'sections.create';
    case SECTION_READ             = 'sections.read';
    case SECTION_UPDATE           = 'sections.update';
    case SECTION_DELETE           = 'sections.delete';
    case SECTION_ASSIGN_MATERIALS = 'sections.assign-materials';

    // ====================== PLANS (includes features) ======================
    case PLAN_CREATE          = 'plans.create';
    case PLAN_READ            = 'plans.read';
    case PLAN_UPDATE          = 'plans.update';
    case PLAN_DELETE          = 'plans.delete';
    case PLAN_MANAGE_FEATURES = 'plans.manage-features';

    // ====================== MEETINGS ======================
    case MEETING_CREATE = 'meetings.create';
    case MEETING_READ   = 'meetings.read';
    case MEETING_UPDATE = 'meetings.update';
    case MEETING_DELETE = 'meetings.delete';

    // ====================== FINANCES ======================
    case FINANCE_READ   = 'finances.read';
    case SUPPORT_READ   = 'support.read';
    case CRM_READ       = 'crm.read';
    case MARKETING_READ = 'marketing.read';
    case QUIZ_READ      = 'quiz.read';
    case AI_READ        = 'ai.read';

    // ====================== DISCOUNT TEMPLATES ======================
    case DISCOUNT_TEMPLATE_CREATE = 'discount-templates.create';
    case DISCOUNT_TEMPLATE_READ   = 'discount-templates.read';
    case DISCOUNT_TEMPLATE_UPDATE = 'discount-templates.update';
    case DISCOUNT_TEMPLATE_DELETE = 'discount-templates.delete';

    // ====================== SERVICES ======================
    case SERVICE_READ      = 'services.read';
    case SERVICE_CONFIGURE = 'services.configure';

    // ====================== TEACHER FEATURES ======================
    case TEACHER_MANAGE_MATERIALS = 'teacher.manage-materials';
    case TEACHER_VIEW_CHANNEL     = 'teacher.view-channel';
    case TEACHER_VIEW_MEETINGS    = 'teacher.view-meetings';
    case TEACHER_VIEW_FINANCES    = 'teacher.view-finances';
    case TEACHER_VIEW_SETTINGS    = 'teacher.view-settings';

    public function middleware(): string
    {
        return 'permission:' . $this->value;
    }

    public function label(): string
    {
        $action = explode('.', $this->value, 2)[1] ?? $this->value;
        return ucwords(str_replace('-', ' ', $action));
    }

    public function module(): string
    {
        $prefix = explode('.', $this->value, 2)[0] ?? $this->value;
        return ucwords(str_replace('-', ' ', $prefix));
    }

    /**
     * @return array<string, self[]>
     */
    public static function getPermissionsByModule(): array
    {
        $grouped = [];
        foreach (self::cases() as $permission) {
            $grouped[$permission->module()][] = $permission;
        }
        return $grouped;
    }

    public static function getModuleForPermission(string $permissionName): string
    {
        $prefix = explode('.', $permissionName, 2)[0] ?? 'Other';
        return ucwords(str_replace('-', ' ', $prefix));
    }
}
